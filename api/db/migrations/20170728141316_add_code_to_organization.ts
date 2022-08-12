// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table('organizations', function (table: $TSFixMe) {
    table.string('code', 6).default('').notNullable();
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table('organizations', (table: $TSFixMe) => {
    table.dropColumn('code');
  });
};
