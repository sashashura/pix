// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'get'.
const get = require('../../../../lib/domain/usecases/certificate/get-certification-attestation');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-certification-attestation', function () {
  const certificationAttestationRepository = {
    get: () => undefined,
  };

  const dependencies = {
    certificationAttestationRepository,
  };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    certificationAttestationRepository.get = sinon.stub();
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the user is not owner of the certification attestation', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if user is not the owner of the certificationAttestation', async function () {
      // given
      const certificationAttestation = domainBuilder.buildCertificationAttestation({
        id: 123,
        userId: 456,
      });
      (certificationAttestationRepository.get as $TSFixMe).withArgs(123).resolves(certificationAttestation);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(get)({ certificationId: 123, userId: 789, ...dependencies });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the user is owner of the certification attestation', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the certification attestation enhanced with result competence tree', async function () {
      // given
      const resultCompetenceTree = domainBuilder.buildResultCompetenceTree({ id: 'myResultTreeId' });
      const certificationAttestation = domainBuilder.buildCertificationAttestation({
        id: 123,
        userId: 456,
        resultCompetenceTree,
      });
      (certificationAttestationRepository.get as $TSFixMe).withArgs(123).resolves(certificationAttestation);

      // when
      const actualCertificationAttestation = await get({ certificationId: 123, userId: 456, ...dependencies });

      // then
      const expectedCertificationAttestation = domainBuilder.buildCertificationAttestation({
        id: 123,
        userId: 456,
        resultCompetenceTree,
      });
      expect(actualCertificationAttestation).to.deep.equal(expectedCertificationAttestation);
    });
  });
});
