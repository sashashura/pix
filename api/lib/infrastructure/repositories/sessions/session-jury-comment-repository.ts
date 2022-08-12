// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionJur... Remove this comment to see the full error message
const SessionJuryComment = require('../../../domain/models/SessionJuryComment');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(sessionId: $TSFixMe) {
    const result = await knex
      .select({
        id: 'id',
        comment: 'juryComment',
        authorId: 'juryCommentAuthorId',
        updatedAt: 'juryCommentedAt',
      })
      .from('sessions')
      .where({ id: sessionId })
      .first();

    if (!result) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError(`La session ${sessionId} n'existe pas ou son accès est restreint.`);
    }

    return new SessionJuryComment(result);
  },

  async save(sessionJuryComment: $TSFixMe) {
    const columnsToSave = {
      juryComment: sessionJuryComment.comment,
      juryCommentAuthorId: sessionJuryComment.authorId,
      juryCommentedAt: sessionJuryComment.updatedAt,
    };
    await _persist(sessionJuryComment.id, columnsToSave);
  },

  async delete(sessionJuryCommentId: $TSFixMe) {
    const columnsToSave = {
      juryComment: null,
      juryCommentAuthorId: null,
      juryCommentedAt: null,
    };
    await _persist(sessionJuryCommentId, columnsToSave);
  },
};

async function _persist(sessionId: $TSFixMe, columnsToSave: $TSFixMe) {
  const updatedSessionIds = await knex('sessions').update(columnsToSave).where({ id: sessionId }).returning('id');

  if (updatedSessionIds.length === 0) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError(`La session ${sessionId} n'existe pas ou son accès est restreint.`);
  }
}
