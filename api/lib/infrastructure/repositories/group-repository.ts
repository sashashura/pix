// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Group'.
const Group = require('../../domain/models/Group');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');

async function findByCampaignId(campaignId: $TSFixMe) {
  const groups = await knex('organization-learners')
    .where({ campaignId })
    .where({ 'campaign-participations.deletedAt': null })
    .distinct('group')
    .whereNotNull('group')
    .orderBy('group', 'asc')
    .join('campaign-participations', 'organization-learners.id', 'campaign-participations.organizationLearnerId');

  return groups.map(({
    group
  }: $TSFixMe) => _toDomain(group));
}

// @ts-expect-error TS(2393): Duplicate function implementation.
async function findByOrganizationId({
  organizationId
}: $TSFixMe) {
  const groupRows = await knex('organization-learners')
    .distinct('group')
    .where({ organizationId, isDisabled: false })
    .whereNotNull('group')
    .orderBy('group', 'asc');

  return groupRows.map(({
    group
  }: $TSFixMe) => _toDomain(group));
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(group: $TSFixMe) {
  return new Group({ name: group });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  findByCampaignId,
  findByOrganizationId,
};
