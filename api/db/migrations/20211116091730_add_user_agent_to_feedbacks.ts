// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table('feedbacks', function (table: $TSFixMe) {
    table.string('userAgent');
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table('feedbacks', (table: $TSFixMe) => {
    table.dropColumn('userAgent');
  });
};
