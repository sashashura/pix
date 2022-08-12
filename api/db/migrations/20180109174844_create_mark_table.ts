// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'marks';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = (knex: $TSFixMe) => {
  return knex.schema.createTable(TABLE_NAME, (t: $TSFixMe) => {
    t.increments().primary();
    t.integer('level').unsigned();
    t.integer('score').unsigned();
    t.text('area_code').notNull();
    t.text('competence_code').notNull();
    t.integer('assessmentId').unsigned().references('assessments.id');
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = (knex: $TSFixMe) => {
  return knex.schema.dropTable(TABLE_NAME);
};
