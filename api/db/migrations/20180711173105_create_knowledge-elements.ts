const KNOWLEDGE_ELEMENTS_TABLE_NAME = 'knowledge-elements';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = (knex: $TSFixMe) => {
  return knex.schema.createTable(KNOWLEDGE_ELEMENTS_TABLE_NAME, (table: $TSFixMe) => {
    table.increments('id').primary();
    table.string('source');
    table.string('status');
    table.integer('pixScore').unsigned();
    table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
    table.integer('answerId').unsigned().references('answers.id').index();
    table.integer('assessmentId').unsigned().references('assessments.id').index();
    table.string('skillId').index();
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = (knex: $TSFixMe) => {
  return knex.schema.dropTable(KNOWLEDGE_ELEMENTS_TABLE_NAME);
};
