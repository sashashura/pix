// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = (knex: $TSFixMe) => {
  return knex.raw(
    'CREATE INDEX IF NOT EXISTS "knowledge-elements_assessmentId_idx" on "knowledge-elements" ("assessmentId")'
  );
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.raw('DROP INDEX "knowledge-elements_assessmentId_idx"');
};
