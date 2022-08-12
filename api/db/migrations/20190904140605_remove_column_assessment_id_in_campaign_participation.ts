// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'campaign-participations';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  const info = await knex(TABLE_NAME).columnInfo();
  if (info.assessmentId) {
    await knex.schema.alterTable(TABLE_NAME, (table: $TSFixMe) => {
      table.dropColumn('assessmentId');
    });
  }
};
// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.schema.table(TABLE_NAME, (t: $TSFixMe) => t.integer('assessmentId').unsigned().references('assessments.id').index());
  await knex.raw(`
      UPDATE "campaign-participations"
      SET "assessmentId" = (SELECT id FROM "assessments" WHERE "campaign-participations".id = assessments."campaignParticipationId" ORDER BY "assessments"."createdAt" desc limit 1)
    `);
};
