// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'sessions';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'COLUMN_NAM... Remove this comment to see the full error message
const COLUMN_NAME = 'status';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, async (table: $TSFixMe) => {
    table.dropColumn(COLUMN_NAME);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.string(COLUMN_NAME).defaultTo('created');
  });
  await knex.raw('UPDATE "sessions" SET "status" = \'finalized\' WHERE "sessions"."finalizedAt" IS NOT NULL');
  return knex.raw('UPDATE "sessions" SET "status" = \'processed\' WHERE "sessions"."publishedAt" IS NOT NULL');
};
