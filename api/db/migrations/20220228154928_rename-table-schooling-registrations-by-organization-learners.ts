// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'OLD_TABLE_... Remove this comment to see the full error message
const OLD_TABLE_NAME = 'schooling-registrations';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NEW_TABLE_... Remove this comment to see the full error message
const NEW_TABLE_NAME = 'organization-learners';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.renameTable(OLD_TABLE_NAME, NEW_TABLE_NAME);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.schema.renameTable(NEW_TABLE_NAME, OLD_TABLE_NAME);
};
