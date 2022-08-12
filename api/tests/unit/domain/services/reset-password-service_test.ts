// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'jsonwebtok... Remove this comment to see the full error message
const jsonwebtoken = require('jsonwebtoken');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'crypto'.
const crypto = require('crypto');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../../../lib/config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'resetPassw... Remove this comment to see the full error message
const resetPasswordService = require('../../../../lib/domain/services/reset-password-service');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const resetPasswordRepository = require('../../../../lib/infrastructure/repositories/reset-password-demands-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Service | Password Service', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#generateTemporaryKey', function () {
    let randomGeneratedString: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(jsonwebtoken, 'sign');
      randomGeneratedString = 'aaaaaa';
      sinon.stub(crypto, 'randomBytes').returns(randomGeneratedString);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call sign function from jwt', function () {
      // given
      const signParams = {
        payload: { data: randomGeneratedString },
        secret: settings.temporaryKey.secret,
        expiration: { expiresIn: settings.temporaryKey.tokenLifespan },
      };

      // when
      resetPasswordService.generateTemporaryKey();

      // then
      sinon.assert.calledOnce(jsonwebtoken.sign);
      sinon.assert.calledWith(jsonwebtoken.sign, signParams.payload, signParams.secret, signParams.expiration);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#invalidateOldResetPasswordDemand', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(resetPasswordRepository, 'markAsBeingUsed');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call reset password repository', function () {
      // given
      const userEmail = 'shi@fu.me';
      resetPasswordRepository.markAsBeingUsed.resolves();

      // when
      const promise = resetPasswordService.invalidateOldResetPasswordDemand(userEmail);

      // then
      return promise.then(() => {
        sinon.assert.calledOnce(resetPasswordRepository.markAsBeingUsed);
        sinon.assert.calledWith(resetPasswordRepository.markAsBeingUsed, userEmail);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#hasUserAPasswordResetDemandInProgress', function () {
    const userEmail = 'shi@fu.me';

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(resetPasswordRepository, 'findByUserEmail').throws();

      resetPasswordRepository.findByUserEmail.withArgs(userEmail, 'good-temporary-key').resolves();

      resetPasswordRepository.findByUserEmail.withArgs(userEmail, 'bad-temporary-key').rejects();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a matching password reset demand', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('resolves', async function () {
        await resetPasswordService.hasUserAPasswordResetDemandInProgress(userEmail, 'good-temporary-key');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is no matching password reset demand', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('resolves', function () {
        const promise = resetPasswordService.hasUserAPasswordResetDemandInProgress(userEmail, 'bad-temporary-key');
        return expect(promise).to.be.rejected;
      });
    });
  });
});
