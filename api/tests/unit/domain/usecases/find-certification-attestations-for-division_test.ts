// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findCertificationAttestationsForDivision = require('../../../../lib/domain/usecases/certificate/find-certification-attestations-for-division');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NoCertific... Remove this comment to see the full error message
const { NoCertificationAttestationForDivisionError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | find-certification-attestations-for-division', function () {
  const certificationAttestationRepository = {
    findByDivisionForScoIsManagingStudentsOrganization: () => undefined,
  };

  const dependencies = {
    certificationAttestationRepository,
  };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    certificationAttestationRepository.findByDivisionForScoIsManagingStudentsOrganization = sinon.stub();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return multiple certification attestations enhanced with result competence tree', async function () {
    // given
    const resultCompetenceTree1 = domainBuilder.buildResultCompetenceTree({ id: 'firstResultTreeId' });
    const resultCompetenceTree2 = domainBuilder.buildResultCompetenceTree({ id: 'secondResultTreeId' });

    const certificationAttestation1 = domainBuilder.buildCertificationAttestation({
      id: 123,
      userId: 123,
      certificationCenter: 'Lycée Tardis',
      resultCompetenceTree: resultCompetenceTree1,
    });

    const certificationAttestation2 = domainBuilder.buildCertificationAttestation({
      id: 456,
      userId: 456,
      certificationCenter: 'Lycée Tardis',
      resultCompetenceTree: resultCompetenceTree2,
    });

    (certificationAttestationRepository.findByDivisionForScoIsManagingStudentsOrganization as $TSFixMe).withArgs({ organizationId: 1234, division: '3b' })
    .resolves([certificationAttestation1, certificationAttestation2]);

    // when
    const actualCertificationAttestations = await findCertificationAttestationsForDivision({
      organizationId: 1234,
      division: '3b',
      ...dependencies,
    });

    // then
    const expectedCertificationAttestations = [
      domainBuilder.buildCertificationAttestation({
        id: certificationAttestation1.id,
        userId: certificationAttestation1.userId,
        certificationCenter: 'Lycée Tardis',
        resultCompetenceTree: resultCompetenceTree1,
      }),
      domainBuilder.buildCertificationAttestation({
        id: certificationAttestation2.id,
        userId: certificationAttestation2.userId,
        certificationCenter: 'Lycée Tardis',
        resultCompetenceTree: resultCompetenceTree2,
      }),
    ];

    expect(actualCertificationAttestations).to.deep.equal(expectedCertificationAttestations);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when there is no attestation', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a NoCertificationAttestationForDivisionError', async function () {
      // given
(certificationAttestationRepository.findByDivisionForScoIsManagingStudentsOrganization as $TSFixMe).withArgs({ organizationId: 1234, division: '3b' })
    .resolves([]);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(findCertificationAttestationsForDivision)({
        organizationId: 1234,
        division: '3b',
        ...dependencies,
      });

      // then
      expect(error).to.be.an.instanceOf(NoCertificationAttestationForDivisionError);
    });
  });
});
