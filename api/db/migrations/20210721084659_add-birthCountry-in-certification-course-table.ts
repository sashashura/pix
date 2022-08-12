// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.table('certification-courses', (table: $TSFixMe) => {
    table.string('birthCountry');
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.schema.alterTable('certification-courses', (table: $TSFixMe) => {
    table.dropColumns('birthCountry');
  });
};
