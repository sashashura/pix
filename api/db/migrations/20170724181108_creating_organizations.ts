// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  function table(table: $TSFixMe) {
    table.increments().primary();
    table.string('email').notNullable();
    table.enu('type', ['SCO', 'SUP', 'PRO']).notNullable();
    table.string('name').notNullable();
    table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
    table.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now());
    table.bigInteger('userId').index().references('users.id');
  }

  return knex.schema.createTable('organizations', table);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.dropTable('organizations');
};
