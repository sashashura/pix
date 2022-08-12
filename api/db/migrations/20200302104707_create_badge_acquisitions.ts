// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'badge-acquisitions';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.createTable(TABLE_NAME, (table: $TSFixMe) => {
    table.increments('id').primary();
    table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
    table.integer('userId').notNullable().references('users.id').index();
    table.integer('badgeId').notNullable().references('badges.id');
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.dropTable(TABLE_NAME);
};
