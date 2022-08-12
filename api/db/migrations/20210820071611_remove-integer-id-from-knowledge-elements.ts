// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.raw('ALTER TABLE "knowledge-elements" DROP COLUMN "intId"');
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.raw('ALTER TABLE "knowledge-elements" ADD COLUMN "intId" INTEGER');
};
