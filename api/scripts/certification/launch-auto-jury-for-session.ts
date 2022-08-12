'use strict';
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config();
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionFin... Remove this comment to see the full error message
const SessionFinalized = require('../../lib/domain/events/SessionFinalized');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationAssessmentRepository = require('../../lib/infrastructure/repositories/certification-assessment-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'challengeR... Remove this comment to see the full error message
const challengeRepository = require('../../lib/infrastructure/repositories/challenge-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationIssueReportRepository = require('../../lib/infrastructure/repositories/certification-issue-report-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCourseRepository = require('../../lib/infrastructure/repositories/certification-course-repository');
// @ts-expect-error TS(2687): All declarations of 'handleAutoJury' must have ide... Remove this comment to see the full error message
const handleAutoJury = require('../../lib/domain/events/handle-auto-jury');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'events'.
const events = require('../../lib/domain/events');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../lib/infrastructure/logger');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  const id = process.argv[2];
  logger.info(`Launch auto jury for session ${id}`);

  const { sessionId, finalizedAt, certificationCenterName, sessionDate, sessionTime, examinerGlobalComment } =
    await knex('sessions')
      .select(
        'id as sessionId',
        'certificationCenter as certificationCenterName',
        'finalizedAt',
        'date as sessionDate',
        'time as sessionTime',
        'examinerGlobalComment'
      )
      .where({ id })
      .first();

  const sessionFinalizedEvent = new SessionFinalized({
    sessionId,
    finalizedAt,
    certificationCenterName,
    sessionDate,
    sessionTime,
    hasExaminerGlobalComment: Boolean(examinerGlobalComment),
  });
  const event = await handleAutoJury({
    event: sessionFinalizedEvent,
    certificationIssueReportRepository,
    certificationAssessmentRepository,
    certificationCourseRepository,
    challengeRepository,
    logger,
  });
  await events.eventDispatcher.dispatch(event);

  logger.info('Done !');
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
