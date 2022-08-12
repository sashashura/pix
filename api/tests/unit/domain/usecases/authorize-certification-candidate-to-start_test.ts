// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const authorizeCertificationCandidateToStart = require('../../../../lib/domain/usecases/authorize-certification-candidate-to-start');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCandidateForSupervising = require('../../../../lib/domain/models/CertificationCandidateForSupervising');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Use Cases | authorize-certification-candidate-to-start', function () {
  let certificationCandidateForSupervisingRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    certificationCandidateForSupervisingRepository = { update: sinon.stub() };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return the updated certification candidate for supervising', async function () {
    // given
    const updatedCertificationCandidateForSupervising = new CertificationCandidateForSupervising({
      id: 1234,
      firstName: 'toto',
      lastName: 'tutu',
      birthdate: '2020-01-01',
      extraTimePercentage: 0.5,
      authorizedToStart: true,
    });

    // when
    await authorizeCertificationCandidateToStart({
      certificationCandidateForSupervisingId: 1234,
      authorizedToStart: true,
      certificationCandidateForSupervisingRepository,
    });

    // then
    expect(certificationCandidateForSupervisingRepository.update).to.have.been.calledWith({
      id: updatedCertificationCandidateForSupervising.id,
      authorizedToStart: updatedCertificationCandidateForSupervising.authorizedToStart,
    });
  });
});
