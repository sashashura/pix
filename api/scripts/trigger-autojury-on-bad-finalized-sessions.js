const { knex } = require('../db/knex-database-connection');
const bluebird = require('bluebird');
const handleAutoJury = require('../lib/domain/events/handle-auto-jury');
const certificationIssueReportRepository = require('../lib/infrastructure/repositories/certification-issue-report-repository');
const certificationAssessmentRepository = require('../lib/infrastructure/repositories/certification-assessment-repository');
const certificationCourseRepository = require('../lib/infrastructure/repositories/certification-course-repository');
const challengeRepository = require('../lib/infrastructure/repositories/challenge-repository');
const logger = require('../lib/infrastructure/logger');
const SessionFinalized = require('../lib/domain/events/SessionFinalized');
const { eventDispatcher } = require('../lib/domain/events');

const _triggerAutoJury = async (event) => {
  return await handleAutoJury({
    event,
    certificationIssueReportRepository,
    certificationAssessmentRepository,
    certificationCourseRepository,
    challengeRepository,
    logger,
  });
};

async function _retrieveNotFullyFinalizedSessionsData() {
  return await knex('sessions')
    .select(
      'sessions.id',
      'sessions.certificationCenter',
      'sessions.finalizedAt',
      'sessions.date',
      'sessions.time',
      'sessions.examinerGlobalComment'
    )
    .leftJoin('finalized-sessions', 'finalized-sessions.sessionId', 'sessions.id')
    .where('sessions.finalizedAt', '>=', '2022-02-21 16:15')
    .where('sessions.finalizedAt', '<=', '2022-02-21 16:55')
    .whereNull('sessions.publishedAt')
    .whereNull('finalized-sessions.sessionId');
}

async function _triggerAutoJuryFromEvents(events) {
  console.error(`\nWork in progress (${events.length})...`);
  return await bluebird.map(
    events,
    async (event) => {
      try {
        const resultingEvents = await _triggerAutoJury(event);
        for (const resultingEvent of resultingEvents) {
          await eventDispatcher.dispatch(resultingEvent);
        }
        process.stderr.write('😻');
      } catch (err) {
        process.stderr.write('👹');
      }
    },
    { concurrency: 10 }
  );
}

function _sessionDataToEvent(sessionData) {
  return new SessionFinalized({
    sessionId: sessionData.id,
    finalizedAt: sessionData.finalizedAt,
    hasExaminerGlobalComment: Boolean(sessionData.examinerGlobalComment),
    sessionDate: sessionData.date,
    sessionTime: sessionData.time,
    certificationCenterName: sessionData.certificationCenter,
  });
}

async function main() {
  try {
    const sessionsData = await _retrieveNotFullyFinalizedSessionsData();
    // const finalizedSessionEvents = sessionsData.map(_sessionDataToEvent);

    console.log(sessionsData);
    // await _triggerAutoJuryFromEvents(finalizedSessionEvents);

    console.log('\n\nDone.');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
if (require.main === module) {
  main().then(
    () => process.exit(0),
    (err) => {
      console.error(err);
      process.exit(1);
    }
  );
}
