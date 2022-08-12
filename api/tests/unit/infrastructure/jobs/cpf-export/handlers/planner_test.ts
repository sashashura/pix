// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainBuil... Remove this comment to see the full error message
const { domainBuilder, expect, sinon } = require('../../../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const planner = require('../../../../../../lib/infrastructure/jobs/cpf-export/handlers/planner');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'cpf'.
const { cpf } = require('../../../../../../lib/config');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | jobs | cpf-export | planner', function () {
  let cpfCertificationResultRepository: $TSFixMe;
  let pgBoss: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    cpfCertificationResultRepository = {
      findByTimeRange: sinon.stub(),
    };
    pgBoss = {
      send: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should send to CpfExportBuilderJob chunks of cpf certification results', async function () {
    // given
    sinon.stub(cpf.plannerJob, 'chunkSize').value(2);
    sinon.stub(cpf.plannerJob, 'monthsToProcess').value(2);
    sinon.stub(cpf.plannerJob, 'minimumReliabilityPeriod').value(2);

    const startDate = moment().utc().subtract(3, 'months').startOf('month').toDate();
    const endDate = moment().utc().subtract(2, 'months').endOf('month').toDate();

    const cpfCertificationResults = [
      domainBuilder.buildCpfCertificationResult({ id: 1 }),
      domainBuilder.buildCpfCertificationResult({ id: 2 }),
      domainBuilder.buildCpfCertificationResult({ id: 3 }),
      domainBuilder.buildCpfCertificationResult({ id: 4 }),
      domainBuilder.buildCpfCertificationResult({ id: 5 }),
    ];

    cpfCertificationResultRepository.findByTimeRange.resolves(cpfCertificationResults);

    // when
    await planner({ pgBoss, cpfCertificationResultRepository });

    // then
    expect(cpfCertificationResultRepository.findByTimeRange).to.have.been.calledWith({ startDate, endDate });
    expect(pgBoss.send.firstCall).to.have.been.calledWith('CpfExportBuilderJob', {
      startId: 1,
      endId: 2,
    });
    expect(pgBoss.send.secondCall).to.have.been.calledWith('CpfExportBuilderJob', {
      startId: 3,
      endId: 4,
    });
    expect(pgBoss.send.thirdCall).to.have.been.calledWith('CpfExportBuilderJob', {
      startId: 5,
      endId: 5,
    });
  });
});
