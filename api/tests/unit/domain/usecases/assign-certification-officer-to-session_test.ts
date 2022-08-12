// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const assignCertificationOfficerToJurySession = require('../../../../lib/domain/usecases/assign-certification-officer-to-jury-session');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | assign-certification-officer-to-session', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return the session id after assigningUser to it', async function () {
    // given
    const returnedSessionId = Symbol('returnedSessionId');
    const sessionId = 1;
    const certificationOfficerId = 2;

    const jurySessionRepository = {
      assignCertificationOfficer: sinon.stub(),
    };
    jurySessionRepository.assignCertificationOfficer.resolves(returnedSessionId);

    const finalizedSessionRepository = {
      get: sinon.stub(),
      save: sinon.stub(),
    };

    const finalizedSession = domainBuilder.buildFinalizedSession();

    finalizedSessionRepository.get.withArgs({ sessionId }).resolves(finalizedSession);

    const certificationOfficerRepository = { get: sinon.stub() };
    const certificationOfficer = domainBuilder.buildCertificationOfficer();
    certificationOfficerRepository.get.withArgs(2).resolves(certificationOfficer);

    // when
    const actualSessionId = await assignCertificationOfficerToJurySession({
      sessionId,
      certificationOfficerId,
      jurySessionRepository,
      finalizedSessionRepository,
      certificationOfficerRepository,
    });

    // then
    expect(jurySessionRepository.assignCertificationOfficer).to.have.been.calledWith({
      id: finalizedSession.sessionId,
      assignedCertificationOfficerId: certificationOfficer.id,
    });
    expect(finalizedSessionRepository.save).to.have.been.calledWith(finalizedSession);
    expect(actualSessionId).to.equal(returnedSessionId);
  });
});
