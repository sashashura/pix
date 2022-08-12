// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getSupervisorKitSessionInfo({
  userId,
  sessionId,
  sessionRepository,
  sessionForSupervisorKitRepository
}: $TSFixMe) {
  const hasMembership = await sessionRepository.doesUserHaveCertificationCenterMembershipForSession(userId, sessionId);
  if (!hasMembership) {
    throw new UserNotAuthorizedToAccessEntityError('User is not allowed to access session.');
  }

  const sessionForSupervisorKit = await sessionForSupervisorKitRepository.get(sessionId);

  return sessionForSupervisorKit;
};
