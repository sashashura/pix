// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getSessionResults = require('../../../../lib/domain/usecases/get-session-results');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Use Cases | get-session-results', function () {
  const sessionRepository = { get: null };
  const certificationResultRepository = { findBySessionId: null };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sessionRepository.get = sinon.stub();
    certificationResultRepository.findBySessionId = sinon.stub();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return the session and the certificationResults', async function () {
    // given
    const expectedSession = domainBuilder.buildSession();
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    sessionRepository.get.withArgs(123).resolves(expectedSession);
    const certificationResult1 = domainBuilder.buildCertificationResult({ firstName: 'Buffy' });
    const certificationResult2 = domainBuilder.buildCertificationResult({ firstName: 'Spike' });
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    certificationResultRepository.findBySessionId
      .withArgs({ sessionId: 123 })
      .resolves([certificationResult1, certificationResult2]);

    // when
    const { session, certificationResults } = await getSessionResults({
      sessionId: 123,
      sessionRepository,
      certificationResultRepository,
    });

    // then
    expect(session).to.deepEqualInstance(expectedSession);
    expect(certificationResults).to.deepEqualArray([certificationResult1, certificationResult2]);
  });
});
