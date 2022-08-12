// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'certification-candidates';
const FIRST_COLUMN_NAME = 'examinerComment';
const SECOND_COLUMN_NAME = 'hasSeenEndTestScreen';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn(FIRST_COLUMN_NAME);
    table.dropColumn(SECOND_COLUMN_NAME);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.string(FIRST_COLUMN_NAME);
    table.string(SECOND_COLUMN_NAME);
  });
};
