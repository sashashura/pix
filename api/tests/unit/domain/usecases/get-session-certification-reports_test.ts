// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationReportRepository = require('../../../../lib/infrastructure/repositories/certification-report-repository');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getSessionCertificationReports = require('../../../../lib/domain/usecases/get-session-certification-reports');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Use Cases | get-session-certification-reports', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return the certification reports', async function () {
    // given
    const sessionId = 'sessionId';
    const certificationReports = Symbol('some certification candidates');
    sinon.stub(certificationReportRepository, 'findBySessionId').withArgs(sessionId).resolves(certificationReports);

    // when
    const actualCandidates = await getSessionCertificationReports({ sessionId, certificationReportRepository });

    // then
    expect(actualCandidates).to.equal(certificationReports);
  });
});
