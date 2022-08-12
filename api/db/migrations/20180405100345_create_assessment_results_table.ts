// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'assessment-results';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = (knex: $TSFixMe) => {
  return knex.schema.createTable(TABLE_NAME, (t: $TSFixMe) => {
    t.increments().primary();
    t.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
    t.integer('level');
    t.integer('pixScore').unsigned();
    t.text('emitter').notNull();
    t.text('commentForJury');
    t.text('commentForOrganization');
    t.text('commentForCandidate');
    t.text('status').notNull();
    t.integer('juryId').unsigned().references('users.id');
    t.integer('assessmentId').unsigned().references('assessments.id');
    t.index('assessmentId');
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = (knex: $TSFixMe) => {
  return knex.schema.dropTable(TABLE_NAME);
};
