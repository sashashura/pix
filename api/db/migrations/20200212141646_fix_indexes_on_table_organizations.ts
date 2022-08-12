// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'organizations';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'USERID_COL... Remove this comment to see the full error message
const USERID_COLUMN = 'userId';
const PROVINCECODE_COLUMN = 'provinceCode';
const EXTERNALID_COLUMN = 'externalId';
const CODE_COLUMN = 'code';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.dropIndex(USERID_COLUMN);
    table.dropIndex(PROVINCECODE_COLUMN);
    table.dropIndex(EXTERNALID_COLUMN);
    table.index(CODE_COLUMN);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.index(USERID_COLUMN);
    table.index(PROVINCECODE_COLUMN);
    table.index(EXTERNALID_COLUMN);
    table.dropIndex(CODE_COLUMN);
  });
};
