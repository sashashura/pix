// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'knowledge-element-snapshots';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.createTable(TABLE_NAME, (table: $TSFixMe) => {
    table.increments('id').primary();
    table.integer('userId').notNullable();
    table.dateTime('snappedAt').notNullable();
    table.jsonb('snapshot').notNullable();
    table.index('userId');
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.dropTable(TABLE_NAME);
};
