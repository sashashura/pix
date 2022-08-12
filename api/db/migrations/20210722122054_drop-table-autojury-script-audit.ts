// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'autojury-script-audit';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.dropTable(TABLE_NAME);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.createTable(TABLE_NAME, (t: $TSFixMe) => {
    t.increments('sessionId').primary();
    t.text('certificationCenterName');
    t.dateTime('finalizedAt');
    t.date('sessionDate');
    t.time('sessionTime');
    t.boolean('hasExaminerGlobalComment', 500);
    t.string('error', 1000);
    t.enu('status', ['TO DO', 'DOING', 'DONE', 'TO RETRY']);
  });
};
