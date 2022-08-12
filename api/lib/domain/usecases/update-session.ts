// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sessionVal... Remove this comment to see the full error message
const sessionValidator = require('../validators/session-validator');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function updateSession({
  session,
  sessionRepository
}: $TSFixMe) {
  sessionValidator.validate(session);
  const sessionToUpdate = await sessionRepository.get(session.id);
  Object.assign(sessionToUpdate, session);

  return sessionRepository.updateSessionInfo(sessionToUpdate);
};
