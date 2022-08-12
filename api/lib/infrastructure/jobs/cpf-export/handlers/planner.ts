// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'plannerJob... Remove this comment to see the full error message
const { plannerJob } = require('../../../../config').cpf;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'chunk'.
const chunk = require('lodash/chunk');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function planner({
  pgBoss,
  cpfCertificationResultRepository
}: $TSFixMe) {
  const startDate = moment()
    .utc()
    .subtract(plannerJob.minimumReliabilityPeriod + (plannerJob.monthsToProcess - 1), 'months')
    .startOf('month')
    .toDate();
  const endDate = moment().utc().subtract(plannerJob.minimumReliabilityPeriod, 'months').endOf('month').toDate();
  const cpfCertificationResults = await cpfCertificationResultRepository.findByTimeRange({ startDate, endDate });

  chunk(cpfCertificationResults, plannerJob.chunkSize).forEach((chunk: $TSFixMe) => {
    const firstId = chunk[0].id;
    const lastId = chunk[chunk.length - 1].id;

    pgBoss.send('CpfExportBuilderJob', { startId: firstId, endId: lastId });
  });
};
