// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'campaigns';
const CUSTOM_RESULT_PAGE_TEXT_COLUMN = 'customResultPageText';
const CUSTOM_RESULT_PAGE_BUTTON_TEXT_COLUMN = 'customResultPageButtonText';
const CUSTOM_RESULT_PAGE_BUTTON_URL_COLUMN = 'customResultPageButtonUrl';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.text(CUSTOM_RESULT_PAGE_TEXT_COLUMN);
    table.string(CUSTOM_RESULT_PAGE_BUTTON_TEXT_COLUMN);
    table.text(CUSTOM_RESULT_PAGE_BUTTON_URL_COLUMN);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn(CUSTOM_RESULT_PAGE_TEXT_COLUMN);
    table.dropColumn(CUSTOM_RESULT_PAGE_BUTTON_TEXT_COLUMN);
    table.dropColumn(CUSTOM_RESULT_PAGE_BUTTON_URL_COLUMN);
  });
};
