// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'account-recovery-demands';
const TABLE_COLUMN = 'schoolingRegistrationId';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'REFERENCED... Remove this comment to see the full error message
const REFERENCED_COLUMN_NAME = 'schooling-registrations.id';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.integer(TABLE_COLUMN).unsigned().references(REFERENCED_COLUMN_NAME);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn(TABLE_COLUMN);
  });
};
