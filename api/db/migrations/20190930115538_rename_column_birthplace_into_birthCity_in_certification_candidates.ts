// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'certification-candidates';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'OLD_COLUMN... Remove this comment to see the full error message
const OLD_COLUMN_NAME = 'birthplace';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NEW_COLUMN... Remove this comment to see the full error message
const NEW_COLUMN_NAME = 'birthCity';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (t: $TSFixMe) => t.renameColumn(OLD_COLUMN_NAME, NEW_COLUMN_NAME));
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (t: $TSFixMe) => t.renameColumn(NEW_COLUMN_NAME, OLD_COLUMN_NAME));
};
