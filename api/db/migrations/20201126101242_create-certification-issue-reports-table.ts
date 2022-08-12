// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'certification-issue-reports';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async (knex: $TSFixMe) => {
  await knex.schema.createTable(TABLE_NAME, (t: $TSFixMe) => {
    t.increments('id').primary();
    t.integer('certificationCourseId').references('certification-courses.id').index();
    t.string('category');
    t.string('description', 500);
    t.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
    t.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.dropTable(TABLE_NAME);
};
