// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../http-errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCourseRepository = require('../../infrastructure/repositories/certification-course-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sessionRep... Remove this comment to see the full error message
const sessionRepository = require('../../infrastructure/repositories/sessions/session-repository');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports.verifySessionAuthorization = async (request: $TSFixMe) => {
  const userId = request.auth.credentials.userId;
  const sessionId = request.params.id;

  return await _isAuthorizedToAccessSession({ userId, sessionId });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports.verifyCertificationSessionAuthorization = async (request: $TSFixMe) => {
  const userId = request.auth.credentials.userId;
  const certificationCourseId = request.params.id;

  const certificationCourse = await certificationCourseRepository.get(certificationCourseId);

  return await _isAuthorizedToAccessSession({ userId, sessionId: certificationCourse.getSessionId() });
};

async function _isAuthorizedToAccessSession({
  userId,
  sessionId
}: $TSFixMe) {
  const hasMembershipAccess = await sessionRepository.doesUserHaveCertificationCenterMembershipForSession(
    userId,
    sessionId
  );

  if (!hasMembershipAccess) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError("La session n'existe pas ou son accès est restreint");
  }

  return hasMembershipAccess;
}
