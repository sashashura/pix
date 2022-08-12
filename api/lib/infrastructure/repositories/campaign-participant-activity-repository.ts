// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipantActivity = require('../../domain/read-models/CampaignParticipantActivity');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fetchPage'... Remove this comment to see the full error message
const { fetchPage } = require('../utils/knex-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'filterByFu... Remove this comment to see the full error message
const { filterByFullName } = require('../utils/filter-utils');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignPa... Remove this comment to see the full error message
const campaignParticipantActivityRepository = {
  async findPaginatedByCampaignId({
    page = { size: 25 },
    campaignId,
    filters = {}
  }: $TSFixMe) {
    const query = knex
      .with('campaign_participants_activities_ordered', (qb: $TSFixMe) => _buildCampaignParticipationByParticipant(qb, campaignId, filters)
      )
      .from('campaign_participants_activities_ordered')
      .orderByRaw('LOWER(??) ASC, LOWER(??) ASC', ['lastName', 'firstName']);

    const { results, pagination } = await fetchPage(query, page);

    const campaignParticipantsActivities = results.map((result: $TSFixMe) => {
      return new CampaignParticipantActivity(result);
    });

    return {
      campaignParticipantsActivities,
      pagination,
    };
  },
};

function _buildCampaignParticipationByParticipant(queryBuilder: $TSFixMe, campaignId: $TSFixMe, filters: $TSFixMe) {
  queryBuilder
    .select(
      'campaign-participations.id AS campaignParticipationId',
      'campaign-participations.userId',
      'organization-learners.firstName',
      'organization-learners.lastName',
      'campaign-participations.participantExternalId',
      'campaign-participations.sharedAt',
      'campaign-participations.status',
      'campaigns.type AS campaignType'
    )
    .from('campaign-participations')
    .join('campaigns', 'campaigns.id', 'campaign-participations.campaignId')
    .join('organization-learners', 'organization-learners.id', 'campaign-participations.organizationLearnerId')
    .modify(_filterParticipations, filters, campaignId);
}

function _filterParticipations(queryBuilder: $TSFixMe, filters: $TSFixMe, campaignId: $TSFixMe) {
  queryBuilder
    .where('campaign-participations.campaignId', '=', campaignId)
    .where('campaign-participations.isImproved', '=', false)
    .whereNull('campaign-participations.deletedAt')
    .modify(_filterByDivisions, filters)
    .modify(_filterByStatus, filters)
    .modify(_filterByGroup, filters)
    .modify(_filterBySearch, filters);
}

function _filterBySearch(queryBuilder: $TSFixMe, filters: $TSFixMe) {
  if (filters.search) {
    filterByFullName(queryBuilder, filters.search, 'organization-learners.firstName', 'organization-learners.lastName');
  }
}

function _filterByDivisions(queryBuilder: $TSFixMe, filters: $TSFixMe) {
  if (filters.divisions) {
    const divisionsLowerCase = filters.divisions.map((division: $TSFixMe) => division.toLowerCase());
    queryBuilder.whereRaw('LOWER("organization-learners"."division") = ANY(:divisionsLowerCase)', {
      divisionsLowerCase,
    });
  }
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _filterByStatus(queryBuilder: $TSFixMe, filters: $TSFixMe) {
  if (filters.status) {
    queryBuilder.where('campaign-participations.status', filters.status);
  }
}

function _filterByGroup(queryBuilder: $TSFixMe, filters: $TSFixMe) {
  if (filters.groups) {
    const groupsLowerCase = filters.groups.map((group: $TSFixMe) => group.toLowerCase());
    queryBuilder.whereIn(knex.raw('LOWER("organization-learners"."group")'), groupsLowerCase);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = campaignParticipantActivityRepository;
