exports.up = function(knex) {
  return knex.raw('CREATE VIEW "users_shuffled" AS SELECT * FROM "users" ORDER BY RANDOM()');
};

exports.down = function(knex) {
  return knex.raw('DROP VIEW "users_shuffled"');
};
