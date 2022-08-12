// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'certification-courses';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.string('firstName');
    table.string('lastName');
    table.date('birthdate');
    table.string('birthplace');
    table.string('rejectionReason');
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.dropTable('firstName');
    table.dropTable('lastName');
    table.dropTable('birthdate');
    table.dropTable('birthplace');
    table.dropTable('rejectionReason');
  });
};
