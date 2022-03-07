exports.up = async function (knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS postgres_fdw');
  await knex.raw(`
    CREATE SERVER steampipe FOREIGN DATA WRAPPER postgres_fdw OPTIONS (
      host 'steampipe',
      port '9193',
      dbname 'steampipe'
    )
  `);
  await knex.raw(`
    CREATE USER MAPPING FOR CURRENT_USER SERVER steampipe OPTIONS (
      user 'steampipe',
      password '14b4_46ba_9096'
    )
  `);
  await knex.raw('CREATE SCHEMA learningcontent');
  await knex.raw(`
    IMPORT FOREIGN SCHEMA learningcontent
    FROM SERVER steampipe INTO learningcontent
  `);
};

exports.down = async function (knex) {
  await knex.raw('DROP SCHEMA IF EXISTS learningcontent CASCADE');
  await knex.raw('DROP USER MAPPING IF EXISTS FOR CURRENT_USER SERVER steampipe');
  await knex.raw('DROP SERVER IF EXISTS steampipe');
};
