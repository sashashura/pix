// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCandidateRepository = require('../../../../lib/infrastructure/repositories/certification-candidate-repository');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getSessionCertificationCandidates = require('../../../../lib/domain/usecases/get-session-certification-candidates');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Use Cases | get-session-certification-candidates', function () {
  const sessionId = 'sessionId';
  const certificationCandidates = 'candidates';

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    // given
    sinon
      .stub(certificationCandidateRepository, 'findBySessionId')
      .withArgs(sessionId)
      .resolves(certificationCandidates);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return the certification candidates', async function () {
    // when
    const actualCandidates = await getSessionCertificationCandidates({ sessionId, certificationCandidateRepository });

    // then
    expect(actualCandidates).to.equal(certificationCandidates);
  });
});
