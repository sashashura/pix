// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const BookshelfBadge = require('../orm-models/Badge');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Badge'.
const Badge = require('../../domain/models/Badge');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'omit'.
const omit = require('lodash/omit');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfU... Remove this comment to see the full error message
const bookshelfUtils = require('../utils/knex-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
const { AlreadyExistingEntityError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../infrastructure/DomainTransaction');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'badges';

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  findByTargetProfileId(targetProfileId: $TSFixMe) {
    return BookshelfBadge.where({ targetProfileId })
      .fetchAll({
        require: false,
        withRelated: ['badgeCriteria', 'skillSets'],
      })
      .then((results: $TSFixMe) => bookshelfToDomainConverter.buildDomainObjects(BookshelfBadge, results));
  },

  findByCampaignId(campaignId: $TSFixMe) {
    return BookshelfBadge.query((qb: $TSFixMe) => {
      qb.join('target-profiles', 'target-profiles.id', 'badges.targetProfileId');
      qb.join('campaigns', 'campaigns.targetProfileId', 'target-profiles.id');
    })
      .where('campaigns.id', campaignId)
      .fetchAll({
        require: false,
        withRelated: ['badgeCriteria', 'skillSets'],
      })
      .then((results: $TSFixMe) => bookshelfToDomainConverter.buildDomainObjects(BookshelfBadge, results));
  },

  findByCampaignParticipationId(campaignParticipationId: $TSFixMe) {
    return BookshelfBadge.query((qb: $TSFixMe) => {
      qb.join('target-profiles', 'target-profiles.id', 'badges.targetProfileId');
      qb.join('campaigns', 'campaigns.targetProfileId', 'target-profiles.id');
      qb.join('campaign-participations', 'campaign-participations.campaignId', 'campaigns.id');
    })
      .where('campaign-participations.id', campaignParticipationId)
      .fetchAll({
        require: false,
        withRelated: ['badgeCriteria', 'skillSets'],
      })
      .then((results: $TSFixMe) => bookshelfToDomainConverter.buildDomainObjects(BookshelfBadge, results));
  },

  async isAssociated(badgeId: $TSFixMe, { knexTransaction } = DomainTransaction.emptyTransaction()) {
    const associatedBadge = await (knexTransaction ?? knex)('badge-acquisitions').where({ badgeId }).first();
    return !!associatedBadge;
  },

  async isRelatedToCertification(badgeId: $TSFixMe, { knexTransaction } = DomainTransaction.emptyTransaction()) {
    const complementaryCertificationCourseResultBadge = await (knexTransaction ?? knex)(
      'complementary-certification-course-results'
    )
      .join('badges', 'partnerKey', 'key')
      .where('badges.id', badgeId)
      .first();
    const complementaryCertificationBadge = await knex('complementary-certification-badges').where({ badgeId }).first();
    return !!(complementaryCertificationCourseResultBadge || complementaryCertificationBadge);
  },

  async get(id: $TSFixMe) {
    const bookshelfBadge = await BookshelfBadge.where('id', id).fetch({
      withRelated: ['badgeCriteria', 'skillSets'],
    });
    return bookshelfToDomainConverter.buildDomainObject(BookshelfBadge, bookshelfBadge);
  },

  async getByKey(key: $TSFixMe) {
    const bookshelfBadge = await BookshelfBadge.where({ key }).fetch({
      withRelated: ['badgeCriteria', 'skillSets'],
    });
    return bookshelfToDomainConverter.buildDomainObject(BookshelfBadge, bookshelfBadge);
  },

  async save(badge: $TSFixMe, { knexTransaction } = DomainTransaction.emptyTransaction()) {
    try {
      const [savedBadge] = await (knexTransaction ?? knex)(TABLE_NAME).insert(_adaptModelToDb(badge)).returning('*');
      return new Badge(savedBadge);
    } catch (err) {
      if (bookshelfUtils.isUniqConstraintViolated(err)) {
        throw new AlreadyExistingEntityError(`The badge key ${badge.key} already exists`);
      }
      throw err;
    }
  },

  async update(badge: $TSFixMe) {
    const [updatedBadge] = await knex(TABLE_NAME).update(_adaptModelToDb(badge)).where({ id: badge.id }).returning('*');
    return new Badge({ ...badge, ...updatedBadge });
  },

  async isKeyAvailable(key: $TSFixMe, { knexTransaction } = DomainTransaction.emptyTransaction()) {
    const result = await (knexTransaction ?? knex)(TABLE_NAME).select('key').where('key', key);
    if (result.length) {
      throw new AlreadyExistingEntityError(`The badge key ${key} already exists`);
    }
    return true;
  },

  async delete(badgeId: $TSFixMe, { knexTransaction } = DomainTransaction.emptyTransaction()) {
    const knexConn = knexTransaction ?? knex;
    await knexConn('badge-criteria').where({ badgeId }).del();
    await knexConn('skill-sets').where({ badgeId }).del();
    await knexConn('badges').where({ id: badgeId }).del();

    return true;
  },
};

function _adaptModelToDb(badge: $TSFixMe) {
  return omit(badge, ['id', 'badgeCriteria', 'skillSets']);
}
