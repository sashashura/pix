// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'certification-centers';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'COLUMN_NAM... Remove this comment to see the full error message
const COLUMN_NAME = 'isSupervisorAccessEnabled';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.boolean(COLUMN_NAME).notNullable().defaultTo(false);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.dropColumn(COLUMN_NAME);
  });
};
