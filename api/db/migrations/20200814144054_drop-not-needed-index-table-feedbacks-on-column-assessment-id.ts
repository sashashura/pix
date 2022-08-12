// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'feedbacks';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ASSESSMENT... Remove this comment to see the full error message
const ASSESSMENTID_COLUMN = 'assessmentId';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.dropIndex(ASSESSMENTID_COLUMN);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.index(ASSESSMENTID_COLUMN);
  });
};
