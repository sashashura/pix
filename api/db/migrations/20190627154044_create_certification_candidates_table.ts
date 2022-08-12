// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'certification-candidates';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async (knex: $TSFixMe) => {
  await knex.schema.createTable(TABLE_NAME, (t: $TSFixMe) => {
    t.increments().primary();
    t.string('firstName').notNullable();
    t.string('lastName').notNullable();
    t.string('birthplace').notNullable();
    t.string('externalId');
    t.date('birthdate').notNullable();
    t.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
    t.integer('sessionId').references('sessions.id').notNull().index();
    t.decimal('extraTimePercentage', 3, 2);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async (knex: $TSFixMe) => {
  await knex.schema.dropTable(TABLE_NAME);
};
