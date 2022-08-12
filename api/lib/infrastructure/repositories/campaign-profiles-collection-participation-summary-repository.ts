// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'chunk'.
const chunk = require('lodash/chunk');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'placementP... Remove this comment to see the full error message
const placementProfileService = require('../../domain/services/placement-profile-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPr... Remove this comment to see the full error message
const CampaignProfilesCollectionParticipationSummary = require('../../domain/read-models/CampaignProfilesCollectionParticipationSummary');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceRepository = require('../../infrastructure/repositories/competence-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'constants'... Remove this comment to see the full error message
const constants = require('../constants');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fetchPage'... Remove this comment to see the full error message
const { fetchPage } = require('../utils/knex-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'filterByFu... Remove this comment to see the full error message
const { filterByFullName } = require('../utils/filter-utils');

const CampaignProfilesCollectionParticipationSummaryRepository = {
  async findPaginatedByCampaignId(campaignId: $TSFixMe, page: $TSFixMe, filters = {}) {
    const query = knex
      .select(
        'campaign-participations.id AS campaignParticipationId',
        'campaign-participations.userId AS userId',
        knex.raw('LOWER("organization-learners"."firstName") AS "lowerFirstName"'),
        knex.raw('LOWER("organization-learners"."lastName") AS "lowerLastName"'),
        'organization-learners.firstName AS firstName',
        'organization-learners.lastName AS lastName',
        'campaign-participations.participantExternalId',
        'campaign-participations.sharedAt',
        'campaign-participations.pixScore AS pixScore'
      )
      .from('campaign-participations')
      .join('organization-learners', 'organization-learners.id', 'campaign-participations.organizationLearnerId')
      .where('campaign-participations.campaignId', '=', campaignId)
      .where('campaign-participations.isImproved', '=', false)
      .where('campaign-participations.deletedAt', 'IS', null)
      .whereRaw('"campaign-participations"."sharedAt" IS NOT NULL')
      .orderByRaw('?? ASC, ?? ASC', ['lowerLastName', 'lowerFirstName'])
      .modify(_filterQuery, filters);

    const { results, pagination } = await fetchPage(query, page);

    const getPlacementProfileForUser = await _makeMemoizedGetPlacementProfileForUser(results);

    const data = results.map((result: $TSFixMe) => {
      if (!result.sharedAt) {
        return new CampaignProfilesCollectionParticipationSummary(result);
      }

      const placementProfile = getPlacementProfileForUser(result.userId);

      return new CampaignProfilesCollectionParticipationSummary({
        ...result,
        certifiable: placementProfile.isCertifiable(),
        certifiableCompetencesCount: placementProfile.getCertifiableCompetencesCount(),
      });
    });

    return { data, pagination };
  },
};

async function _makeMemoizedGetPlacementProfileForUser(results: $TSFixMe) {
  const competences = await competenceRepository.listPixCompetencesOnly();

  const sharedResults = results.filter(({
    sharedAt
  }: $TSFixMe) => sharedAt);

  const sharedResultsChunks = await bluebird.mapSeries(
    chunk(sharedResults, constants.CHUNK_SIZE_CAMPAIGN_RESULT_PROCESSING),
    (sharedResultsChunk: $TSFixMe) => {
      const sharedAtDatesByUsers = Object.fromEntries(
        sharedResultsChunk.map(({
          userId,
          sharedAt
        }: $TSFixMe) => [userId, sharedAt])
      );
      return placementProfileService.getPlacementProfilesWithSnapshotting({
        userIdsAndDates: sharedAtDatesByUsers,
        allowExcessPixAndLevels: false,
        competences,
      });
    }
  );

  const placementProfiles = sharedResultsChunks.flat();

  return (userId: $TSFixMe) => placementProfiles.find((placementProfile: $TSFixMe) => placementProfile.userId === userId);
}

function _filterQuery(queryBuilder: $TSFixMe, filters: $TSFixMe) {
  if (filters.divisions) {
    const divisionsLowerCase = filters.divisions.map((division: $TSFixMe) => division.toLowerCase());
    queryBuilder.whereRaw('LOWER("organization-learners"."division") = ANY(:divisionsLowerCase)', {
      divisionsLowerCase,
    });
  }
  if (filters.groups) {
    const groupsLowerCase = filters.groups.map((group: $TSFixMe) => group.toLowerCase());
    queryBuilder.whereIn(knex.raw('LOWER("organization-learners"."group")'), groupsLowerCase);
  }
  if (filters.search) {
    filterByFullName(queryBuilder, filters.search, 'organization-learners.firstName', 'organization-learners.lastName');
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignProfilesCollectionParticipationSummaryRepository;
