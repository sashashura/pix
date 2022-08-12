// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getPrivateCertificate = require('../../../../lib/domain/usecases/certificate/get-private-certificate');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | getPrivateCertificate', function () {
  const privateCertificateRepository = {
    get: () => undefined,
  };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    privateCertificateRepository.get = sinon.stub();
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the user is not owner of the certification', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if user is not the owner of the certificate', async function () {
      // given
      const privateCertificate = domainBuilder.buildPrivateCertificate({
        id: 123,
        userId: 789,
      });
      const locale = 'fr';
      (privateCertificateRepository.get as $TSFixMe).withArgs(123, { locale }).resolves(privateCertificate);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(getPrivateCertificate)({
        certificationId: 123,
        userId: 456,
        locale,
        privateCertificateRepository,
      });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the user is owner of the certification', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should get the private certificate', async function () {
      // given
      const privateCertificate = domainBuilder.buildPrivateCertificate({
        id: 123,
        userId: 456,
      });
      const locale = 'fr';
      (privateCertificateRepository.get as $TSFixMe).withArgs(123, { locale }).resolves(privateCertificate);

      // when
      const actualPrivateCertificate = await getPrivateCertificate({
        certificationId: 123,
        userId: 456,
        locale,
        privateCertificateRepository,
      });

      // then
      const expectedPrivateCertificate = domainBuilder.buildPrivateCertificate({
        id: 123,
        userId: 456,
      });
      expect(actualPrivateCertificate).to.deep.equal(expectedPrivateCertificate);
    });
  });
});
