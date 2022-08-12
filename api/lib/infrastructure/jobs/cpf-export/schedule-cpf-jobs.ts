// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const handlers = require('./');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'plannerJob... Remove this comment to see the full error message
const { plannerJob } = require('../../../config').cpf;

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function scheduleCpfJobs(pgBoss: $TSFixMe) {
  await pgBoss.schedule('CpfExportPlannerJob', plannerJob.cron, null, { tz: 'Europe/Paris' });

  await pgBoss.work('CpfExportPlannerJob', async (job: $TSFixMe) => {
    await _processJob(job, handlers.planner, { pgBoss });
  });

  // @ts-expect-error TS(7031): Binding element 'job' implicitly has an 'any' type... Remove this comment to see the full error message
  await pgBoss.work('CpfExportBuilderJob', { batchSize: 1 }, async ([job]) => {
    await _processJob(job, handlers.createAndUpload, { data: job.data });
  });
};

async function _processJob(job: $TSFixMe, handler: $TSFixMe, params: $TSFixMe) {
  try {
    await handler({ ...params });
    job.done();
  } catch (error) {
    job.done(error);
  }
}
