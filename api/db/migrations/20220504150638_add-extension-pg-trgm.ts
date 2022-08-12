// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS pg_trgm;');
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.raw('DROP EXTENSION IF EXISTS pg_trgm;');
};
