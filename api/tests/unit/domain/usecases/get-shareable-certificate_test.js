const { expect, sinon, domainBuilder } = require('../../../test-helper');
const getCertificationByVerificationCode = require('../../../../lib/domain/usecases/certificate/get-shareable-certificate');

describe('Unit | UseCase | get-shareable-certificate', function () {
  const shareableCertificateRepository = {
    getByVerificationCode: () => undefined,
  };

  beforeEach(function () {
    shareableCertificateRepository.getByVerificationCode = sinon.stub();
  });

  it('should return certification from verification code enhanced with resultCompetenceTree', async function () {
    // given
    const resultCompetenceTree = domainBuilder.buildResultCompetenceTree();
    const shareableCertificate = domainBuilder.buildShareableCertificate({
      id: 1,
      verificationCode: 'P-123456CC',
      resultCompetenceTree,
    });
    const locale = 'fr';
    shareableCertificateRepository.getByVerificationCode
      .withArgs('P-123456CC', { locale })
      .resolves(shareableCertificate);

    // when
    const finalShareableCertificate = await getCertificationByVerificationCode({
      verificationCode: 'P-123456CC',
      locale,
      shareableCertificateRepository,
    });

    // then
    const expectedShareableCertificate = domainBuilder.buildShareableCertificate({
      id: 1,
      verificationCode: 'P-123456CC',
      resultCompetenceTree,
    });
    expect(finalShareableCertificate).to.be.deep.equal(expectedShareableCertificate);
  });
});
