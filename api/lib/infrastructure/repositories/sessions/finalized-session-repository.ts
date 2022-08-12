// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../bookshelf');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const FinalizedSessionBookshelf = require('../../orm-models/FinalizedSession');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../../utils/bookshelf-to-domain-converter');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async save(finalizedSession: $TSFixMe) {
    await knex('finalized-sessions').insert(_toDTO(finalizedSession)).onConflict('sessionId').merge();
    return finalizedSession;
  },

  async get({
    sessionId
  }: $TSFixMe) {
    const bookshelfFinalizedSession = await FinalizedSessionBookshelf.where({ sessionId }).fetch({ require: false });

    if (bookshelfFinalizedSession) {
      return bookshelfToDomainConverter.buildDomainObject(FinalizedSessionBookshelf, bookshelfFinalizedSession);
    }

    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError(`Session of id ${sessionId} does not exist.`);
  },

  async findFinalizedSessionsToPublish() {
    const publishableFinalizedSessions = await FinalizedSessionBookshelf.where({
      isPublishable: true,
      publishedAt: null,
      assignedCertificationOfficerName: null,
    })
      .orderBy('finalizedAt')
      .fetchAll();

    return bookshelfToDomainConverter.buildDomainObjects(FinalizedSessionBookshelf, publishableFinalizedSessions);
  },

  async findFinalizedSessionsWithRequiredAction() {
    const publishableFinalizedSessions = await FinalizedSessionBookshelf.where({
      isPublishable: false,
      publishedAt: null,
    })
      .orderBy('finalizedAt')
      .fetchAll();

    return bookshelfToDomainConverter.buildDomainObjects(FinalizedSessionBookshelf, publishableFinalizedSessions);
  },
};

function _toDTO(finalizedSession: $TSFixMe) {
  return _.omit(
    {
      ...finalizedSession,
      date: finalizedSession.sessionDate,
      time: finalizedSession.sessionTime,
    },
    ['sessionDate', 'sessionTime']
  );
}
