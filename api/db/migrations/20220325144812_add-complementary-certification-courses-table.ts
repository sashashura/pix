const COMPLEMENTARY_CERTIFICATION_COURSES_TABLE_NAME = 'complementary-certification-courses';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(COMPLEMENTARY_CERTIFICATION_COURSES_TABLE_NAME, async (table: $TSFixMe) => {
    table.increments('id').primary();
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(COMPLEMENTARY_CERTIFICATION_COURSES_TABLE_NAME, async (table: $TSFixMe) => {
    table.dropColumn('id');
  });
};
