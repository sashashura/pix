// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getSessionResults({
  sessionId,
  sessionRepository,
  certificationResultRepository
}: $TSFixMe) {
  const session = await sessionRepository.get(sessionId);
  const certificationResults = await certificationResultRepository.findBySessionId({ sessionId });

  return { session, certificationResults };
};
