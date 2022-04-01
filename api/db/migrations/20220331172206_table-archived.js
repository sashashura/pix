
exports.up = async function (knex) {

  await knex.raw(`
    CREATE TABLE "table-test" (
      "id" serial PRIMARY KEY,
      "userId" INT,
      "name" VARCHAR(50),
      "startedAt" DATE,
      FOREIGN KEY ("userId") REFERENCES "users" ("id")
    );
  `);
  await knex.raw('CREATE TABLE "table-test-A" AS (SELECT * FROM "table-test")');

  await knex.raw('CREATE TABLE "table-test-B" AS (SELECT * FROM "table-test")');


  await knex.raw(`
    CREATE VIEW "table-test-A-B" AS (
        SELECT * FROM "table-test-A"
      UNION ALL
        SELECT * FROM "table-test-B"
    );
  `);
};

exports.down = async function (knex) {
  await knex.schema.dropTable("table-test");
  await knex.schema.dropTable("table-test-A");
  await knex.raw('DROP VIEW "table-test-A-B"');
};
