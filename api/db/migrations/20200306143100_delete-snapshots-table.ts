// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'snapshots';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.dropTable(TABLE_NAME);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.createTable(TABLE_NAME, (t: $TSFixMe) => {
    t.increments().primary();
    t.string('studentCode');
    t.string('campaignCode');
    t.integer('organizationId').unsigned().references('organizations.id');
    t.integer('userId').unsigned().references('users.id');
    t.string('score');
    t.json('profile').notNullable();
    t.integer('testsFinished');
    t.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
    t.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
};
