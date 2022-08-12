// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'complementary-certification-badges';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
const { PIX_EMPLOI_CLEA_V2, PIX_EMPLOI_CLEA_V3 } = require('../../lib/domain/models/Badge').keys;

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex(TABLE_NAME)
    .update({ level: 2 })
    .where({ badgeId: knex('badges').select('id').where({ key: PIX_EMPLOI_CLEA_V2 }) });
  await knex(TABLE_NAME)
    .update({ level: 3 })
    .where({ badgeId: knex('badges').select('id').where({ key: PIX_EMPLOI_CLEA_V3 }) });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex(TABLE_NAME)
    .update({ level: 1 })
    .where({ badgeId: knex('badges').select('id').where({ key: PIX_EMPLOI_CLEA_V2 }) });
  await knex(TABLE_NAME)
    .update({ level: 1 })
    .where({ badgeId: knex('badges').select('id').where({ key: PIX_EMPLOI_CLEA_V3 }) });
};
