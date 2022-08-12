// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'complementary-certification-course-results';
const CONSTRAINT_NAME = 'complementary-certification-course-results-cccrId-source-unique';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async (knex: $TSFixMe) => {
  return knex.schema.alterTable(TABLE_NAME, (table: $TSFixMe) => {
    table.unique(['complementaryCertificationCourseId', 'source'], CONSTRAINT_NAME);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = (knex: $TSFixMe) => {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropUnique(['complementaryCertificationCourseId', 'source'], CONSTRAINT_NAME);
  });
};
