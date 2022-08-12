// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function publishSession({
  sessionId,
  certificationRepository,
  finalizedSessionRepository,
  sessionRepository,
  sessionPublicationService,
  publishedAt = new Date()
}: $TSFixMe) {
  await sessionPublicationService.publishSession({
    sessionId,
    certificationRepository,
    finalizedSessionRepository,
    sessionRepository,
    publishedAt,
  });

  return sessionRepository.get(sessionId);
};
