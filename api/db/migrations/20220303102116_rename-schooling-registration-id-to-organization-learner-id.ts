const CERTIFICATION_CANDIDATES = 'certification-candidates';
const ACCOUNT_RECOVERY_DEMANDS = 'account-recovery-demands';
const CAMPAIGN_PARTICIPATIONS = 'campaign-participations';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'OLD_COLUMN... Remove this comment to see the full error message
const OLD_COLUMN_NAME = 'schoolingRegistrationId';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NEW_COLUMN... Remove this comment to see the full error message
const NEW_COLUMN_NAME = 'organizationLearnerId';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.table(ACCOUNT_RECOVERY_DEMANDS, (table: $TSFixMe) => table.renameColumn(OLD_COLUMN_NAME, NEW_COLUMN_NAME));

  await knex.schema.table(CERTIFICATION_CANDIDATES, (table: $TSFixMe) => {
    table.dropIndex(OLD_COLUMN_NAME);
    table.renameColumn(OLD_COLUMN_NAME, NEW_COLUMN_NAME);
    table.index(NEW_COLUMN_NAME);
  });

  return knex.schema.table(CAMPAIGN_PARTICIPATIONS, (table: $TSFixMe) => {
    table.renameColumn(OLD_COLUMN_NAME, NEW_COLUMN_NAME);
    table.index(NEW_COLUMN_NAME);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.schema.table(ACCOUNT_RECOVERY_DEMANDS, (table: $TSFixMe) => table.renameColumn(NEW_COLUMN_NAME, OLD_COLUMN_NAME));

  await knex.schema.table(CERTIFICATION_CANDIDATES, (table: $TSFixMe) => {
    table.dropIndex(NEW_COLUMN_NAME);
    table.renameColumn(NEW_COLUMN_NAME, OLD_COLUMN_NAME);
    table.index(OLD_COLUMN_NAME);
  });

  return knex.schema.table(CAMPAIGN_PARTICIPATIONS, (table: $TSFixMe) => {
    table.dropIndex(NEW_COLUMN_NAME);
    table.renameColumn(NEW_COLUMN_NAME, OLD_COLUMN_NAME);
  });
};
