// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function flagSessionResultsAsSentToPrescriber({
  sessionId,
  sessionRepository
}: $TSFixMe) {
  const integerSessionId = parseInt(sessionId);
  const NOT_FOUND_SESSION = `La session ${sessionId} n'existe pas ou son accès est restreint lors du marquage d'envoi des résultats au prescripteur`;

  if (!Number.isFinite(integerSessionId)) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError(NOT_FOUND_SESSION);
  }

  let session = await sessionRepository.get(sessionId);

  if (!session.areResultsFlaggedAsSent()) {
    session = await sessionRepository.flagResultsAsSentToPrescriber({
      id: sessionId,
      resultsSentToPrescriberAt: new Date(),
    });
    return { resultsFlaggedAsSent: true, session };
  }

  return { resultsFlaggedAsSent: false, session };
};
