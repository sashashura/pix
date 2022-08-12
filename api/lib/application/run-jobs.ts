// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config();
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'config'.
const config = require('../../lib/config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'JobQueue'.
const JobQueue = require('../infrastructure/jobs/JobQueue');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Participat... Remove this comment to see the full error message
const ParticipationResultCalculationJob = require('../infrastructure/jobs/campaign-result/ParticipationResultCalculationJob');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Participat... Remove this comment to see the full error message
const ParticipationResultCalculationJobHandler = require('../infrastructure/jobs/campaign-result/ParticipationResultCalculationJobHandler');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'dependenci... Remove this comment to see the full error message
const dependenciesBuilder = require('../infrastructure/events/DependenciesBuilder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PgBoss'.
const PgBoss = require('pg-boss');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const scheduleCpfJobs = require('../infrastructure/jobs/cpf-export/schedule-cpf-jobs');

async function runJobs() {
  const pgBoss = new PgBoss({
    // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
    // eslint-disable-next-line node/no-process-env
    connectionString: process.env.DATABASE_URL,
    max: config.pgBoss.connexionPoolMaxSize,
  });
  await pgBoss.start();
  const jobQueue = new JobQueue(pgBoss, dependenciesBuilder);

  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  process.on('SIGINT', async () => {
    await jobQueue.stop();
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    // eslint-disable-next-line node/no-process-exit,no-process-exit
    process.exit(0);
  });

  await jobQueue.performJob(ParticipationResultCalculationJob.name, ParticipationResultCalculationJobHandler);

  await scheduleCpfJobs(pgBoss);
}

runJobs();
