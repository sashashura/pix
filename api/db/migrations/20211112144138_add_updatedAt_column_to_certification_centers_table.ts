// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'certification-centers';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UPDATED_AT... Remove this comment to see the full error message
const UPDATED_AT_COLUMN = 'updatedAt';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dateTime(UPDATED_AT_COLUMN).notNullable().defaultTo(knex.fn.now());
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn(UPDATED_AT_COLUMN);
  });
};
