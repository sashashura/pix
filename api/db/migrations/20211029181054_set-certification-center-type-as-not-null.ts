// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.raw('ALTER TABLE "certification-centers" ALTER COLUMN "type" SET NOT NULL');
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.raw('ALTER TABLE "certification-centers" ALTER COLUMN "type" DROP NOT NULL');
};
