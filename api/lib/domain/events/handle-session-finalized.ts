// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FinalizedS... Remove this comment to see the full error message
const FinalizedSession = require('../models/FinalizedSession');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkEvent... Remove this comment to see the full error message
const { checkEventTypes } = require('./check-event-types');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AutoJuryDo... Remove this comment to see the full error message
const AutoJuryDone = require('./AutoJuryDone');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'eventTypes... Remove this comment to see the full error message
const eventTypes = [AutoJuryDone];

async function handleSessionFinalized({
  event,
  juryCertificationSummaryRepository,
  finalizedSessionRepository,
  supervisorAccessRepository
}: $TSFixMe) {
  checkEventTypes(event, eventTypes);
  const juryCertificationSummaries = await juryCertificationSummaryRepository.findBySessionId(event.sessionId);

  const hasSupervisorAccess = await supervisorAccessRepository.sessionHasSupervisorAccess({
    sessionId: event.sessionId,
  });

  const finalizedSession = FinalizedSession.from({
    sessionId: event.sessionId,
    finalizedAt: event.finalizedAt,
    certificationCenterName: event.certificationCenterName,
    sessionDate: event.sessionDate,
    sessionTime: event.sessionTime,
    hasExaminerGlobalComment: event.hasExaminerGlobalComment,
    hasSupervisorAccess,
    juryCertificationSummaries,
  });

  await finalizedSessionRepository.save(finalizedSession);
}

handleSessionFinalized.eventTypes = eventTypes;
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = handleSessionFinalized;
