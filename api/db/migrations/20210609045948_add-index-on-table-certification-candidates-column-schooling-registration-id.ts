// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = (knex: $TSFixMe) => {
  return knex.schema.table('certification-candidates', (table: $TSFixMe) => {
    table.index('schoolingRegistrationId');
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = (knex: $TSFixMe) => {
  return knex.schema.table('certification-candidates', (table: $TSFixMe) => {
    table.dropIndex('schoolingRegistrationId');
  });
};
