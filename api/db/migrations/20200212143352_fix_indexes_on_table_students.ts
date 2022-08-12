// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'students';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'USERID_COL... Remove this comment to see the full error message
const USERID_COLUMN = 'userId';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ORGANIZATI... Remove this comment to see the full error message
const ORGANIZATIONID_COLUMN = 'organizationId';
const NATIONALSTUDENTID_COLUMN = 'nationalStudentId';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.dropIndex(NATIONALSTUDENTID_COLUMN);
    table.dropIndex(ORGANIZATIONID_COLUMN);
    table.dropIndex(USERID_COLUMN);
    table.dropUnique([NATIONALSTUDENTID_COLUMN, ORGANIZATIONID_COLUMN]);
    table.unique([ORGANIZATIONID_COLUMN, NATIONALSTUDENTID_COLUMN]);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.index(NATIONALSTUDENTID_COLUMN);
    table.index(ORGANIZATIONID_COLUMN);
    table.index(USERID_COLUMN);
    table.unique([NATIONALSTUDENTID_COLUMN, ORGANIZATIONID_COLUMN]);
    table.dropUnique([ORGANIZATIONID_COLUMN, NATIONALSTUDENTID_COLUMN]);
  });
};
