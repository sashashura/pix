const MAX_ROW_COUNT_FOR_SYNCHRONOUS_MIGRATION = 10000000;

async function migrateAnswersKeIntToBigintWithAlterColumn(knex) {
  await knex.raw('LOCK TABLE "answers" IN ACCESS EXCLUSIVE MODE');
  await knex.raw('ALTER SEQUENCE "answers_id_seq" AS BIGINT');
  await knex.raw('ALTER TABLE "answers" ALTER COLUMN "id" TYPE BIGINT');
  await knex.raw('ALTER TABLE "knowledge-elements" ALTER COLUMN "answerId" TYPE BIGINT');

  await knex.schema.createTable('bigint-migration-settings', (table) => {
    table.string('tableName').primary();
    table.integer('startsAtId').unsigned();
    table.integer('endsAtId').unsigned();
  });
}

async function migrateAnswersKeIntToBigintUsingTemporaryTables(knex) {
  await knex.schema.createTable('answers_bigint', (t) => {
    t.bigInteger('id');
    t.text('value');
    t.string('result');
    t.integer('assessmentId').unsigned();
    t.string('challengeId');
    t.dateTime('createdAt').defaultTo(knex.fn.now());
    t.dateTime('updatedAt').defaultTo(knex.fn.now());
    t.integer('timeout');
    t.text('resultDetails');
    t.integer('timeSpent');
    t.boolean('isFocusedOut').defaultTo(false);
  });

  await knex.schema.createTable('knowledge-elements_bigint', (table) => {
    table.bigInteger('id');
    table.string('source');
    table.string('status');
    table.dateTime('createdAt').defaultTo(knex.fn.now());
    table.integer('answerId').unsigned();
    table.integer('assessmentId').unsigned();
    table.string('skillId');
    table.float('earnedPix').defaultTo(0);
    table.integer('userId').unsigned();
    table.string('competenceId');
  });

  await knex.schema.createTable('bigint-migration-settings', (table) => {
    table.string('tableName').primary();
    table.integer('startsAtId').unsigned();
    table.integer('endsAtId').unsigned();
  });
}

exports.up = async function (knex) {
  const answerRows = await knex.raw(
    'select n_live_tup from pg_catalog."pg_stat_user_tables" where relname = \'answers\''
  );
  const nbRows = answerRows?.rows[0]['n_live_tup'];
  console.log('number of rows answer table ' + nbRows);

  if (nbRows < MAX_ROW_COUNT_FOR_SYNCHRONOUS_MIGRATION) {
    console.log('migration with aller column int to bigint');
    await migrateAnswersKeIntToBigintWithAlterColumn(knex);
  } else {
    console.log('Too much rows for alter column int to bigint');
    console.log('Migrate using temporary tables answers and ke');
    await migrateAnswersKeIntToBigintUsingTemporaryTables(knex);
  }
};

exports.down = async function () {};
