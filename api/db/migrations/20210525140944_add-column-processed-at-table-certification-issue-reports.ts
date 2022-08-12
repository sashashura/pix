// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table('certification-issue-reports', (table: $TSFixMe) => {
    table.dateTime('resolvedAt');
    table.string('resolution');
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table('certification-issue-reports', (table: $TSFixMe) => {
    table.dropColumn('resolvedAt');
    table.dropColumn('resolution');
  });
};
