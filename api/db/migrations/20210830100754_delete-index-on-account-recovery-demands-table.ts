// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'account-recovery-demands';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.dropIndex('oldEmail');
    table.dropIndex('newEmail');
    table.dropIndex('temporaryKey');
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.index('oldEmail');
    table.index('newEmail');
    table.index('temporaryKey');
  });
};
