// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'certification-partner-acquisitions';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'COLUMN_NAM... Remove this comment to see the full error message
const COLUMN_NAME = 'acquired';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.boolean(COLUMN_NAME);
  });

  await knex(TABLE_NAME).update(COLUMN_NAME, true);

  return knex.schema.alterTable(TABLE_NAME, (table: $TSFixMe) => {
    table.boolean(COLUMN_NAME).notNullable().alter();
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn(COLUMN_NAME);
  });
};
