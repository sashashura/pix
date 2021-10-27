exports.up = function(knex) {
  return knex.schema
    .createTable('supervisor-access', (t) => {
      t.integer('userId').notNullable();
      t.integer('sessionId').notNullable();
      t.dateTime('grantedAt').notNullable().defaultTo(knex.fn.now());
      t.primary(['userId', 'sessionId']);
      t.foreign('userId').references('users.id');
      t.foreign('sessionId').references('sessions.id');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('supervisor-access');
};
