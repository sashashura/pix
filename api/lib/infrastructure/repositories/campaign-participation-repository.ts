// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfC... Remove this comment to see the full error message
const BookshelfCampaignParticipation = require('../orm-models/CampaignParticipation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../domain/models/CampaignParticipationStatuses');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../../domain/models/CampaignTypes');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('./knowledge-element-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementSnapshotRepository = require('./knowledge-element-snapshot-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipation = require('../../domain/models/CampaignParticipation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED, TO_SHARE, STARTED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async hasAssessmentParticipations(userId: $TSFixMe) {
    const { count } = await knex('campaign-participations')
      .count('campaign-participations.id')
      .join('campaigns', 'campaigns.id', 'campaignId')
      .where('campaigns.type', '=', CampaignTypes.ASSESSMENT)
      .andWhere({ userId })
      .first();
    return count > 0;
  },
  async getCodeOfLastParticipationToProfilesCollectionCampaignForUser(userId: $TSFixMe) {
    const result = await knex('campaign-participations')
      .select('campaigns.code')
      .join('campaigns', 'campaigns.id', 'campaignId')
      .where({ userId })
      .whereNull('deletedAt')
      .whereNull('archivedAt')
      .andWhere({ status: TO_SHARE })
      .andWhere({ 'campaigns.type': CampaignTypes.PROFILES_COLLECTION })
      .orderBy('campaign-participations.createdAt', 'desc')
      .first();
    return result?.code || null;
  },
  async get(id: $TSFixMe, domainTransaction = DomainTransaction.emptyTransaction()) {
    const campaignParticipation = await BookshelfCampaignParticipation.where({ id }).fetch({
      withRelated: ['campaign', 'assessments'],
      transacting: domainTransaction.knexTransaction,
    });
    return bookshelfToDomainConverter.buildDomainObject(BookshelfCampaignParticipation, campaignParticipation);
  },

  async update(campaignParticipation: $TSFixMe, domainTransaction = DomainTransaction.emptyTransaction()) {
    const knexConn = domainTransaction.knexTransaction || knex;
    const attributes = _getAttributes(campaignParticipation);

    await knexConn.from('campaign-participations').where({ id: campaignParticipation.id }).update(attributes);
  },

  async findProfilesCollectionResultDataByCampaignId(campaignId: $TSFixMe) {
    const results = await knex
      .with('campaignParticipationWithUser', (qb: $TSFixMe) => {
        qb.select([
          'campaign-participations.*',
          'organization-learners.studentNumber',
          'organization-learners.division',
          'organization-learners.group',
          'organization-learners.firstName',
          'organization-learners.lastName',
        ])
          .from('campaign-participations')
          .join('organization-learners', 'organization-learners.id', 'campaign-participations.organizationLearnerId')
          .where({ campaignId, isImproved: false, deletedAt: null });
      })
      .from('campaignParticipationWithUser');

    return results.map(_rowToResult);
  },

  findLatestOngoingByUserId(userId: $TSFixMe) {
    return BookshelfCampaignParticipation.query((qb: $TSFixMe) => {
      qb.innerJoin('campaigns', 'campaign-participations.campaignId', 'campaigns.id');
      qb.whereNull('campaigns.archivedAt');
      qb.orderBy('campaign-participations.createdAt', 'DESC');
    })
      .where({ userId })
      .fetchAll({
        required: false,
        withRelated: ['campaign', 'assessments'],
      })
      .then((campaignParticipations: $TSFixMe) => bookshelfToDomainConverter.buildDomainObjects(BookshelfCampaignParticipation, campaignParticipations)
      );
  },

  async findOneByCampaignIdAndUserId({
    campaignId,
    userId
  }: $TSFixMe) {
    const campaignParticipation = await BookshelfCampaignParticipation.where({
      campaignId,
      userId,
      isImproved: false,
    }).fetch({ require: false, withRelated: ['assessments'] });
    return bookshelfToDomainConverter.buildDomainObject(BookshelfCampaignParticipation, campaignParticipation);
  },

  async updateWithSnapshot(campaignParticipation: $TSFixMe, domainTransaction = DomainTransaction.emptyTransaction()) {
    await this.update(campaignParticipation, domainTransaction);

    const knowledgeElements = await knowledgeElementRepository.findUniqByUserId({
      userId: campaignParticipation.userId,
      limitDate: campaignParticipation.sharedAt,
      domainTransaction,
    });
    await knowledgeElementSnapshotRepository.save({
      userId: campaignParticipation.userId,
      snappedAt: campaignParticipation.sharedAt,
      knowledgeElements,
      domainTransaction,
    });
  },

  async isRetrying({
    campaignParticipationId
  }: $TSFixMe) {
    const { id: campaignId, userId } = await knex('campaigns')
      .select('campaigns.id', 'userId')
      .join('campaign-participations', 'campaigns.id', 'campaignId')
      .where({ 'campaign-participations.id': campaignParticipationId })
      .first();

    const campaignParticipations = await knex('campaign-participations')
      .select('sharedAt', 'isImproved')
      .where({ campaignId, userId });

    return campaignParticipations.length > 1 &&
    campaignParticipations.some((participation: $TSFixMe) => !participation.isImproved && !participation.sharedAt);
  },

  async countParticipationsByStage(campaignId: $TSFixMe, stagesBoundaries: $TSFixMe) {
    const participationCounts = stagesBoundaries.map((boundary: $TSFixMe) => {
      const from = boundary.from / 100;
      const to = boundary.to / 100;
      return knex.raw(
        'COUNT("id") FILTER (WHERE "masteryRate" between ?? and ??) OVER (PARTITION BY "campaignId") AS ??',
        [from, to, String(boundary.id)]
      );
    });

    const result = await knex
      .select(participationCounts)
      .from('campaign-participations')
      .where('campaign-participations.campaignId', '=', campaignId)
      .where('campaign-participations.isImproved', '=', false)
      .where('campaign-participations.deletedAt', 'is', null)
      .limit(1);

    if (!result.length) return {};

    return result[0];
  },

  async countParticipationsByStatus(campaignId: $TSFixMe, campaignType: $TSFixMe) {
    const row = await knex('campaign-participations')
      .select([
        knex.raw(`sum(case when status = ? then 1 else 0 end) as shared`, SHARED),
        knex.raw(`sum(case when status = ? then 1 else 0 end) as completed`, TO_SHARE),
        knex.raw(`sum(case when status = ? then 1 else 0 end) as started`, STARTED),
      ])
      .where({ campaignId, isImproved: false, deletedAt: null })
      .groupBy('campaignId')
      .first();

    return mapToParticipationByStatus(row, campaignType);
  },

  async getAllCampaignParticipationsInCampaignForASameLearner({
    campaignId,
    campaignParticipationId,
    domainTransaction
  }: $TSFixMe) {
    const knexConn = domainTransaction.knexTransaction;
    const result = await knexConn('campaign-participations')
      .select('organizationLearnerId')
      .where({ id: campaignParticipationId, campaignId })
      .first();

    if (!result) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError(
        `There is no campaign participation with the id "${campaignParticipationId}" for the campaign wih the id "${campaignId}"`
      );
    }

    const campaignParticipations = await knexConn('campaign-participations').where({
      campaignId,
      organizationLearnerId: result.organizationLearnerId,
      deletedAt: null,
      deletedBy: null,
    });

    return campaignParticipations.map((campaignParticipation: $TSFixMe) => new CampaignParticipation(campaignParticipation));
  },

  async delete({
    id,
    deletedAt,
    deletedBy,
    domainTransaction
  }: $TSFixMe) {
    const knexConn = domainTransaction.knexTransaction;
    return await knexConn('campaign-participations').where({ id }).update({ deletedAt, deletedBy });
  },
};

