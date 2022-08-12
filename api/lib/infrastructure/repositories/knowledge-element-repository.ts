// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'constants'... Remove this comment to see the full error message
const constants = require('../constants');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../../domain/models/KnowledgeElement');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../domain/models/CampaignParticipationStatuses');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const BookshelfKnowledgeElement = require('../orm-models/KnowledgeElement');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementSnapshotRepository = require('./knowledge-element-snapshot-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../infrastructure/DomainTransaction');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED } = CampaignParticipationStatuses;

function _getUniqMostRecents(knowledgeElements: $TSFixMe) {
  return _(knowledgeElements).orderBy('createdAt', 'desc').uniqBy('skillId').value();
}

function _dropResetKnowledgeElements(knowledgeElements: $TSFixMe) {
  return _.reject(knowledgeElements, { status: KnowledgeElement.StatusType.RESET });
}

function _applyFilters(knowledgeElements: $TSFixMe) {
  const uniqsMostRecentPerSkill = _getUniqMostRecents(knowledgeElements);
  return _dropResetKnowledgeElements(uniqsMostRecentPerSkill);
}

function _findByUserIdAndLimitDateQuery({
  userId,
  limitDate,
  domainTransaction = DomainTransaction.emptyTransaction()
}: $TSFixMe) {
  const knexConn = domainTransaction.knexTransaction || knex;
  return knexConn('knowledge-elements').where((qb: $TSFixMe) => {
    qb.where({ userId });
    if (limitDate) {
      qb.where('createdAt', '<', limitDate);
    }
  });
}

async function _findAssessedByUserIdAndLimitDateQuery({
  userId,
  limitDate,
  domainTransaction
}: $TSFixMe) {
  const knowledgeElementRows = await _findByUserIdAndLimitDateQuery({ userId, limitDate, domainTransaction });

  const knowledgeElements = _.map(
    knowledgeElementRows,
    (knowledgeElementRow: $TSFixMe) => new KnowledgeElement(knowledgeElementRow)
  );
  return _applyFilters(knowledgeElements);
}

async function _filterValidatedKnowledgeElementsByCampaignId(knowledgeElements: $TSFixMe, campaignId: $TSFixMe) {
  const targetProfileSkillsFromDB = await knex('target-profiles_skills')
    .select('target-profiles_skills.skillId')
    .join('target-profiles', 'target-profiles.id', 'target-profiles_skills.targetProfileId')
    .join('campaigns', 'campaigns.targetProfileId', 'target-profiles.id')
    .where('campaigns.id', '=', campaignId);

  const targetProfileSkillIds = _.map(targetProfileSkillsFromDB, 'skillId');

  return _.filter(knowledgeElements, (knowledgeElement: $TSFixMe) => {
    if (knowledgeElement.isInvalidated) {
      return false;
    }
    return _.includes(targetProfileSkillIds, knowledgeElement.skillId);
  });
}

async function _findSnapshotsForUsers(userIdsAndDates: $TSFixMe) {
  const knowledgeElementsGroupedByUser = await knowledgeElementSnapshotRepository.findByUserIdsAndSnappedAtDates(
    userIdsAndDates
  );

  for (const [userIdStr, knowledgeElementsFromSnapshot] of Object.entries(knowledgeElementsGroupedByUser)) {
    const userId = parseInt(userIdStr);
    let knowledgeElements = knowledgeElementsFromSnapshot;
    if (!knowledgeElements) {
      knowledgeElements = await _findAssessedByUserIdAndLimitDateQuery({
        userId,
        limitDate: userIdsAndDates[userId],
      });
    }
    knowledgeElementsGroupedByUser[userId] = knowledgeElements;
  }
  return knowledgeElementsGroupedByUser;
}

