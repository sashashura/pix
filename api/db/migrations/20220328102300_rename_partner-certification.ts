// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'OLD_TABLE_... Remove this comment to see the full error message
const OLD_TABLE_NAME = 'partner-certifications';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'COMPLEMENT... Remove this comment to see the full error message
const COMPLEMENTARY_CERTIFICATION_COURSE_RESULTS_TABLE = 'complementary-certification-course-results';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.renameTable(OLD_TABLE_NAME, COMPLEMENTARY_CERTIFICATION_COURSE_RESULTS_TABLE);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.schema.renameTable(COMPLEMENTARY_CERTIFICATION_COURSE_RESULTS_TABLE, OLD_TABLE_NAME);
};
