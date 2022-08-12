// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionSta... Remove this comment to see the full error message
const { SessionStartedDeletionError } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function deleteSession({
  sessionId,
  sessionRepository,
  certificationCourseRepository
}: $TSFixMe) {
  if (await _isSessionStarted(certificationCourseRepository, sessionId)) {
    throw new SessionStartedDeletionError();
  }

  await sessionRepository.delete(sessionId);
};

async function _isSessionStarted(certificationCourseRepository: $TSFixMe, sessionId: $TSFixMe) {
  const foundCertificationCourses = await certificationCourseRepository.findCertificationCoursesBySessionId({
    sessionId,
  });
  return foundCertificationCourses.length > 0;
}
