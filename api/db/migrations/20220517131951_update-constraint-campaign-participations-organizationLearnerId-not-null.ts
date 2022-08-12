// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CAMPAIGN_P... Remove this comment to see the full error message
const CAMPAIGN_PARTICIPATIONS_TABLE = 'campaign-participations';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ISIMPROVED... Remove this comment to see the full error message
const ISIMPROVED_COLUMN = 'isImproved';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DELETEDAT_... Remove this comment to see the full error message
const DELETEDAT_COLUMN = 'deletedAt';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DELETEDBY_... Remove this comment to see the full error message
const DELETEDBY_COLUMN = 'deletedBy';
const ORGANIZATIONLEARNERID_COLUMN = 'organizationLearnerId';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CAMPAIGNID... Remove this comment to see the full error message
const CAMPAIGNID_COLUMN = 'campaignId';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NEW_CONSTR... Remove this comment to see the full error message
const NEW_CONSTRAINT_NAME = 'one_active_participation_by_learner';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async (knex: $TSFixMe) => {
  await knex.schema.alterTable(CAMPAIGN_PARTICIPATIONS_TABLE, function (table: $TSFixMe) {
    table.integer(ORGANIZATIONLEARNERID_COLUMN).notNullable().alter();
  });

  return knex.raw(
    `CREATE UNIQUE INDEX :name: ON :participationsTable: (:campaignId:, :organizationLearnerId: ) WHERE :isImproved: IS FALSE AND :deletedAt: IS NULL AND :deletedBy: IS NULL;`,
    {
      name: NEW_CONSTRAINT_NAME,
      participationsTable: CAMPAIGN_PARTICIPATIONS_TABLE,
      campaignId: CAMPAIGNID_COLUMN,
      organizationLearnerId: ORGANIZATIONLEARNERID_COLUMN,
      isImproved: ISIMPROVED_COLUMN,
      deletedAt: DELETEDAT_COLUMN,
      deletedBy: DELETEDBY_COLUMN,
    }
  );
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async (knex: $TSFixMe) => {
  await knex.schema.alterTable(CAMPAIGN_PARTICIPATIONS_TABLE, function (table: $TSFixMe) {
    table.integer(ORGANIZATIONLEARNERID_COLUMN).nullable().alter();
  });

  // eslint-disable-next-line knex/avoid-injections
  return knex.raw(`DROP INDEX ${NEW_CONSTRAINT_NAME};`);
};