async function _countValidatedTargetedByCompetencesForUsers(userIdsAndDates: $TSFixMe, targetProfileWithLearningContent: $TSFixMe) {
  const knowledgeElementsGroupedByUser = await _findSnapshotsForUsers(userIdsAndDates);
  return targetProfileWithLearningContent.countValidatedTargetedKnowledgeElementsByCompetence(
    _.flatMap(knowledgeElementsGroupedByUser)
  );
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async save(knowledgeElement: $TSFixMe) {
    const knowledgeElementToSave = _.omit(knowledgeElement, ['id', 'createdAt']);
    const savedKnowledgeElement = await new BookshelfKnowledgeElement(knowledgeElementToSave).save();

    return bookshelfToDomainConverter.buildDomainObject(BookshelfKnowledgeElement, savedKnowledgeElement);
  },

  async findUniqByUserId({
    userId,
    limitDate,
    domainTransaction
  }: $TSFixMe) {
    return _findAssessedByUserIdAndLimitDateQuery({ userId, limitDate, domainTransaction });
  },

  async findUniqByUserIdAndAssessmentId({
    userId,
    assessmentId
  }: $TSFixMe) {
    const query = _findByUserIdAndLimitDateQuery({ userId });
    const knowledgeElementRows = await query.where({ assessmentId });

    const knowledgeElements = _.map(
      knowledgeElementRows,
      (knowledgeElementRow: $TSFixMe) => new KnowledgeElement(knowledgeElementRow)
    );
    return _applyFilters(knowledgeElements);
  },

  async findUniqByUserIdAndCompetenceId({
    userId,
    competenceId,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: $TSFixMe) {
    const knowledgeElements = await _findAssessedByUserIdAndLimitDateQuery({ userId, domainTransaction });
    return knowledgeElements.filter((knowledgeElement: $TSFixMe) => knowledgeElement.competenceId === competenceId);
  },

  async findUniqByUserIdGroupedByCompetenceId({
    userId,
    limitDate
  }: $TSFixMe) {
    const knowledgeElements = await this.findUniqByUserId({ userId, limitDate });
    return _.groupBy(knowledgeElements, 'competenceId');
  },

  async findByCampaignIdAndUserIdForSharedCampaignParticipation({
    campaignId,
    userId
  }: $TSFixMe) {
    const [sharedCampaignParticipation] = await knex('campaign-participations')
      .select('sharedAt')
      .where({ campaignId, status: SHARED, userId })
      .limit(1);

    if (!sharedCampaignParticipation) {
      return [];
    }

    const { sharedAt } = sharedCampaignParticipation;
    const knowledgeElements = await _findAssessedByUserIdAndLimitDateQuery({ userId, limitDate: sharedAt });

    return _filterValidatedKnowledgeElementsByCampaignId(knowledgeElements, campaignId);
  },

  async findByCampaignIdForSharedCampaignParticipation(campaignId: $TSFixMe) {
    const sharedCampaignParticipations = await knex('campaign-participations')
      .select('userId', 'sharedAt')
      .where({ campaignId, status: SHARED });

    const knowledgeElements = _.flatMap(
      await bluebird.map(
        sharedCampaignParticipations,
        async ({
          userId,
          sharedAt
        }: $TSFixMe) => {
          return _findAssessedByUserIdAndLimitDateQuery({ userId, limitDate: sharedAt });
        },
        { concurrency: constants.CONCURRENCY_HEAVY_OPERATIONS }
      )
    );

    return _filterValidatedKnowledgeElementsByCampaignId(knowledgeElements, campaignId);
  },

  async findSnapshotGroupedByCompetencesForUsers(userIdsAndDates: $TSFixMe) {
    const knowledgeElementsGroupedByUser = await _findSnapshotsForUsers(userIdsAndDates);

    for (const [userId, knowledgeElements] of Object.entries(knowledgeElementsGroupedByUser)) {
      knowledgeElementsGroupedByUser[userId] = _.groupBy(knowledgeElements, 'competenceId');
    }
    return knowledgeElementsGroupedByUser;
  },

  async countValidatedTargetedByCompetencesForUsers(userIdsAndDates: $TSFixMe, targetProfileWithLearningContent: $TSFixMe) {
    return _countValidatedTargetedByCompetencesForUsers(userIdsAndDates, targetProfileWithLearningContent);
  },

  async countValidatedTargetedByCompetencesForOneUser(userId: $TSFixMe, limitDate: $TSFixMe, targetProfileWithLearningContent: $TSFixMe) {
    return _countValidatedTargetedByCompetencesForUsers({ [userId]: limitDate }, targetProfileWithLearningContent);
  },

  async findTargetedGroupedByCompetencesForUsers(userIdsAndDates: $TSFixMe, targetProfileWithLearningContent: $TSFixMe) {
    const knowledgeElementsGroupedByUser = await _findSnapshotsForUsers(userIdsAndDates);
    const knowledgeElementsGroupedByUserAndCompetence = {};

    for (const [userId, knowledgeElements] of Object.entries(knowledgeElementsGroupedByUser)) {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      knowledgeElementsGroupedByUserAndCompetence[userId] =
        targetProfileWithLearningContent.getKnowledgeElementsGroupedByCompetence(knowledgeElements);
    }

    return knowledgeElementsGroupedByUserAndCompetence;
  },

  async findValidatedTargetedGroupedByTubes(userIdsAndDates: $TSFixMe, targetProfileWithLearningContent: $TSFixMe) {
    const knowledgeElementsGroupedByUser = await _findSnapshotsForUsers(userIdsAndDates);

    return targetProfileWithLearningContent.getValidatedKnowledgeElementsGroupedByTube(
      _.flatMap(knowledgeElementsGroupedByUser)
    );
  },

  async findSnapshotForUsers(userIdsAndDates: $TSFixMe) {
    return _findSnapshotsForUsers(userIdsAndDates);
  },

  async findInvalidatedAndDirectByUserId(userId: $TSFixMe) {
    const invalidatedKnowledgeElements = await knex('knowledge-elements')
      .where({
        userId,
        status: KnowledgeElement.StatusType.INVALIDATED,
        source: KnowledgeElement.SourceType.DIRECT,
      })
      .orderBy('createdAt', 'desc');

    if (!invalidatedKnowledgeElements.length) {
      return [];
    }

    return invalidatedKnowledgeElements.map(
      (invalidatedKnowledgeElement: $TSFixMe) => new KnowledgeElement(invalidatedKnowledgeElement)
    );
  },
};
