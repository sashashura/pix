// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'certification-candidates';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EXAMINER_C... Remove this comment to see the full error message
const EXAMINER_COMMENT_NAME = 'examinerComment';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'HAS_SEEN_E... Remove this comment to see the full error message
const HAS_SEEN_END_TEST_SCREEN_NAME = 'hasSeenEndTestScreen';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.string(EXAMINER_COMMENT_NAME, 500);
    table.boolean(HAS_SEEN_END_TEST_SCREEN_NAME).defaultTo(false);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn(EXAMINER_COMMENT_NAME);
    table.dropColumn(HAS_SEEN_END_TEST_SCREEN_NAME);
  });
};
