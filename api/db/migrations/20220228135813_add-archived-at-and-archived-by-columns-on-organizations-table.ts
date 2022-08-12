// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'organizations';
const ARCHIVED_AT = 'archivedAt';
const ARCHIVED_BY = 'archivedBy';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, async (table: $TSFixMe) => {
    table.dateTime(ARCHIVED_AT).nullable();
    table.bigInteger(ARCHIVED_BY).nullable().references('users.id');
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn(ARCHIVED_AT);
    table.dropColumn(ARCHIVED_BY);
  });
};
