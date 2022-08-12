// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'campaigns';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = (knex: $TSFixMe) => {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.string('idPixLabel');
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = (knex: $TSFixMe) => {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn('idPixLabel');
  });
};
