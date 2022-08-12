// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getCertifi... Remove this comment to see the full error message
const getCertificationCandidate = require('../../../../lib/domain/usecases/get-certification-candidate');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Use Cases | get-certification-candidate', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should get the certification candidate', async function () {
    // given
    const userId = Symbol('userId');
    const sessionId = Symbol('sessionId');
    const expectedCertificationCandidate = Symbol('certifCandidate');
    const certificationCandidateRepository = {
      getBySessionIdAndUserId: sinon.stub(),
    };
    certificationCandidateRepository.getBySessionIdAndUserId
      .withArgs({ userId, sessionId })
      .resolves(expectedCertificationCandidate);

    // when
    const certificationCandidate = await getCertificationCandidate({
      userId,
      sessionId,
      certificationCandidateRepository,
    });

    // then
    expect(certificationCandidate).to.equal(expectedCertificationCandidate);
  });
});
