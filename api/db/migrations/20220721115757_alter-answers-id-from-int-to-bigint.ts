// In order to avoid alter bigint migration timeout, we check the number of answers in the target env before and run the alter bigint only if the limit is not exeeded.
const maxAnswersToRunAlterMigration = 500000;

const changeAnswerIdTypeToBigint = async (knex: $TSFixMe) => {
  await knex.transaction(async (trx: $TSFixMe) => {
    await knex.raw(`ALTER TABLE "knowledge-elements" ALTER COLUMN "answerId" TYPE BIGINT`).transacting(trx);
    await knex.raw(`ALTER TABLE "answers" ALTER COLUMN "id" TYPE BIGINT`).transacting(trx);
    await knex.raw(`ALTER SEQUENCE "answers_id_seq" AS BIGINT`).transacting(trx);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  const { rows: answersCheckDataTypeQueryResult } = await knex.raw(`
  SELECT "column_name","data_type"
  FROM "information_schema"."columns"
  WHERE "table_schema" = 'public' AND "table_name" = 'answers' AND "column_name" = 'id'`);
  const answersDataTypeId = answersCheckDataTypeQueryResult[0]['data_type'];

  if (answersDataTypeId === 'integer') {
    const { rows: answersCountQueryResult } = await knex.raw(`
    SELECT reltuples::bigint AS estimate
    FROM pg_class
    WHERE relname = 'answers'`);
    const nbAnswers = answersCountQueryResult[0]['estimate'];

    if (nbAnswers < maxAnswersToRunAlterMigration) {
      await changeAnswerIdTypeToBigint(knex);
    } else {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      // eslint-disable-next-line no-console
      console.log(
        'Columns in table answers not migrated to bigint as there is too much data. Run api/scripts/bigint/change-answers-id-type-to-bigint-with-downtime.js.'
      );
    }
  }
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function () {
  // no need for rollback
};
