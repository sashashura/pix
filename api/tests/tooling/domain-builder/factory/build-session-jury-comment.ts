// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionJur... Remove this comment to see the full error message
const SessionJuryComment = require('../../../../lib/domain/models/SessionJuryComment');

const buildSessionJuryComment = function ({
  id = 123,
  comment = 'Un commentaire du pôle certif',
  authorId = 456,
  updatedAt = new Date('2021-07-21T01:02:23Z'),
} = {}) {
  return new SessionJuryComment({
    id,
    comment,
    authorId,
    updatedAt,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildSessionJuryComment;
