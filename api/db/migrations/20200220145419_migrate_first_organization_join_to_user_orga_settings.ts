// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'batch'.
const { batch } = require('../batch-processing');

const TABLE_NAME_USER_ORGA_SETTINGS = 'user-orga-settings';
const TABLE_NAME_MEMBERSHIPS = 'memberships';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  const subQuery = knex(TABLE_NAME_MEMBERSHIPS).min('id').groupBy('userId');

  return knex(TABLE_NAME_MEMBERSHIPS)
    .select('userId', 'organizationId')
    .whereIn('id', subQuery)
    .then((memberships: $TSFixMe) => {
      return batch(knex, memberships, (membership: $TSFixMe) => {
        return knex(TABLE_NAME_USER_ORGA_SETTINGS).insert({
          userId: membership.userId,
          currentOrganizationId: membership.organizationId,
        });
      });
    });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  const subQuery = knex(TABLE_NAME_MEMBERSHIPS).min('id').groupBy('userId');

  return knex(TABLE_NAME_MEMBERSHIPS)
    .select('userId', 'organizationId')
    .whereIn('id', subQuery)
    .then((memberships: $TSFixMe) => {
      return batch(knex, memberships, (membership: $TSFixMe) => {
        return knex(TABLE_NAME_USER_ORGA_SETTINGS).delete({
          userId: membership.userId,
          currentOrganizationId: membership.organizationId,
        });
      });
    });
};
