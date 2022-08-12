// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'certification-candidates';
const BIRTH_PROVINCE_CODE_COLUMN_NAME = 'birthProvinceCode';
const BIRTH_COUNTRY_COLUMN_NAME = 'birthCountry';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.string(BIRTH_PROVINCE_CODE_COLUMN_NAME);
    table.string(BIRTH_COUNTRY_COLUMN_NAME);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn(BIRTH_PROVINCE_CODE_COLUMN_NAME);
    table.dropColumn(BIRTH_COUNTRY_COLUMN_NAME);
  });
};
