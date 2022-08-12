// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'students';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.string('preferredLastName');
    table.string('middleName');
    table.string('thirdName');
    table.string('birthCity');
    table.string('birthCityCode');
    table.string('birthProvinceCode');
    table.string('birthCountryCode');
    table.string('MEFCode');
    table.string('status');
    table.string('nationalStudentId').unique().index();
    table.string('division');
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn('preferredLastName');
    table.dropColumn('middleName');
    table.dropColumn('thirdName');
    table.dropColumn('birthCity');
    table.dropColumn('birthCityCode');
    table.dropColumn('birthProvinceCode');
    table.dropColumn('birthCountryCode');
    table.dropColumn('MEFCode');
    table.dropColumn('status');
    table.dropColumn('nationalStudentId');
    table.dropColumn('division');
  });
};
