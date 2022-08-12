// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainBuil... Remove this comment to see the full error message
const { domainBuilder, expect, sinon, HttpTestServer } = require('../../../test-helper');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ForbiddenA... Remove this comment to see the full error message
  ForbiddenAccess,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidTem... Remove this comment to see the full error message
  InvalidTemporaryKeyError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PasswordRe... Remove this comment to see the full error message
  PasswordResetDemandNotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
  UserNotFoundError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/passwords');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Application | Passwords | password-controller', function () {
  let httpTestServer: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    sinon.stub(usecases, 'createPasswordResetDemand');
    sinon.stub(usecases, 'getUserByResetPasswordDemand');
    sinon.stub(usecases, 'updateExpiredPassword');

    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createResetDemand', function () {
    const email = 'user@example.net';
    const temporaryKey = 'ABCDEF123';

    const method = 'POST';
    const url = '/api/password-reset-demands';
    const headers = {
      'accept-language': 'fr',
    };
    const payload = {
      data: {
        type: 'password-reset-demands',
        attributes: { email },
      },
    };

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP response with status code 201', async function () {
        // given
        const resetPasswordDemand = {
          attributes: {
            id: 1,
            email,
            temporaryKey,
          },
        };
        const expectedResult = {
          data: {
            id: '1',
            type: 'password-reset-demands',
            attributes: { email },
          },
        };
        usecases.createPasswordResetDemand.resolves(resetPasswordDemand);

        // when
        const response = await httpTestServer.request(method, url, payload, null, headers);

        // then
        expect(response.statusCode).to.equal(201);
        expect(response.result).to.deep.equal(expectedResult);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond an HTTP response with status code 404 when UserNotFoundError', async function () {
        // given
        usecases.createPasswordResetDemand.throws(new UserNotFoundError());

        // when
        const response = await httpTestServer.request(method, url, payload, null, headers);

        // then
        expect(response.statusCode).to.equal(404);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkResetDemand', function () {
    const method = 'GET';
    const url = '/api/password-reset-demands/ABCDEF123';

    const email = 'user@example.net';

    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const user = domainBuilder.buildUser({ email });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP response with status code 200', async function () {
        // given
        usecases.getUserByResetPasswordDemand.resolves(user);

        // when
        const response = await httpTestServer.request(method, url);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result.data.type).to.equal('users');
        expect(response.result.data.id).to.equal(user.id.toString());
        expect(response.result.data.attributes.email).to.equal(email);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond an HTTP response with status code 401 when InvalidTemporaryKeyError', async function () {
        // given
        usecases.getUserByResetPasswordDemand.rejects(new InvalidTemporaryKeyError());

        // when
        const response = await httpTestServer.request(method, url);

        // then
        expect(response.statusCode).to.equal(401);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond an HTTP response with status code 404 when PasswordResetDemandNotFoundError', async function () {
        // given
        usecases.getUserByResetPasswordDemand.rejects(new PasswordResetDemandNotFoundError());

        // when
        const response = await httpTestServer.request(method, url);

        // then
        expect(response.statusCode).to.equal(404);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond an HTTP response with status code 404 when UserNotFoundError', async function () {
        // given
        usecases.getUserByResetPasswordDemand.rejects(new UserNotFoundError());

        // when
        const response = await httpTestServer.request(method, url);

        // then
        expect(response.statusCode).to.equal(404);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateExpiredPassword', function () {
    const method = 'POST';
    const url = '/api/expired-password-updates';
    const payload = {
      data: {
        type: 'organization-invitations',
        attributes: {
          'password-reset-token': 'PASSWORD_RESET_TOKEN',
          'new-password': 'Password02',
        },
      },
    };

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP response with status code 201', async function () {
        // given
        usecases.updateExpiredPassword.resolves();

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(201);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond an HTTP response with status code 404 when UserNotFoundError', async function () {
        // given
        usecases.updateExpiredPassword.rejects(new UserNotFoundError());

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(404);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond an HTTP response with status code 403 when ForbiddenAccess', async function () {
        // given
        usecases.updateExpiredPassword.rejects(new ForbiddenAccess());

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(403);
      });
    });
  });
});
