// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = (knex: $TSFixMe) => {
  return knex.raw('CREATE INDEX "assessment_courseid_index" ON assessments ("courseId");');
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = (knex: $TSFixMe) => {
  return knex.raw('DROP INDEX "assessment_courseid_index";');
};
