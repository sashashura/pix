// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationParticipant = require('../../domain/read-models/OrganizationParticipant');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fetchPage'... Remove this comment to see the full error message
const { fetchPage } = require('../utils/knex-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'filterByFu... Remove this comment to see the full error message
const { filterByFullName } = require('../utils/filter-utils');

async function getParticipantsByOrganizationId({
  organizationId,
  page,
  filters = {}
}: $TSFixMe) {
  const query = knex('organization-learners')
    .select([
      'organization-learners.id',
      'organization-learners.lastName',
      'organization-learners.firstName',
      knex.raw(
        'COUNT(*) FILTER (WHERE "campaign-participations"."id" IS NOT NULL) OVER(PARTITION BY "organizationLearnerId") AS "participationCount"'
      ),
      knex.raw(
        'max("campaign-participations"."createdAt") OVER(PARTITION BY "organizationLearnerId") AS "lastParticipationDate"'
      ),
      knex.raw(
        'FIRST_VALUE("name") OVER(PARTITION BY "organizationLearnerId" ORDER BY "campaign-participations"."createdAt" DESC) AS "campaignName"'
      ),
      knex.raw(
        'FIRST_VALUE("type") OVER(PARTITION BY "organizationLearnerId" ORDER BY "campaign-participations"."createdAt" DESC) AS "campaignType"'
      ),
      knex.raw(
        'FIRST_VALUE("campaign-participations"."status") OVER(PARTITION BY "organizationLearnerId" ORDER BY "campaign-participations"."createdAt" DESC) AS "participationStatus"'
      ),
    ])
    .join('campaign-participations', 'organization-learners.id', 'campaign-participations.organizationLearnerId')
    .join('campaigns', function(this: $TSFixMe) {
      this.on('campaign-participations.campaignId', 'campaigns.id');
      this.on('campaigns.organizationId', organizationId);
    })
    .leftJoin('users', 'organization-learners.userId', 'users.id')
    .where('organization-learners.organizationId', organizationId)
    .where('users.isAnonymous', '=', false)
    .whereNull('campaign-participations.deletedAt')
    .where('campaign-participations.isImproved', '=', false)
    .orderBy(['organization-learners.lastName', 'organization-learners.firstName', 'organization-learners.id'])
    .distinct('organization-learners.id')
    .modify(_filterBySearch, filters);

  const { results, pagination } = await fetchPage(query, page);
  const organizationParticipants = results.map((rawParticipant: $TSFixMe) => new OrganizationParticipant(rawParticipant));
  return { organizationParticipants, pagination };
}

function _filterBySearch(queryBuilder: $TSFixMe, filters: $TSFixMe) {
  if (filters.fullName) {
    filterByFullName(
      queryBuilder,
      filters.fullName,
      'organization-learners.firstName',
      'organization-learners.lastName'
    );
  }
}
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  getParticipantsByOrganizationId,
};
