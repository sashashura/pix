// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getCertifi... Remove this comment to see the full error message
async function getCertificationCandidate({
  userId,
  sessionId,
  certificationCandidateRepository
}: $TSFixMe) {
  return certificationCandidateRepository.getBySessionIdAndUserId({ userId, sessionId });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = getCertificationCandidate;
