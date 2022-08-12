// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const BookshelfKnowledgeElementSnapshot = require('../orm-models/KnowledgeElementSnapshot');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../../domain/models/KnowledgeElement');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
const { AlreadyExistingEntityError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfU... Remove this comment to see the full error message
const bookshelfUtils = require('../utils/knex-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');

function _toKnowledgeElementCollection({
  snapshot
}: $TSFixMe = {}) {
  if (!snapshot) return null;
  return snapshot.map(
    (data: $TSFixMe) => new KnowledgeElement({
      ...data,
      createdAt: new Date(data.createdAt),
    })
  );
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async save({
    userId,
    snappedAt,
    knowledgeElements,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: $TSFixMe) {
    try {
      await new BookshelfKnowledgeElementSnapshot({
        userId,
        snappedAt,
        snapshot: JSON.stringify(knowledgeElements),
      }).save(null, { transacting: domainTransaction.knexTransaction });
    } catch (error) {
      if (bookshelfUtils.isUniqConstraintViolated(error)) {
        throw new AlreadyExistingEntityError(
          `A snapshot already exists for the user ${userId} at the datetime ${snappedAt}.`
        );
      }
    }
  },

  async findByUserIdsAndSnappedAtDates(userIdsAndSnappedAtDates = {}) {
    const params = Object.entries(userIdsAndSnappedAtDates);
    const results = await knex
      .select('userId', 'snapshot')
      .from('knowledge-element-snapshots')
      .whereIn(['userId', 'snappedAt'], params);

    const knowledgeElementsByUserId = {};
    for (const result of results) {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      knowledgeElementsByUserId[result.userId] = _toKnowledgeElementCollection(result);
    }

    const userIdsWithoutSnapshot = _.difference(
      Object.keys(userIdsAndSnappedAtDates),
      Object.keys(knowledgeElementsByUserId)
    );
    for (const userId of userIdsWithoutSnapshot) {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      knowledgeElementsByUserId[userId] = null;
    }

    return knowledgeElementsByUserId;
  },
};
