// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AutoJuryDo... Remove this comment to see the full error message
const AutoJuryDone = require('../../lib/domain/events/AutoJuryDone');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'eventDispa... Remove this comment to see the full error message
const { eventDispatcher } = require('../../lib/domain/events');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../lib/infrastructure/logger');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  try {
    logger.info('Début');
    const sessionsData = await _retrieveFinalizedUnpublishedUnassignedSessionsData();
    const autoJuryDoneEvents = _buildAutoJuryDoneEventsFromSessionsData(sessionsData);
    await _dispatch(autoJuryDoneEvents);
    logger.info('Fin');
  } catch (error) {
    logger.error(error);
    // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
    process.exit(1);
  }
}

async function _retrieveFinalizedUnpublishedUnassignedSessionsData() {
  logger.info('\tRécupération des sessions finalisées non publiées non assignées...');
  const sessionsData = await knex('sessions')
    .select(
      'sessions.id',
      'sessions.finalizedAt',
      'sessions.certificationCenter',
      'sessions.date',
      'sessions.time',
      'sessions.examinerGlobalComment'
    )
    .join('finalized-sessions', 'finalized-sessions.sessionId', 'sessions.id')
    .where('isPublishable', 'false')
    .whereNull('sessions.publishedAt')
    .whereNull('sessions.assignedCertificationOfficerId');
  logger.info(`\tOK. ${sessionsData.length} récupérées`);
  return sessionsData;
}

function _buildAutoJuryDoneEventsFromSessionsData(sessionsData: $TSFixMe) {
  logger.info('\tConversion des données en event...');
  const events = sessionsData.map((sessionData: $TSFixMe) => {
    return new AutoJuryDone({
      sessionId: sessionData.id,
      finalizedAt: sessionData.finalizedAt,
      hasExaminerGlobalComment: Boolean(sessionData.examinerGlobalComment),
      sessionDate: sessionData.date,
      sessionTime: sessionData.time,
      certificationCenterName: sessionData.certificationCenter,
    });
  });
  logger.info('\tOK.');
  return events;
}

async function _dispatch(events: $TSFixMe) {
  logger.info('\tDispatch des events...');
  await bluebird.map(
    events,
    async (event: $TSFixMe) => {
      try {
        await eventDispatcher.dispatch(event);
      } catch (err) {
        logger.info(`\t\tErreur sur event : ${event}\n\t\t${err}`);
      }
    },
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    { concurrency: ~~process.env.CONCURRENCY || 5 }
  );
  logger.info('\tOK.');
}

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
if (require.main === module) {
  main().then(
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    () => process.exit(0),
    (err) => {
      logger.error(err);
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.exit(1);
    }
  );
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = main;
