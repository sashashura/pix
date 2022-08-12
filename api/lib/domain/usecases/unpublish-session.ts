// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function unpublishSession({
  sessionId,
  certificationRepository,
  sessionRepository,
  finalizedSessionRepository
}: $TSFixMe) {
  const session = await sessionRepository.getWithCertificationCandidates(sessionId);

  await certificationRepository.unpublishCertificationCoursesBySessionId(sessionId);

  session.publishedAt = null;

  await sessionRepository.updatePublishedAt({ id: sessionId, publishedAt: session.publishedAt });

  await _updateFinalizedSession(finalizedSessionRepository, sessionId);

  return sessionRepository.getWithCertificationCandidates(sessionId);
};

async function _updateFinalizedSession(finalizedSessionRepository: $TSFixMe, sessionId: $TSFixMe) {
  const finalizedSession = await finalizedSessionRepository.get({ sessionId });
  finalizedSession.unpublish();
  await finalizedSessionRepository.save(finalizedSession);
}
