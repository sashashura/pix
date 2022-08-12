// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'campaign-participations';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'OLD_COLUMN... Remove this comment to see the full error message
const OLD_COLUMN_NAME = 'masteryPercentage';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NEW_COLUMN... Remove this comment to see the full error message
const NEW_COLUMN_NAME = 'masteryRate';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = (knex: $TSFixMe) => {
  return knex.schema.table(TABLE_NAME, (t: $TSFixMe) => t.renameColumn(OLD_COLUMN_NAME, NEW_COLUMN_NAME));
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = (knex: $TSFixMe) => {
  return knex.schema.table(TABLE_NAME, (t: $TSFixMe) => t.renameColumn(NEW_COLUMN_NAME, OLD_COLUMN_NAME));
};
