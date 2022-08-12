// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'sessions';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.text('juryComment').defaultsTo(null);
    table.integer('juryCommentAuthorId').unsigned().references('users.id').defaultsTo(null);
    table.dateTime('juryCommentedAt').defaultsTo(null);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.alterTable(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn('juryComment');
    table.dropColumn('juryCommentAuthorId');
    table.dropColumn('juryCommentedAt');
  });
};
