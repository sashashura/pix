// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'assessments';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  const info = await knex(TABLE_NAME).columnInfo();
  if (!info.competenceId) {
    await knex.schema.table(TABLE_NAME, (t: $TSFixMe) => t.string('competenceId').index());
    await knex.raw(`
      UPDATE assessments
      SET "competenceId" = (SELECT "competenceId" FROM "competence-evaluations" WHERE "competence-evaluations"."assessmentId" = assessments.id)
      WHERE type = 'COMPETENCE_EVALUATION'
    `);
  }
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (t: $TSFixMe) => {
    t.dropColumn('competenceId');
  });
};
