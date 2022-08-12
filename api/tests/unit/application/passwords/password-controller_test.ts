// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, hFake } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'passwordRe... Remove this comment to see the full error message
const passwordResetSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/password-reset-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userSerial... Remove this comment to see the full error message
const userSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/user-serializer');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'passwordCo... Remove this comment to see the full error message
const passwordController = require('../../../../lib/application/passwords/password-controller');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | PasswordController', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createResetDemand', function () {
    const email = 'user@example.net';
    const locale = 'fr';
    const temporaryKey = 'ABCDEF123';

    const request = {
      headers: {
        'accept-language': locale,
      },
      payload: {
        data: {
          attributes: { email },
        },
      },
    };

    const resetPasswordDemand = {
      attributes: {
        id: 1,
        email,
        temporaryKey,
      },
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'createPasswordResetDemand');
      sinon.stub(passwordResetSerializer, 'serialize');

      usecases.createPasswordResetDemand.resolves(resetPasswordDemand);
      passwordResetSerializer.serialize.returns();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reply with serialized password reset demand when all went well', async function () {
      // when
      const response = await passwordController.createResetDemand(request, hFake);

      // then
      expect(response.statusCode).to.equal(201);
      expect(usecases.createPasswordResetDemand).to.have.been.calledWith({
        email,
        locale,
      });
      expect(passwordResetSerializer.serialize).to.have.been.calledWith(resetPasswordDemand.attributes);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkResetDemand', function () {
    const email = 'user@example.net';
    const temporaryKey = 'ABCDEF123';

    const request = {
      params: { temporaryKey },
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'getUserByResetPasswordDemand');
      sinon.stub(userSerializer, 'serialize');

      usecases.getUserByResetPasswordDemand.resolves({ email });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return serialized user', async function () {
      // when
      await passwordController.checkResetDemand(request, hFake);

      // then
      expect(usecases.getUserByResetPasswordDemand).to.have.been.calledWith({ temporaryKey });
      expect(userSerializer.serialize).to.have.been.calledWith({ email });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateExpiredPassword', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 201 http status code', async function () {
      // given
      const request = {
        payload: {
          data: {
            attributes: {
              'password-reset-token': 'PASSWORD_RESET_TOKEN',
              'new-password': 'Password123',
            },
          },
        },
      };
      sinon.stub(usecases, 'updateExpiredPassword');
      usecases.updateExpiredPassword
        .withArgs({
          passwordResetToken: 'PASSWORD_RESET_TOKEN',
          newPassword: 'Password123',
        })
        .resolves('beth.rave1221');

      // when
      const response = await passwordController.updateExpiredPassword(request, hFake);

      // then
      expect(response.statusCode).to.equal(201);
      expect(response.source).to.deep.equal({
        data: {
          type: 'reset-expired-password-demands',
          attributes: {
            login: 'beth.rave1221',
          },
        },
      });
    });
  });
});
