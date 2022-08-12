// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'campaign-participations';
const REFERENCE_TABLE_NAME = 'schooling-registrations';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'COLUMN_NAM... Remove this comment to see the full error message
const COLUMN_NAME = 'schoolingRegistrationId';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.integer(COLUMN_NAME).references(`${REFERENCE_TABLE_NAME}.id`).defaultTo(null);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.dropColumn(COLUMN_NAME);
  });
};
