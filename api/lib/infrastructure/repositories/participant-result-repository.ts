// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentResult = require('../../domain/read-models/participant-results/AssessmentResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillDatas... Remove this comment to see the full error message
const skillDatasource = require('../datasources/learning-content/skill-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceRepository = require('./competence-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('./knowledge-element-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'flashAsses... Remove this comment to see the full error message
const flashAssessmentResultRepository = require('./flash-assessment-result-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');

const ParticipantResultRepository = {
  async getByUserIdAndCampaignId({
    userId,
    campaignId,
    locale
  }: $TSFixMe) {
    const [
      participationResults,
      targetProfile,
      isCampaignMultipleSendings,
      isOrganizationLearnerActive,
      isCampaignArchived,
    ] = await Promise.all([
      _getParticipationResults(userId, campaignId),
      _getTargetProfile(campaignId, locale),
      _isCampaignMultipleSendings(campaignId),
      _isOrganizationLearnerActive(userId, campaignId),
      _isCampaignArchived(campaignId),
    ]);

    return new AssessmentResult(
      participationResults,
      targetProfile,
      isCampaignMultipleSendings,
      isOrganizationLearnerActive,
      isCampaignArchived
    );
  },
};

async function _getParticipationResults(userId: $TSFixMe, campaignId: $TSFixMe) {
  const {
    isCompleted,
    campaignParticipationId,
    sharedAt,
    assessmentCreatedAt,
    participantExternalId,
    masteryRate,
    isFlash,
    assessmentId,
    isDeleted,
  } = await _getParticipationAttributes(userId, campaignId);

  const knowledgeElements = await _findTargetedKnowledgeElements(campaignId, userId, sharedAt);

  const acquiredBadgeIds = await _getAcquiredBadgeIds(userId, campaignParticipationId);

  let estimatedFlashLevel;
  if (isFlash) estimatedFlashLevel = await _getEstimatedFlashLevel(assessmentId);

  return {
    campaignParticipationId,
    isCompleted,
    sharedAt,
    assessmentCreatedAt,
    participantExternalId,
    knowledgeElements,
    masteryRate,
    acquiredBadgeIds: acquiredBadgeIds.map(({
      badgeId
    }: $TSFixMe) => badgeId),
    estimatedFlashLevel,
    isDeleted,
  };
}

async function _getParticipationAttributes(userId: $TSFixMe, campaignId: $TSFixMe) {
  const participationAttributes = await knex('campaign-participations')
    .select([
      'state',
      'campaignParticipationId',
      'sharedAt',
      'assessments.createdAt AS assessmentCreatedAt',
      'participantExternalId',
      knex.raw('CAST("masteryRate" AS FLOAT)'),
      'method',
      'assessments.id AS assessmentId',
      'deletedAt',
    ])
    .join('assessments', 'campaign-participations.id', 'assessments.campaignParticipationId')
    .where({ 'campaign-participations.campaignId': campaignId })
    .andWhere({ 'campaign-participations.userId': userId })
    .andWhere('campaign-participations.isImproved', '=', false)
    .orderBy('assessments.createdAt', 'DESC')
    .first();

  if (!participationAttributes) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError(`Participation not found for user ${userId} and campaign ${campaignId}`);
  }

  const {
    state,
    campaignParticipationId,
    sharedAt,
    assessmentCreatedAt,
    participantExternalId,
    masteryRate,
    method,
    assessmentId,
    deletedAt,
  } = participationAttributes;

  return {
    isCompleted: state === Assessment.states.COMPLETED,
    campaignParticipationId,
    sharedAt,
    assessmentCreatedAt,
    participantExternalId,
    masteryRate,
    isFlash: method === Assessment.methods.FLASH,
    assessmentId,
    isDeleted: Boolean(deletedAt),
  };
}

async function _findTargetedKnowledgeElements(campaignId: $TSFixMe, userId: $TSFixMe, sharedAt: $TSFixMe) {
  const { targetProfileId } = await _getTargetProfileId(campaignId);
  const targetedSkillIds = await _findTargetedSkillIds(targetProfileId);
  const knowledgeElements = await knowledgeElementRepository.findUniqByUserId({ userId, limitDate: sharedAt });
  return knowledgeElements.filter(({
    skillId
  }: $TSFixMe) => targetedSkillIds.includes(skillId));
}

async function _getAcquiredBadgeIds(userId: $TSFixMe, campaignParticipationId: $TSFixMe) {
  return knex('badge-acquisitions').select('badgeId').where({ userId, campaignParticipationId });
}

// @ts-expect-error TS(2393): Duplicate function implementation.
async function _getTargetProfile(campaignId: $TSFixMe, locale: $TSFixMe) {
  const { targetProfileId } = await _getTargetProfileId(campaignId);

  const competences = await _findTargetedCompetences(targetProfileId, locale);
  const stages = await _getStages(targetProfileId);
  const badges = await _getBadges(targetProfileId);

  return { competences, stages, badges };
}

async function _getTargetProfileId(campaignId: $TSFixMe) {
  return knex('campaigns').select('targetProfileId').where({ 'campaigns.id': campaignId }).first();
}

function _getStages(targetProfileId: $TSFixMe) {
  return knex('stages').where({ targetProfileId });
}

async function _getBadges(targetProfileId: $TSFixMe) {
  const badges = await knex('badges').where({ targetProfileId });
  const competences = await _findSkillSet(badges);
  return badges.map((badge: $TSFixMe) => {
    const badgeCompetences = competences.filter(({
      badgeId
    }: $TSFixMe) => badgeId === badge.id);

    return {
      ...badge,
      badgeCompetences,
    };
  });
}

function _findSkillSet(badges: $TSFixMe) {
  return knex('skill-sets').whereIn(
    'badgeId',
    badges.map(({
      id
    }: $TSFixMe) => id)
  );
}

// @ts-expect-error TS(2393): Duplicate function implementation.
async function _findTargetedCompetences(targetProfileId: $TSFixMe, locale: $TSFixMe) {
  const targetedSkillIds = await _findTargetedSkillIds(targetProfileId);
  const competences = await competenceRepository.list({ locale });
  const targetedCompetences: $TSFixMe = [];

  competences.forEach((competence: $TSFixMe) => {
    const matchingSkills = _.intersection(competence.skillIds, targetedSkillIds);

    if (matchingSkills.length > 0) {
      targetedCompetences.push({
        id: competence.id,
        name: competence.name,
        index: competence.index,
        areaName: competence.area.name,
        areaColor: competence.area.color,
        skillIds: matchingSkills,
      });
    }
  });

  return targetedCompetences;
}

async function _findTargetedSkillIds(targetProfileId: $TSFixMe) {
  const targetProfileSkillIds = await knex('target-profiles_skills')
    .select('skillId')
    .where({ targetProfileId })
    .then((skills: $TSFixMe) => skills.map(({
    skillId
  }: $TSFixMe) => skillId));
  const targetedSkills = await skillDatasource.findOperativeByRecordIds(targetProfileSkillIds);
  return targetedSkills.map(({
    id
  }: $TSFixMe) => id);
}

async function _isCampaignMultipleSendings(campaignId: $TSFixMe) {
  const campaign = await knex('campaigns').select('multipleSendings').where({ 'campaigns.id': campaignId }).first();
  return campaign.multipleSendings;
}

async function _isCampaignArchived(campaignId: $TSFixMe) {
  const campaign = await knex('campaigns').select('archivedAt').where({ 'campaigns.id': campaignId }).first();
  return Boolean(campaign.archivedAt);
}

async function _isOrganizationLearnerActive(userId: $TSFixMe, campaignId: $TSFixMe) {
  const organizationLearner = await knex('organization-learners')
    .select('organization-learners.isDisabled')
    .join('organizations', 'organizations.id', 'organization-learners.organizationId')
    .join('campaigns', 'campaigns.organizationId', 'organizations.id')
    .where({ 'campaigns.id': campaignId })
    .andWhere({ 'organization-learners.userId': userId })
    .first();
  return !organizationLearner?.isDisabled;
}

async function _getEstimatedFlashLevel(assessmentId: $TSFixMe) {
  const flashAssessmentResult = await flashAssessmentResultRepository.getLatestByAssessmentId(assessmentId);
  return flashAssessmentResult?.estimatedLevel;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ParticipantResultRepository;
