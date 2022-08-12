// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'badge-acquisitions';
const CAMPAIGN_PARTICIPATION_ID_COLUMN = 'campaignParticipationId';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.integer(CAMPAIGN_PARTICIPATION_ID_COLUMN).references('campaign-participations.id').index();
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn(CAMPAIGN_PARTICIPATION_ID_COLUMN);
  });
};
