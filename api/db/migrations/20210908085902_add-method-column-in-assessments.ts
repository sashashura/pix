// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'assessments';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'COLUMN_NAM... Remove this comment to see the full error message
const COLUMN_NAME = 'method';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.text(COLUMN_NAME);
  });

  const [nbRows] = await knex('pg_class').where({ relname: 'assessments' }).pluck('reltuples');
  const maxRowCountForUpdate = 650000;
  const canFillColumn = nbRows < maxRowCountForUpdate;

  if (canFillColumn) {
    await knex(TABLE_NAME).update({
      [COLUMN_NAME]: knex.raw(`
      CASE "type"
        when 'COMPETENCE_EVALUATION' then 'SMART_RANDOM'
        when 'CAMPAIGN' then 'SMART_RANDOM'
        when 'PLACEMENT' then 'SMART_RANDOM'
        when 'CERTIFICATION' then 'CERTIFICATION_DETERMINED'
        when 'DEMO' then 'COURSE_DETERMINED'
        when 'PREVIEW' then 'CHOSEN'
      END
    `),
    });
  }
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.alterTable(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn(COLUMN_NAME);
  });
};
