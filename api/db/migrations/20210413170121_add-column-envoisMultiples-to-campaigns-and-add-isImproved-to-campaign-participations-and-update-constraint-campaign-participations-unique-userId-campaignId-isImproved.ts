const CAMPAIGNS_TABLE = 'campaigns';
const MULTIPLESENDINGS_COLUMN = 'multipleSendings';

const CAMPAIGNPARTICIPATIONS_TABLE = 'campaign-participations';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ISIMPROVED... Remove this comment to see the full error message
const ISIMPROVED_COLUMN = 'isImproved';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'USERID_COL... Remove this comment to see the full error message
const USERID_COLUMN = 'userId';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CAMPAIGNID... Remove this comment to see the full error message
const CAMPAIGNID_COLUMN = 'campaignId';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NEW_CONSTR... Remove this comment to see the full error message
const NEW_CONSTRAINT_NAME = 'campaign_participations_campaignid_userid_isimproved';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async (knex: $TSFixMe) => {
  await knex.schema.table(CAMPAIGNS_TABLE, function (table: $TSFixMe) {
    table.boolean(MULTIPLESENDINGS_COLUMN).defaultTo(false);
  });
  await knex.schema.table(CAMPAIGNPARTICIPATIONS_TABLE, function (table: $TSFixMe) {
    table.boolean(ISIMPROVED_COLUMN).defaultTo(false);
  });
  await knex.schema.table(CAMPAIGNPARTICIPATIONS_TABLE, function (table: $TSFixMe) {
    table.dropUnique([CAMPAIGNID_COLUMN, USERID_COLUMN]);
  });
  // eslint-disable-next-line knex/avoid-injections
  return knex.raw(
    `CREATE UNIQUE INDEX ${NEW_CONSTRAINT_NAME} ON "${CAMPAIGNPARTICIPATIONS_TABLE}" ("${CAMPAIGNID_COLUMN}", "${USERID_COLUMN}" ) WHERE "${ISIMPROVED_COLUMN}" IS FALSE;`
  );
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async (knex: $TSFixMe) => {
  // eslint-disable-next-line knex/avoid-injections
  await knex.raw(`DROP INDEX ${NEW_CONSTRAINT_NAME};`);
  await knex.schema.table(CAMPAIGNPARTICIPATIONS_TABLE, (table: $TSFixMe) => {
    table.dropColumn(ISIMPROVED_COLUMN);
  });
  await knex.schema.table(CAMPAIGNPARTICIPATIONS_TABLE, (table: $TSFixMe) => {
    table.unique([CAMPAIGNID_COLUMN, USERID_COLUMN]);
  });
  await knex.schema.table(CAMPAIGNS_TABLE, (table: $TSFixMe) => {
    table.dropColumn(MULTIPLESENDINGS_COLUMN);
  });
};
