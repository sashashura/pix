// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainBuil... Remove this comment to see the full error message
const { domainBuilder, expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const authorizeCertificationCandidateToResume = require('../../../../lib/domain/usecases/authorize-certification-candidate-to-resume');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Use Cases | authorize-certification-candidate-to-resume', function () {
  let certificationCandidateForSupervisingRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    certificationCandidateForSupervisingRepository = { get: sinon.stub(), update: sinon.stub() };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should authorize the candidate to resume test', async function () {
    // given
    const candidateToUpdate = domainBuilder.buildCertificationCandidateForSupervising({
      authorizedToStart: false,
    });

    certificationCandidateForSupervisingRepository.get.resolves(candidateToUpdate);

    // when
    await authorizeCertificationCandidateToResume({
      certificationCandidateId: 1234,
      certificationCandidateForSupervisingRepository,
    });

    // then
    expect(certificationCandidateForSupervisingRepository.update).to.have.been.calledWith(
      domainBuilder.buildCertificationCandidateForSupervising({
        authorizedToStart: true,
      })
    );
  });
});
