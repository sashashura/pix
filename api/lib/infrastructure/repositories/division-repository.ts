// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Division'.
const Division = require('../../domain/models/Division');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');

// @ts-expect-error TS(2393): Duplicate function implementation.
async function findByCampaignId(campaignId: $TSFixMe) {
  const divisions = await knex('organization-learners')
    .where({ campaignId })
    .whereNotNull('division')
    .where({ 'campaign-participations.deletedAt': null })
    .distinct('division')
    .orderBy('division', 'asc')
    .join('campaign-participations', 'organization-learners.id', 'campaign-participations.organizationLearnerId');

  return divisions.map(({
    division
  }: $TSFixMe) => _toDomain(division));
}

async function findByOrganizationIdForCurrentSchoolYear({
  organizationId
}: $TSFixMe) {
  const divisionRows = await knex('organization-learners')
    .distinct('division')
    .where({ organizationId, isDisabled: false })
    .whereNotNull('division')
    .orderBy('division', 'asc');

  return divisionRows.map(({
    division
  }: $TSFixMe) => _toDomain(division));
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(division: $TSFixMe) {
  return new Division({ name: division });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  findByCampaignId,
  findByOrganizationIdForCurrentSchoolYear,
};
