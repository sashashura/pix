// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table('snapshots', function (table: $TSFixMe) {
    table.string('completionPercentage', 6);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table('snapshots', (table: $TSFixMe) => {
    table.dropColumn('completionPercentage');
  });
};
