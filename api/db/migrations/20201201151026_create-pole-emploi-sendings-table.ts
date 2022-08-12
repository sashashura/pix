// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'pole-emploi-sendings';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async (knex: $TSFixMe) => {
  await knex.schema.createTable(TABLE_NAME, (t: $TSFixMe) => {
    t.increments('id').primary();
    t.integer('campaignParticipationId').references('campaign-participations.id').index();
    t.string('type').notNullable();
    t.boolean('isSuccessful').notNullable();
    t.text('responseCode').notNullable();
    t.json('payload');
    t.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = (knex: $TSFixMe) => {
  return knex.schema.dropTable(TABLE_NAME);
};
