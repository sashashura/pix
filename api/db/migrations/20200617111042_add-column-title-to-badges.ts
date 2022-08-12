// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'badges';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TITLE_COLU... Remove this comment to see the full error message
const TITLE_COLUMN = 'title';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.string(TITLE_COLUMN);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn(TITLE_COLUMN);
  });
};
