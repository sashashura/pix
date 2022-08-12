// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'memberships';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  // eslint-disable-next-line knex/avoid-injections
  await knex.raw(`
    WITH newroles AS (
      SELECT id,
             CASE ROW_NUMBER() OVER (PARTITION BY "organizationId" ORDER BY id ASC) WHEN 1 THEN 'OWNER' ELSE 'MEMBER' END newrole
      FROM ${TABLE_NAME}
    )
    UPDATE ${TABLE_NAME}
    SET "organizationRole" = ( select newroles.newrole FROM newroles WHERE ${TABLE_NAME}.id = newroles.id );
  `);
};

// Rollback, make every membership an MEMBER
// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex(TABLE_NAME).update({
    organizationRole: 'MEMBER',
  });
};
