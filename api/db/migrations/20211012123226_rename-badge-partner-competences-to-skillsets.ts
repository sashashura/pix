// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'OLD_TABLE_... Remove this comment to see the full error message
const OLD_TABLE_NAME = 'badge-partner-competences';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NEW_TABLE_... Remove this comment to see the full error message
const NEW_TABLE_NAME = 'skill-sets';

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'OLD_COLUMN... Remove this comment to see the full error message
const OLD_COLUMN_NAME = 'partnerCompetenceIds';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NEW_COLUMN... Remove this comment to see the full error message
const NEW_COLUMN_NAME = 'skillSetIds';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.renameTable(OLD_TABLE_NAME, NEW_TABLE_NAME);
  return knex.schema.table('badge-criteria', (t: $TSFixMe) => t.renameColumn(OLD_COLUMN_NAME, NEW_COLUMN_NAME));
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.schema.renameTable(NEW_TABLE_NAME, OLD_TABLE_NAME);
  return knex.schema.table('badge-criteria', (t: $TSFixMe) => t.renameColumn(NEW_COLUMN_NAME, OLD_COLUMN_NAME));
};
