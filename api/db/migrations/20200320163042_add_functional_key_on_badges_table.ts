// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'badges';
const COLUMN_KEY = 'key';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async (knex: $TSFixMe) => {
  await knex.schema.alterTable(TABLE_NAME, function (table: $TSFixMe) {
    table.text(COLUMN_KEY);
  });

  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.unique([COLUMN_KEY]);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = (knex: $TSFixMe) => {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn(COLUMN_KEY);
  });
};
