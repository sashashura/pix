// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'verifyCert... Remove this comment to see the full error message
const verifyCertificateCodeService = require('../../../../lib/domain/services/verify-certificate-code-service');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certifCourseRepository = require('../../../../lib/infrastructure/repositories/certification-course-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificateVerificationCodeGenerationTooManyTrials } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Service | VerifyCertificateCode', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#generateCertificateVerificationCode', function () {
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    _.times(100, () =>
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a certification code containing 8 digits/letters except 0, 1 and vowels', async function () {
        // given
        sinon.stub(certifCourseRepository, 'isVerificationCodeAvailable').resolves(true);

        // when
        const result = await verifyCertificateCodeService.generateCertificateVerificationCode();

        // then
        expect(result).to.match(/^P-[2346789BCDFGHJKMPQRTVWXY]{8}$/);
      })
    );

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when a code is not available', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should choose another code', async function () {
        // given
        let codeIndex = 0;
        const codes = ['P-FXRSTX', 'P-SXCXND'];
        const fakeGenerateCode = () => codes[codeIndex++];

        sinon
          .stub(certifCourseRepository, 'isVerificationCodeAvailable')
          .onCall(0)
          .resolves(false)
          .onCall(1)
          .resolves(true);

        // when
        const result = await verifyCertificateCodeService.generateCertificateVerificationCode(fakeGenerateCode);

        // then
        expect(result).to.equal('P-SXCXND');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw when trying too many times', async function () {
        // given
        sinon.stub(certifCourseRepository, 'isVerificationCodeAvailable').resolves(false);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(verifyCertificateCodeService.generateCertificateVerificationCode)();

        //then
        expect(error).to.be.instanceof(CertificateVerificationCodeGenerationTooManyTrials);
        expect(certifCourseRepository.isVerificationCodeAvailable).to.have.been.callCount(1000);
      });
    });
  });
});
