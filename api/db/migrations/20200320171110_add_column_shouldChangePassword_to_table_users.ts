// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'users';
const SHOULD_CHANGE_PASSWORD_COLUMN = 'shouldChangePassword';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_VA... Remove this comment to see the full error message
const DEFAULT_VALUE = false;

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.boolean(SHOULD_CHANGE_PASSWORD_COLUMN).notNullable().defaultTo(DEFAULT_VALUE);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn(SHOULD_CHANGE_PASSWORD_COLUMN);
  });
};
