// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'campaigns';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'COLUMN_NAM... Remove this comment to see the full error message
const COLUMN_NAME = 'ownerId';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema
    .table(TABLE_NAME, function (table: $TSFixMe) {
      table.bigInteger(COLUMN_NAME).references('users.id');
    })
    .then(() => {
      return knex(TABLE_NAME).update({ ownerId: knex.ref('creatorId') });
    })
    .then(() => {
      return knex.schema.alterTable(TABLE_NAME, function (table: $TSFixMe) {
        table.bigInteger(COLUMN_NAME).notNullable().alter();
      });
    });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.dropColumn(COLUMN_NAME);
  });
};
