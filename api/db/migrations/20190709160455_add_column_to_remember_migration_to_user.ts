// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'users';
const COLUMN_NAME_PROFILEV2 = 'isProfileV2';
const COLUMN_NAME_PROFILEV2_DATE = 'migratedAt';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.boolean(COLUMN_NAME_PROFILEV2).notNullable().defaultTo(false);
    table.dateTime(COLUMN_NAME_PROFILEV2_DATE).nullable();
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn(COLUMN_NAME_PROFILEV2);
    table.dropColumn(COLUMN_NAME_PROFILEV2_DATE);
  });
};
