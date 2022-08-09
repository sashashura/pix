const pick = require('lodash/pick');
const CampaignParticipant = require('../../domain/models/CampaignParticipant');
const CampaignToStartParticipation = require('../../domain/models/CampaignToStartParticipation');
const CampaignParticipationStatuses = require('../../domain/models/CampaignParticipationStatuses');
const { AlreadyExistingCampaignParticipationError, NotFoundError } = require('../../domain/errors');
const skillDatasource = require('../datasources/learning-content/skill-datasource');
const { knex } = require('../../../db/knex-database-connection');
const campaignRepository = require('./campaign-repository');

async function save(campaignParticipant, domainTransaction) {
  if (campaignParticipant.organizationLearner) {
    const newlyCreatedOrganizationLearnerId = await _createNewOrganizationLearner(
      campaignParticipant.organizationLearner,
      domainTransaction.knexTransaction
    );
    campaignParticipant.campaignParticipation.organizationLearnerId = newlyCreatedOrganizationLearnerId;
  }

  if (campaignParticipant.previousCampaignParticipationForUser) {
    await _updatePreviousParticipation(
      campaignParticipant.previousCampaignParticipationForUser,
      domainTransaction.knexTransaction
    );
  } else {
    await campaignRepository.incrementParticipationsCount(
      campaignParticipant.campaignParticipation.campaignId,
      domainTransaction
    );
  }
  const campaignParticipationId = await _createNewCampaignParticipation(
    campaignParticipant.campaignParticipation,
    domainTransaction.knexTransaction
  );

  await _createAssessment(campaignParticipant.assessment, campaignParticipationId, domainTransaction.knexTransaction);
  return campaignParticipationId;
}

async function _createNewOrganizationLearner(organizationLearner, queryBuilder) {
  const [{ id }] = await queryBuilder('organization-learners')
    .insert({
      userId: organizationLearner.userId,
      organizationId: organizationLearner.organizationId,
      firstName: organizationLearner.firstName,
      lastName: organizationLearner.lastName,
    })
    .returning('id');
  return id;
}

async function _updatePreviousParticipation(campaignParticipation, queryBuilder) {
  await queryBuilder('campaign-participations')
    .update({ isImproved: campaignParticipation.isImproved })
    .where({ id: campaignParticipation.id });
}

async function _createNewCampaignParticipation(campaignParticipation, queryBuilder) {
  try {
    const [{ id }] = await queryBuilder('campaign-participations')
      .insert({
        campaignId: campaignParticipation.campaignId,
        userId: campaignParticipation.userId,
        status: campaignParticipation.status,
        organizationLearnerId: campaignParticipation.organizationLearnerId,
        participantExternalId: campaignParticipation.participantExternalId,
      })
      .returning('id');

    return id;
  } catch (error) {
    if (error.constraint === 'campaign_participations_campaignid_userid_isimproved_deleted') {
      throw new AlreadyExistingCampaignParticipationError(
        `User ${campaignParticipation.userId} has already a campaign participation with campaign ${campaignParticipation.campaignId}`
      );
    }
    throw error;
  }
}

async function _createAssessment(assessment, campaignParticipationId, queryBuilder) {
  if (assessment) {
    const assessmentAttributes = pick(assessment, ['userId', 'method', 'state', 'type', 'courseId', 'isImproving']);
    await queryBuilder('assessments').insert({ campaignParticipationId, ...assessmentAttributes });
  }
}

async function get({ userId, campaignId, domainTransaction }) {
  const userIdentity = await _getUserIdentityForTrainee(userId, domainTransaction);

  const campaignToStartParticipation = await _getCampaignToStart(campaignId, domainTransaction);

  const organizationLearner = await _getOrganizationLearner(campaignId, userId, domainTransaction);

  const previousCampaignParticipationForUser = await _findPreviousCampaignParticipationForUser(
    campaignId,
    userId,
    domainTransaction
  );

  return new CampaignParticipant({
    userIdentity,
    campaignToStartParticipation,
    organizationLearner,
    previousCampaignParticipationForUser,
  });
}

