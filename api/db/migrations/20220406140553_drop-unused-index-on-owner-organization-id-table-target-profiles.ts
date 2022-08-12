// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'target-profiles';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'USERID_COL... Remove this comment to see the full error message
const USERID_COLUMN = 'ownerOrganizationId';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'INDEX_NAME... Remove this comment to see the full error message
const INDEX_NAME = 'target_profiles_organizationid_index';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.dropIndex(USERID_COLUMN, INDEX_NAME);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.index(USERID_COLUMN);
  });
};
