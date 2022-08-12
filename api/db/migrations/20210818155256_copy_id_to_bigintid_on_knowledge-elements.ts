const MAX_ROW_COUNT_FOR_SYNCHRONOUS_MIGRATION = 10000000;

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  const nbRows = (await knex('knowledge-elements').max('id').first()).max;

  if (nbRows < MAX_ROW_COUNT_FOR_SYNCHRONOUS_MIGRATION) {
    await knex.raw('UPDATE "knowledge-elements" SET "bigintId" = id');
    await knex.raw('CREATE UNIQUE INDEX "knowledge-elements_bigintId_index" ON "knowledge-elements"("bigintId")');
  }
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.raw('DROP INDEX IF EXISTS "knowledge-elements_bigintId_index"');
};
