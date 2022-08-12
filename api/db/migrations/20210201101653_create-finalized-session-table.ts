// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'finalized-sessions';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async (knex: $TSFixMe) => {
  await knex.schema.createTable(TABLE_NAME, (t: $TSFixMe) => {
    t.integer('sessionId').primary();
    t.boolean('isPublishable').notNullable();
    t.text('certificationCenterName').notNullable();
    t.dateTime('finalizedAt').notNullable();
    t.date('date').notNullable();
    t.time('time').notNullable();
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = (knex: $TSFixMe) => {
  return knex.schema.dropTable(TABLE_NAME);
};
