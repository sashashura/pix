// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getJurySession({
  sessionId,
  jurySessionRepository,
  supervisorAccessRepository
}: $TSFixMe) {
  const jurySession = await jurySessionRepository.get(sessionId);
  const hasSupervisorAccess = await supervisorAccessRepository.sessionHasSupervisorAccess({ sessionId });
  return {
    jurySession,
    hasSupervisorAccess,
  };
};
