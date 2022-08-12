// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table('assessments', (table: $TSFixMe) => {
    table.string('lastQuestionState', 50).default('asked');
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table('assessments', function (table: $TSFixMe) {
    table.dropColumn('lastQuestionState');
  });
};
