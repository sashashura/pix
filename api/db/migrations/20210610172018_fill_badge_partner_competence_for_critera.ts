// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  const badgesAndPartnerCompetences = await knex('badges')
    .select('badges.id as badgeId', 'badge-partner-competences.id as partnerCompetenceId')
    .leftJoin('badge-criteria', 'badges.id', 'badge-criteria.badgeId')
    .leftJoin('badge-partner-competences', 'badges.id', 'badge-partner-competences.badgeId')
    .where({
      'badge-criteria.scope': 'EveryPartnerCompetence',
    });

  let badgesWithPartnerCompetences = _.groupBy(badgesAndPartnerCompetences, 'badgeId');
  badgesWithPartnerCompetences = _.map(badgesWithPartnerCompetences, (partnerCompetencesInfos: $TSFixMe, badgeId: $TSFixMe) => {
    const partnerCompetenceIds = _(partnerCompetencesInfos).map('partnerCompetenceId').filter(null).value();
    return [badgeId, partnerCompetenceIds];
  });

  await bluebird.mapSeries(badgesWithPartnerCompetences, async (badgeWithPartnerCompetences: $TSFixMe) => {
    const badgeId = badgeWithPartnerCompetences[0];
    const partnerCompetenceIds = badgeWithPartnerCompetences[1];
    await knex('badge-criteria')
      .update({ partnerCompetenceIds, scope: 'SomePartnerCompetences' })
      .where({ badgeId, scope: 'EveryPartnerCompetence' });
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function () {
  return;
};
