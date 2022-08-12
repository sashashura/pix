// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const BookshelfBadgeAcquisition = require('../orm-models/BadgeAcquisition');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BadgeAcqui... Remove this comment to see the full error message
const BadgeAcquisition = require('../../domain/models/BadgeAcquisition');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Badge'.
const Badge = require('../../domain/models/Badge');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BadgeCrite... Remove this comment to see the full error message
const BadgeCriterion = require('../../domain/models/BadgeCriterion');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SkillSet'.
const SkillSet = require('../../domain/models/SkillSet');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async createOrUpdate(badgeAcquisitionsToCreate = [], domainTransaction = DomainTransaction.emptyTransaction()) {
    const knexConn = domainTransaction.knexTransaction || Bookshelf.knex;
    return bluebird.mapSeries(badgeAcquisitionsToCreate, async (badgeAcquisitionToCreate: $TSFixMe) => {
      const alreadyCreatedBadgeAcquisition = await knexConn('badge-acquisitions')
        .select('id')
        .where(badgeAcquisitionToCreate);
      if (alreadyCreatedBadgeAcquisition.length === 0) {
        return knexConn('badge-acquisitions').insert(badgeAcquisitionsToCreate);
      } else {
        return knexConn('badge-acquisitions')
          .update({ updatedAt: Bookshelf.knex.raw('CURRENT_TIMESTAMP') })
          .where(badgeAcquisitionToCreate);
      }
    });
  },

  async hasAcquiredBadge({
    badgeKey,
    userId
  }: $TSFixMe) {
    const badgeAcquisition = await Bookshelf.knex('badge-acquisitions')
      .select('badge-acquisitions.id')
      .innerJoin('badges', 'badges.id', 'badgeId')
      .where({ userId, key: badgeKey })
      .first();
    return Boolean(badgeAcquisition);
  },

  async getAcquiredBadgeIds({
    badgeIds,
    userId
  }: $TSFixMe) {
    const collectionResult = await BookshelfBadgeAcquisition.where({ userId })
      .where('badgeId', 'in', badgeIds)
      .fetchAll({ columns: ['badge-acquisitions.badgeId'], require: false });
    return collectionResult.map((obj: $TSFixMe) => obj.attributes.badgeId);
  },

  async getAcquiredBadgesByCampaignParticipations({
    campaignParticipationsIds
  }: $TSFixMe) {
    const badges = await Bookshelf.knex('badges')
      .distinct('badges.id')
      .select('badge-acquisitions.campaignParticipationId AS campaignParticipationId', 'badges.*')
      .from('badges')
      .join('badge-acquisitions', 'badges.id', 'badge-acquisitions.badgeId')
      .where('badge-acquisitions.campaignParticipationId', 'IN', campaignParticipationsIds)
      .orderBy('badges.id');

    const acquiredBadgesByCampaignParticipations = {};
    for (const badge of badges) {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      if (acquiredBadgesByCampaignParticipations[badge.campaignParticipationId]) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        acquiredBadgesByCampaignParticipations[badge.campaignParticipationId].push(badge);
      } else {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        acquiredBadgesByCampaignParticipations[badge.campaignParticipationId] = [badge];
      }
    }
    return acquiredBadgesByCampaignParticipations;
  },

  async getCampaignAcquiredBadgesByUsers({
    campaignId,
    userIds
  }: $TSFixMe) {
    const results = await BookshelfBadgeAcquisition.query((qb: $TSFixMe) => {
      qb.join('badges', 'badges.id', 'badge-acquisitions.badgeId');
      qb.join('campaigns', 'campaigns.targetProfileId', 'badges.targetProfileId');
      qb.where('campaigns.id', '=', campaignId);
      qb.where('badge-acquisitions.userId', 'IN', userIds);
    }).fetchAll({
      withRelated: ['badge'],
      require: false,
    });

    const badgeAcquisitions = results.map((result: $TSFixMe) => bookshelfToDomainConverter.buildDomainObject(BookshelfBadgeAcquisition, result)
    );

    const acquiredBadgesByUsers = {};
    for (const badgeAcquisition of badgeAcquisitions) {
      const { userId, badge } = badgeAcquisition;
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      if (acquiredBadgesByUsers[userId]) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        acquiredBadgesByUsers[userId].push(badge);
      } else {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        acquiredBadgesByUsers[userId] = [badge];
      }
    }
    return acquiredBadgesByUsers;
  },

  async findHighestCertifiable({
    userId,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: $TSFixMe) {
    const knexConn = domainTransaction.knexTransaction || knex;
    const certifiableBadgeAcquisitions = await knexConn('badge-acquisitions')
      .select('badges.*', 'badge-acquisitions.*')
      .join('badges', 'badges.id', 'badge-acquisitions.badgeId')
      .join('complementary-certification-badges', 'badges.id', 'complementary-certification-badges.badgeId')
      .where({
        'badge-acquisitions.userId': userId,
        'badges.isCertifiable': true,
      })
      .whereRaw(
        '"complementary-certification-badges".level = (select max(level) from "complementary-certification-badges" ccb join "badges" b on ccb."badgeId" = b.id join "badge-acquisitions" ba on ba."badgeId" = b.id where "complementary-certification-badges"."complementaryCertificationId" = ccb."complementaryCertificationId" and ba."userId" = ? and b."isCertifiable" = true)',
        userId
      );

    const certifiableBadgeAcquisitionBadgeIds = certifiableBadgeAcquisitions.map(
      (certifiableBadgeAcquisition: $TSFixMe) => certifiableBadgeAcquisition.badgeId
    );

    const badgeCriteria = await knex('badge-criteria').whereIn('badgeId', certifiableBadgeAcquisitionBadgeIds);

    const skillSetIds = badgeCriteria.flatMap((badgeCriterion: $TSFixMe) => badgeCriterion.skillSetIds);

    const uniqueSkillSetIds = [...new Set(skillSetIds)];

    const skillSets = await knex('skill-sets').whereIn('id', uniqueSkillSetIds);

    // @ts-expect-error TS(2554): Expected 1 arguments, but got 3.
    return _toDomain(certifiableBadgeAcquisitions, badgeCriteria, skillSets);
  },
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(certifiableBadgeAcquisitionsDto: $TSFixMe, badgeCriteriaDto: $TSFixMe, skillSetsDto: $TSFixMe) {
  return certifiableBadgeAcquisitionsDto.map((certifiableBadgeAcquisitionDto: $TSFixMe) => {
    const skillSets = skillSetsDto
      .filter((skillSetDto: $TSFixMe) => skillSetDto.badgeId === certifiableBadgeAcquisitionDto.badgeId)
      .map((skillSetDto: $TSFixMe) => new SkillSet({ ...skillSetDto }));

    const badgeCriteria = badgeCriteriaDto
      .filter((badgeCriterionDto: $TSFixMe) => badgeCriterionDto.badgeId === certifiableBadgeAcquisitionDto.badgeId)
      .map((badgeCriterionDto: $TSFixMe) => new BadgeCriterion({ ...badgeCriterionDto }));
    const badge = new Badge({
      ...certifiableBadgeAcquisitionDto,
      id: certifiableBadgeAcquisitionDto.badgeId,
      badgeCriteria,
      skillSets,
    });

    return new BadgeAcquisition({
      ...certifiableBadgeAcquisitionDto,
      badge,
    });
  });
}
