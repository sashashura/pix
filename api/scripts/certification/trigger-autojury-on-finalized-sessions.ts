// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2687): All declarations of 'handleAutoJury' must have ide... Remove this comment to see the full error message
const handleAutoJury = require('../../lib/domain/events/handle-auto-jury');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationIssueReportRepository = require('../../lib/infrastructure/repositories/certification-issue-report-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationAssessmentRepository = require('../../lib/infrastructure/repositories/certification-assessment-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCourseRepository = require('../../lib/infrastructure/repositories/certification-course-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'challengeR... Remove this comment to see the full error message
const challengeRepository = require('../../lib/infrastructure/repositories/challenge-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../lib/infrastructure/logger');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionFin... Remove this comment to see the full error message
const SessionFinalized = require('../../lib/domain/events/SessionFinalized');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'eventDispa... Remove this comment to see the full error message
const { eventDispatcher } = require('../../lib/domain/events');
// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
const IS_FROM_SCRATCH = process.env.IS_FROM_SCRATCH === 'true';
const AUDIT_TABLE = 'autojury-script-audit';

const _triggerAutoJury = async (event: $TSFixMe) => {
  return await handleAutoJury({
    event,
    certificationIssueReportRepository,
    certificationAssessmentRepository,
    certificationCourseRepository,
    challengeRepository,
    logger,
  });
};

// @ts-expect-error TS(2393): Duplicate function implementation.
async function _retrieveFinalizedUnpublishedUnassignedSessionsData() {
  return await knex('sessions')
    .select(
      'sessions.id',
      'sessions.certificationCenter',
      'sessions.finalizedAt',
      'sessions.date',
      'sessions.time',
      'sessions.examinerGlobalComment'
    )
    .join('finalized-sessions', 'finalized-sessions.sessionId', 'sessions.id')
    .where('isPublishable', '=', 'false')
    .whereNotNull('sessions.finalizedAt')
    .whereNull('sessions.publishedAt')
    .whereNull('sessions.assignedCertificationOfficerId');
}

async function _triggerAutoJuryFromEvents(events: $TSFixMe) {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.error(`\nWork in progress (${events.length})...`);
  return await bluebird.map(
    events,
    async (event: $TSFixMe) => {
      try {
        await _doing(event.sessionId);
        const resultingEvents = await _triggerAutoJury(event);
        for (const resultingEvent of resultingEvents) {
          await eventDispatcher.dispatch(resultingEvent);
        }
        await _done(event.sessionId);
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        process.stderr.write('😻');
      } catch (err) {
        await _toRetry(event.sessionId, err);
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        process.stderr.write('👹');
      }
    },
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    { concurrency: ~~process.env.CONCURRENCY || 10 }
  );
}

function _sessionDataToEvent(sessionData: $TSFixMe) {
  return new SessionFinalized({
    sessionId: sessionData.id,
    finalizedAt: sessionData.finalizedAt,
    hasExaminerGlobalComment: Boolean(sessionData.examinerGlobalComment),
    sessionDate: sessionData.date,
    sessionTime: sessionData.time,
    certificationCenterName: sessionData.certificationCenter,
  });
}

async function _writeEventsToAuditTable(events: $TSFixMe) {
  const dtos = events.map((event: $TSFixMe) => {
    return {
      ...event,
      status: 'TO DO',
    };
  });
  return await knex.batchInsert(AUDIT_TABLE, dtos);
}

async function _retrieveEventsFromAuditTable() {
  const dtos = await knex(AUDIT_TABLE)
    .select(
      'sessionId',
      'certificationCenterName',
      'finalizedAt',
      'sessionDate',
      'sessionTime',
      'hasExaminerGlobalComment'
    )
    .where('status', '!=', 'DONE');
  return dtos.map((dto: $TSFixMe) => new SessionFinalized(dto));
}

async function _printAudit() {
  const dtos = await knex(AUDIT_TABLE).select('sessionId', 'status', 'error');

  const todos = dtos.filter((dto: $TSFixMe) => dto.status === 'TO DO');
  const doings = dtos.filter((dto: $TSFixMe) => dto.status === 'DOING');
  const dones = dtos.filter((dto: $TSFixMe) => dto.status === 'DONE');
  const toRetrys = dtos.filter((dto: $TSFixMe) => dto.status === 'TO RETRY');

  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.error(`😴 TO DO (${todos.length})`);
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  todos.forEach((todo: $TSFixMe) => console.error(' ' + todo.sessionId));
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.error('\n\n');
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.error(`🤪 DOING (${doings.length})`);
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  doings.forEach((doing: $TSFixMe) => console.error(' ' + doing.sessionId));
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.error('\n\n');
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.error(`😻 DONE (${dones.length})`);
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  dones.forEach((done: $TSFixMe) => console.error(' ' + done.sessionId));
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.error('\n\n');
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.error(`👹 TO RETRY (${toRetrys.length})`);
  toRetrys.forEach((toRetry: $TSFixMe) => {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error(' ' + toRetry.sessionId);
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error(' ' + toRetry.error);
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  try {
    let finalizedSessionEvents;

    if (IS_FROM_SCRATCH) {
      await _emptyAuditTable();
      const sessionsData = await _retrieveFinalizedUnpublishedUnassignedSessionsData();
      finalizedSessionEvents = sessionsData.map(_sessionDataToEvent);
      await _writeEventsToAuditTable(finalizedSessionEvents);
    } else {
      finalizedSessionEvents = await _retrieveEventsFromAuditTable();
    }

    await _triggerAutoJuryFromEvents(finalizedSessionEvents);

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('\n\nDone.');
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('\n***** Results *****');
    await _printAudit();
  } catch (error) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error(error);
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    process.exit(1);
  }
}

async function _emptyAuditTable() {
  await knex(AUDIT_TABLE).delete();
}

async function _doing(sessionId: $TSFixMe) {
  await knex(AUDIT_TABLE).update({ error: '', status: 'DOING' }).where({ sessionId });
}

async function _done(sessionId: $TSFixMe) {
  await knex(AUDIT_TABLE).update({ status: 'DONE' }).where({ sessionId });
}

async function _toRetry(sessionId: $TSFixMe, error: $TSFixMe) {
  await knex(AUDIT_TABLE)
    .update({ status: 'TO RETRY', error: error.stack.toString().substring(0, 700) })
    .where({ sessionId });
}

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
if (require.main === module) {
  main().then(
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    () => process.exit(0),
    (err) => {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.error(err);
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.exit(1);
    }
  );
}
