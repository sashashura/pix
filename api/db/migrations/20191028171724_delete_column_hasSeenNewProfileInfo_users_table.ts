// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'users';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'OUTDATED_C... Remove this comment to see the full error message
const OUTDATED_COLUMN_NAME = 'hasSeenNewProfileInfo';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn(OUTDATED_COLUMN_NAME);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.boolean(OUTDATED_COLUMN_NAME).notNullable().defaultTo(true);
  });
};
