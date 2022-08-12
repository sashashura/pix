// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'organizations';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'COLUMN_NAM... Remove this comment to see the full error message
const COLUMN_NAME = 'identityProviderForCampaigns';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.table(TABLE_NAME, async (table: $TSFixMe) => {
    table.string(COLUMN_NAME).nullable();
  });

  return knex.raw(
    'ALTER TABLE "organizations" ADD CONSTRAINT "organizations_identityProviderForCampaigns_check" CHECK ( "identityProviderForCampaigns" IN (\'POLE_EMPLOI\', \'CNAV\') )'
  );
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn(COLUMN_NAME);
  });
};
