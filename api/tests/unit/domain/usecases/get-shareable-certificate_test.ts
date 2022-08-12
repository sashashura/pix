// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getCertificationByVerificationCode = require('../../../../lib/domain/usecases/certificate/get-shareable-certificate');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-shareable-certificate', function () {
  const shareableCertificateRepository = {
    getByVerificationCode: () => undefined,
  };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    shareableCertificateRepository.getByVerificationCode = sinon.stub();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return certification from verification code enhanced with resultCompetenceTree', async function () {
    // given
    const resultCompetenceTree = domainBuilder.buildResultCompetenceTree();
    const shareableCertificate = domainBuilder.buildShareableCertificate({
      id: 1,
      verificationCode: 'P-123456CC',
      resultCompetenceTree,
    });
    const locale = 'fr';
    (shareableCertificateRepository.getByVerificationCode as $TSFixMe).withArgs('P-123456CC', { locale })
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
