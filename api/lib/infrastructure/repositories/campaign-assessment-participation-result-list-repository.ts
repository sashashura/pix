// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fetchPage'... Remove this comment to see the full error message
const { fetchPage } = require('../utils/knex-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileRepository = require('./target-profile-with-learning-content-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignAs... Remove this comment to see the full error message
const CampaignAssessmentParticipationResultMinimal = require('../../domain/read-models/campaign-results/CampaignAssessmentParticipationResultMinimal');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../domain/models/CampaignParticipationStatuses');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED } = CampaignParticipationStatuses;

async function findPaginatedByCampaignId({
  page = {},
  campaignId,
  filters = {}
}: $TSFixMe) {
  const targetProfile = await targetProfileRepository.getByCampaignId({ campaignId });
  const { results, pagination } = await _getResultListPaginated(campaignId, targetProfile, filters, page);

  const participations = await _buildCampaignAssessmentParticipationResultList(results);
  return {
    participations,
    pagination,
  };
}
async function _getResultListPaginated(campaignId: $TSFixMe, targetProfile: $TSFixMe, filters: $TSFixMe, page: $TSFixMe) {
  const query = _getParticipantsResultList(campaignId, targetProfile, filters);
  return fetchPage(query, page);
}

function _getParticipantsResultList(campaignId: $TSFixMe, targetProfile: $TSFixMe, filters: $TSFixMe) {
  return knex
    .with('campaign_participation_summaries', (qb: $TSFixMe) => _getParticipations(qb, campaignId, targetProfile, filters))
    .select('*')
    .from('campaign_participation_summaries')
    .modify(_filterByBadgeAcquisitionsOut, filters)
    .orderByRaw('LOWER(??) ASC, LOWER(??) ASC', ['lastName', 'firstName']);
}

function _getParticipations(qb: $TSFixMe, campaignId: $TSFixMe, targetProfile: $TSFixMe, filters: $TSFixMe) {
  qb.select(
    'organization-learners.firstName',
    'organization-learners.lastName',
    'campaign-participations.participantExternalId',
    'campaign-participations.masteryRate',
    'campaign-participations.id AS campaignParticipationId',
    'campaign-participations.userId'
  )
    .from('campaign-participations')
    .join('organization-learners', 'organization-learners.id', 'campaign-participations.organizationLearnerId')
    .where('campaign-participations.campaignId', '=', campaignId)
    .where('campaign-participations.status', '=', SHARED)
    .where('campaign-participations.isImproved', '=', false)
    .where('campaign-participations.deletedAt', 'IS', null)
    .modify(_filterByDivisions, filters)
    .modify(_filterByGroups, filters)
    .modify(_addAcquiredBadgeids, filters)
    .modify(_filterByStage, targetProfile, filters)
    .modify(_filterBySearch, filters);
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _filterByDivisions(queryBuilder: $TSFixMe, filters: $TSFixMe) {
  if (filters.divisions) {
    const divisionsLowerCase = filters.divisions.map((division: $TSFixMe) => division.toLowerCase());
    queryBuilder.whereRaw('LOWER("organization-learners"."division") = ANY(:divisionsLowerCase)', {
      divisionsLowerCase,
    });
  }
}

function _filterByGroups(queryBuilder: $TSFixMe, filters: $TSFixMe) {
  if (filters.groups) {
    const groupsLowerCase = filters.groups.map((group: $TSFixMe) => group.toLowerCase());
    queryBuilder.whereIn(knex.raw('LOWER("organization-learners"."group")'), groupsLowerCase);
  }
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _filterBySearch(queryBuilder: $TSFixMe, filters: $TSFixMe) {
  if (filters.search) {
    const search = filters.search.trim().toLowerCase();
    queryBuilder.where(function(this: $TSFixMe) {
      this.where(
        knex.raw(`CONCAT ("organization-learners"."firstName", ' ', "organization-learners"."lastName") <-> ?`, search),
        '<=',
        0.8
      )
        .orWhereRaw('LOWER("organization-learners"."lastName") LIKE ?', `%${search}%`)
        .orWhereRaw('LOWER("organization-learners"."firstName") LIKE ?', `%${search}%`);
    });
  }
}

function _addAcquiredBadgeids(queryBuilder: $TSFixMe, filters: $TSFixMe) {
  if (filters.badges) {
    queryBuilder
      .select(knex.raw('ARRAY_AGG("badgeId") OVER (PARTITION BY "campaign-participations"."id") as badges_acquired'))
      .join('badge-acquisitions', 'badge-acquisitions.campaignParticipationId', 'campaign-participations.id')
      .distinct('campaign-participations.id');
  }
}

function _filterByBadgeAcquisitionsOut(queryBuilder: $TSFixMe, filters: $TSFixMe) {
  if (filters.badges) {
    queryBuilder.whereRaw(':badgeIds <@ "badges_acquired"', { badgeIds: filters.badges });
  }
}

function _filterByStage(queryBuilder: $TSFixMe, targetProfile: $TSFixMe, filters: $TSFixMe) {
  if (!filters.stages) return;

  const thresholdBoundaries = targetProfile.getThresholdBoundariesFromStages(filters.stages);
  const thresholdRateBoundaries = thresholdBoundaries.map((boundary: $TSFixMe) => ({
    id: boundary.id,
    from: boundary.from / 100,
    to: boundary.to / 100
  }));
  queryBuilder.where((builder: $TSFixMe) => {
    thresholdRateBoundaries.forEach((boundary: $TSFixMe) => {
      builder.orWhereBetween('campaign-participations.masteryRate', [boundary.from, boundary.to]);
    });
  });
}

async function _buildCampaignAssessmentParticipationResultList(results: $TSFixMe) {
  return await bluebird.mapSeries(results, async (result: $TSFixMe) => {
    const badges = await getAcquiredBadges(result.campaignParticipationId);

    return new CampaignAssessmentParticipationResultMinimal({
      ...result,
      badges,
    });
  });
}

async function getAcquiredBadges(campaignParticipationId: $TSFixMe) {
  return await knex('badge-acquisitions')
    .select(['badges.id AS id', 'title', 'altMessage', 'imageUrl'])
    .join('badges', 'badges.id', 'badge-acquisitions.badgeId')
    .where({ campaignParticipationId: campaignParticipationId });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  findPaginatedByCampaignId,
};
