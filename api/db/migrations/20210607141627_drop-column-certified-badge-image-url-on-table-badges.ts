// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table('badges', function (table: $TSFixMe) {
    table.dropColumn('certifiedImageUrl');
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table('badges', (table: $TSFixMe) => {
    table.string('certifiedImageUrl', 500);
  });
};
