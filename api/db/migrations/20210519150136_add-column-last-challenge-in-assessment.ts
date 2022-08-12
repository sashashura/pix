// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table('assessments', (table: $TSFixMe) => {
    table.string('lastChallengeId', 50);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table('assessments', function (table: $TSFixMe) {
    table.dropColumn('lastChallengeId');
  });
};
