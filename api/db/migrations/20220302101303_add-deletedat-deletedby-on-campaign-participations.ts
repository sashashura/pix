// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'campaign-participations';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DELETEDAT_... Remove this comment to see the full error message
const DELETEDAT_COLUMN = 'deletedAt';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DELETEDBY_... Remove this comment to see the full error message
const DELETEDBY_COLUMN = 'deletedBy';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ISIMPROVED... Remove this comment to see the full error message
const ISIMPROVED_COLUMN = 'isImproved';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'USERID_COL... Remove this comment to see the full error message
const USERID_COLUMN = 'userId';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CAMPAIGNID... Remove this comment to see the full error message
const CAMPAIGNID_COLUMN = 'campaignId';

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NEW_CONSTR... Remove this comment to see the full error message
const NEW_CONSTRAINT_NAME = 'campaign_participations_campaignid_userid_isimproved_deleted';
const OLD_CONSTRAINT_NAME = 'campaign_participations_campaignid_userid_isimproved';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  // eslint-disable-next-line knex/avoid-injections
  await knex.raw(`DROP INDEX ${OLD_CONSTRAINT_NAME};`);

  await knex.schema.table(TABLE_NAME, async (table: $TSFixMe) => {
    table.dateTime(DELETEDAT_COLUMN);
    table.bigInteger(DELETEDBY_COLUMN).index().references('users.id');
  });

  // eslint-disable-next-line knex/avoid-injections
  return knex.raw(
    `CREATE UNIQUE INDEX ${NEW_CONSTRAINT_NAME} ON "${TABLE_NAME}" ("${CAMPAIGNID_COLUMN}", "${USERID_COLUMN}" ) WHERE "${ISIMPROVED_COLUMN}" IS FALSE AND "${DELETEDAT_COLUMN}" IS NULL AND "${DELETEDBY_COLUMN}" IS NULL;`
  );
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  // eslint-disable-next-line knex/avoid-injections
  await knex.raw(`DROP INDEX ${NEW_CONSTRAINT_NAME};`);

  await knex.schema.table(TABLE_NAME, async (table: $TSFixMe) => {
    table.dropColumn(DELETEDAT_COLUMN);
    table.dropColumn(DELETEDBY_COLUMN);
  });

  // eslint-disable-next-line knex/avoid-injections
  return knex.raw(
    `CREATE UNIQUE INDEX ${OLD_CONSTRAINT_NAME} ON "${TABLE_NAME}" ("${CAMPAIGNID_COLUMN}", "${USERID_COLUMN}" ) WHERE "${ISIMPROVED_COLUMN}" IS FALSE;`
  );
};
