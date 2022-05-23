exports.up = function (knex) {
  return knex.schema.table('users', function (table) {
    table.boolean('hasHairs');
  });
};

exports.down = function (knex) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('hasHairs');
  });
};
