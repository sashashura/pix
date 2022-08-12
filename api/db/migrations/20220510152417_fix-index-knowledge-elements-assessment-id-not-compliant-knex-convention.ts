// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = (knex: $TSFixMe) => {
  return knex.raw(
    'ALTER INDEX IF EXISTS "knowledge-elements_assessmentId_idx" RENAME TO "knowledge_elements_assessmentid_index"'
  );
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function () {
  // no rollback for this case
};
