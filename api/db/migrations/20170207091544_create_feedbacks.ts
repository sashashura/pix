// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'feedbacks';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = (knex: $TSFixMe) => {
  function table(t: $TSFixMe) {
    t.increments().primary();
    t.string('email');
    t.text('content').notNull();
    t.integer('assessmentId').unsigned().references('assessments.id');
    t.string('challengeId').notNull();
    t.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
    t.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now());
  }

  return knex.schema.createTable(TABLE_NAME, table);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = (knex: $TSFixMe) => {
  return knex.schema.dropTable(TABLE_NAME);
};
