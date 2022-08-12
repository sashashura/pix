// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'memberships';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CREATED_AT... Remove this comment to see the full error message
const CREATED_AT_COLUMN = 'createdAt';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UPDATED_AT... Remove this comment to see the full error message
const UPDATED_AT_COLUMN = 'updatedAt';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dateTime(CREATED_AT_COLUMN);
    table.dateTime(UPDATED_AT_COLUMN);
  });
  await knex.schema.alterTable(TABLE_NAME, (table: $TSFixMe) => {
    table.dateTime(CREATED_AT_COLUMN).defaultTo(knex.fn.now()).alter();
    table.dateTime(UPDATED_AT_COLUMN).defaultTo(knex.fn.now()).alter();
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn(UPDATED_AT_COLUMN);
    table.dropColumn(CREATED_AT_COLUMN);
  });
};
