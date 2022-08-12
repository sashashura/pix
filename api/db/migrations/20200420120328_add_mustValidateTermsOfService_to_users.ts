// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'users';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NEW_COLUMN... Remove this comment to see the full error message
const NEW_COLUMN = 'mustValidateTermsOfService';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_VA... Remove this comment to see the full error message
const DEFAULT_VALUE = false;

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.boolean(NEW_COLUMN).notNullable().defaultTo(DEFAULT_VALUE);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn(NEW_COLUMN);
  });
};
