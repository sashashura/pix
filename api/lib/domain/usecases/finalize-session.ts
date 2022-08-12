// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionAlr... Remove this comment to see the full error message
const { SessionAlreadyFinalizedError } = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionFin... Remove this comment to see the full error message
const SessionFinalized = require('../events/SessionFinalized');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function finalizeSession({
  sessionId,
  examinerGlobalComment,
  certificationReports,
  sessionRepository,
  certificationReportRepository,
  hasIncident,
  hasJoiningIssue
}: $TSFixMe) {
  const isSessionAlreadyFinalized = await sessionRepository.isFinalized(sessionId);

  if (isSessionAlreadyFinalized) {
    throw new SessionAlreadyFinalizedError('Cannot finalize session more than once');
  }

  certificationReports.forEach((certifReport: $TSFixMe) => certifReport.validateForFinalization());

  await certificationReportRepository.finalizeAll(certificationReports);

  const finalizedSession = await sessionRepository.finalize({
    id: sessionId,
    examinerGlobalComment,
    finalizedAt: new Date(),
    hasIncident,
    hasJoiningIssue,
  });

  return new SessionFinalized({
    sessionId,
    finalizedAt: finalizedSession.finalizedAt,
    hasExaminerGlobalComment: Boolean(examinerGlobalComment),
    certificationCenterName: finalizedSession.certificationCenter,
    sessionDate: finalizedSession.date,
    sessionTime: finalizedSession.time,
  });
};
