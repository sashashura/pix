// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'stages';
const PRESCRIBER_TITLE_COLUMN = 'prescriberTitle';
const PRESCRIBER_DESCRIPTION_COLUMN = 'prescriberDescription';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.string(PRESCRIBER_TITLE_COLUMN);
    table.text(PRESCRIBER_DESCRIPTION_COLUMN);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn(PRESCRIBER_TITLE_COLUMN);
    table.dropColumn(PRESCRIBER_DESCRIPTION_COLUMN);
  });
};