function _getUserIdentityForTrainee(userId, domainTransaction) {
  return domainTransaction.knexTransaction('users').select('id', 'firstName', 'lastName').where({ id: userId }).first();
}

async function _getCampaignToStart(campaignId, domainTransaction) {
  const campaignAttributes = await domainTransaction
    .knexTransaction('campaigns')
    .join('organizations', 'organizations.id', 'organizationId')
    .select([
      'campaigns.id',
      'campaigns.type',
      'idPixLabel',
      'campaigns.archivedAt',
      'isManagingStudents AS isRestricted',
      'multipleSendings',
      'assessmentMethod',
      'organizationId',
    ])
    .where({ 'campaigns.id': campaignId })
    .first();

  if (!campaignAttributes) {
    throw new NotFoundError(`La campagne d'id ${campaignId} n'existe pas ou son accès est restreint`);
  }
  const skillIds = await domainTransaction
    .knexTransaction('target-profiles_skills')
    .join('campaigns', 'campaigns.targetProfileId', 'target-profiles_skills.targetProfileId')
    .where({ 'campaigns.id': campaignId })
    .pluck('skillId');

  const skills = await skillDatasource.findOperativeByRecordIds(skillIds);

  return new CampaignToStartParticipation({ ...campaignAttributes, skillCount: skills.length });
}

async function _getOrganizationLearner(campaignId, userId, domainTransaction) {
  const organizationLearner = { id: null, hasParticipated: false };
  const row = await domainTransaction
    .knexTransaction('campaigns')
    .select({ id: 'organization-learners.id', campaignParticipationId: 'campaign-participations.id' })
    .join('organization-learners', 'organization-learners.organizationId', 'campaigns.organizationId')
    .leftJoin(
      'campaign-participations',
      function () {
        this.on('campaign-participations.organizationLearnerId', 'organization-learners.id');
        this.on('campaign-participations.campaignId', 'campaigns.id');
        this.on('campaign-participations.deletedAt', knex.raw('IS'), knex.raw('NULL'));
        this.on('campaign-participations.isImproved', knex.raw('false'));
        this.on('campaign-participations.userId', '!=', 'organization-learners.userId');
      },
      'organization-learners.id'
    )
    .where({
      'campaigns.id': campaignId,
      'organization-learners.userId': userId,
      isDisabled: false,
    })
    .first();

  if (row) {
    organizationLearner.id = row.id;
    organizationLearner.hasParticipated = Boolean(row.campaignParticipationId);
  }
  return organizationLearner;
}

async function _findPreviousCampaignParticipationForUser(campaignId, userId, domainTransaction) {
  const campaignParticipationAttributes = await domainTransaction
    .knexTransaction('campaign-participations')
    .select('id', 'participantExternalId', 'validatedSkillsCount', 'status', 'deletedAt')
    .where({ campaignId, userId, isImproved: false })
    .first();

  if (!campaignParticipationAttributes) return null;
  return {
    id: campaignParticipationAttributes.id,
    participantExternalId: campaignParticipationAttributes.participantExternalId,
    validatedSkillsCount: campaignParticipationAttributes.validatedSkillsCount,
    status: campaignParticipationAttributes.status,
    isDeleted: Boolean(campaignParticipationAttributes.deletedAt),
  };
}

async function deleteCampaignParticipations({ userId, campaignId, organizationLearnerId, domainTransaction }) {
  const deletedAt = new Date();
  const result = await domainTransaction
    .knexTransaction('campaign-participations')
    .where({ campaignId, organizationLearnerId })
    .update({ deletedAt, deletedBy: userId })
    .returning('status');

  await campaignRepository.decrementParticipationsCount(campaignId, domainTransaction);

  if (result.some(({ status }) => status === CampaignParticipationStatuses.SHARED)) {
    await campaignRepository.decrementSharedParticipationsCount(campaignId, domainTransaction);
  }
}

module.exports = {
  get,
  save,
  delete: deleteCampaignParticipations,
};
