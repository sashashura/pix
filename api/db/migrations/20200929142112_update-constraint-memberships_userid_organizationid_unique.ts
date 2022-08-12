// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'memberships';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'USERID_COL... Remove this comment to see the full error message
const USERID_COLUMN = 'userId';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ORGANIZATI... Remove this comment to see the full error message
const ORGANIZATIONID_COLUMN = 'organizationId';
const DISABLEDAT_COLUMN = 'disabledAt';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NEW_CONSTR... Remove this comment to see the full error message
const NEW_CONSTRAINT_NAME = 'memberships_userid_organizationid_disabledAt_unique';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.dropUnique([USERID_COLUMN, ORGANIZATIONID_COLUMN]);
  });
  // eslint-disable-next-line knex/avoid-injections
  return knex.raw(
    `CREATE UNIQUE INDEX ${NEW_CONSTRAINT_NAME} ON ${TABLE_NAME} ("${USERID_COLUMN}", "${ORGANIZATIONID_COLUMN}") WHERE "${DISABLEDAT_COLUMN}" IS NULL;`
  );
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.dropUnique(null, NEW_CONSTRAINT_NAME);
    table.unique([USERID_COLUMN, ORGANIZATIONID_COLUMN]);
  });
};
