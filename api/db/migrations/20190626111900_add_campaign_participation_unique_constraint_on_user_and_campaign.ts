// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'campaign-participations';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.raw(`
    DELETE FROM "campaign-participations"
    WHERE id IN (
      SELECT cp.id
      FROM "campaign-participations" AS cp
      INNER JOIN "campaign-participations" AS cpbis
      ON cp."campaignId" = cpbis."campaignId" AND cp."userId" = cpbis."userId"
      WHERE cp.id != cpbis.id
      AND cp."createdAt" < cpbis."createdAt"
    );
  `);

  await knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.unique(['campaignId', 'userId']);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropUnique(['campaignId', 'userId']);
  });
};
