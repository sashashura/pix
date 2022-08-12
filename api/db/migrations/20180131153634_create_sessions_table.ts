// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'sessions';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = (knex: $TSFixMe) => {
  function table(t: $TSFixMe) {
    t.increments().primary();
    t.text('certificationCenter').notNullable();
    t.text('address').notNullable();
    t.text('room').notNullable();
    t.text('examiner').notNullable();
    t.date('date').notNullable();
    t.time('time').notNullable();
    t.text('description').defaultTo('');
    t.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
  }

  return knex.schema.createTable(TABLE_NAME, table);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = (knex: $TSFixMe) => {
  return knex.schema.dropTable(TABLE_NAME);
};