function _rowToResult(row: $TSFixMe) {
  return {
    id: row.id,
    createdAt: new Date(row.createdAt),
    isShared: row.status === CampaignParticipationStatuses.SHARED,
    sharedAt: row.sharedAt ? new Date(row.sharedAt) : null,
    participantExternalId: row.participantExternalId,
    userId: row.userId,
    isCompleted: row.state === 'completed',
    studentNumber: row.studentNumber,
    participantFirstName: row.firstName,
    participantLastName: row.lastName,
    division: row.division,
    pixScore: row.pixScore,
    group: row.group,
  };
}

function _getAttributes(campaignParticipation: $TSFixMe) {
  return {
    createdAt: campaignParticipation.createdAt,
    participantExternalId: campaignParticipation.participantExternalId,
    sharedAt: campaignParticipation.sharedAt,
    status: campaignParticipation.status,
    campaignId: campaignParticipation.campaignId,
    userId: campaignParticipation.userId,
    validatedSkillsCount: campaignParticipation.validatedSkillsCount,
    pixScore: campaignParticipation.pixScore,
    masteryRate: campaignParticipation.masteryRate,
    organizationLearnerId: campaignParticipation.organizationLearnerId,
  };
}

function mapToParticipationByStatus(row = {}, campaignType: $TSFixMe) {
  const participationByStatus = {
    shared: (row as $TSFixMe).shared || 0,
    completed: (row as $TSFixMe).completed || 0,
};
  if (campaignType === CampaignTypes.ASSESSMENT) {
    (participationByStatus as $TSFixMe).started = (row as $TSFixMe).started || 0;
  }
  return participationByStatus;
}
