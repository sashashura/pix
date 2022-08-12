// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'sessions';
const COLUMN_NAME_INCIDENT = 'hasIncident';
const COLUMN_NAME_JOINING_ISSUE = 'hasJoiningIssue';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.boolean(COLUMN_NAME_INCIDENT).notNullable().defaultTo(false);
    table.boolean(COLUMN_NAME_JOINING_ISSUE).notNullable().defaultTo(false);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.dropColumn(COLUMN_NAME_INCIDENT);
    table.dropColumn(COLUMN_NAME_JOINING_ISSUE);
  });
};
