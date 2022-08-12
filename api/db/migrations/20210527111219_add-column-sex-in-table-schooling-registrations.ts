// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table('schooling-registrations', (table: $TSFixMe) => {
    table.string('sex', 1);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table('schooling-registrations', function (table: $TSFixMe) {
    table.dropColumn('sex');
  });
};
