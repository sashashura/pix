// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.table('certification-candidates', (table: $TSFixMe) => {
    table.string('birthPostalCode');
    table.string('birthINSEECode');
    table.string('sex', 1);
  });

  await knex.schema.alterTable('certification-candidates', (table: $TSFixMe) => {
    table.string('birthCity').nullable().alter();
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.schema.alterTable('certification-candidates', (table: $TSFixMe) => {
    table.dropColumns('birthPostalCode', 'birthINSEECode', 'sex');
    table.string('birthCity').notNullable().alter();
  });
};
