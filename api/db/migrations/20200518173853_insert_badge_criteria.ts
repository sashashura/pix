// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'badge-criteria';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  const badgeClea = await knex('badges').select('id').where('key', 'PIX_EMPLOI_CLEA');
  if (badgeClea.length > 0) {
    await knex(TABLE_NAME).insert({ scope: 'CampaignParticipation', threshold: 85, badgeId: badgeClea[0].id });
    await knex(TABLE_NAME).insert({ scope: 'EveryPartnerCompetence', threshold: 75, badgeId: badgeClea[0].id });
  }
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  const badgeClea = await knex('badges').select('id').where('key', 'PIX_EMPLOI_CLEA');
  if (badgeClea.length > 0) {
    await knex(TABLE_NAME).where('badgeId', badgeClea[0].id).delete();
  }
};
