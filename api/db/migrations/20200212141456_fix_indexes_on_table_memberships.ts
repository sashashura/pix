// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'memberships';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'USERID_COL... Remove this comment to see the full error message
const USERID_COLUMN = 'userId';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ORGANIZATI... Remove this comment to see the full error message
const ORGANIZATIONID_COLUMN = 'organizationId';
const OLD_INDEX_USERID = 'organizations_accesses_userid_index';
const OLD_INDEX_ORGANIZATIONID = 'organizations_accesses_organizationid_index';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  // eslint-disable-next-line knex/avoid-injections
  await knex.raw(`DROP INDEX IF EXISTS ${OLD_INDEX_USERID}`);
  // eslint-disable-next-line knex/avoid-injections
  await knex.raw(`DROP INDEX IF EXISTS ${OLD_INDEX_ORGANIZATIONID}`);
  return knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.index(ORGANIZATIONID_COLUMN);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.dropIndex(ORGANIZATIONID_COLUMN);
    table.index(USERID_COLUMN, OLD_INDEX_USERID);
    table.index(ORGANIZATIONID_COLUMN, OLD_INDEX_ORGANIZATIONID);
  });
};
