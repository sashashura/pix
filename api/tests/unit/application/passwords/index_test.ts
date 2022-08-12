// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/passwords');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'passwordCo... Remove this comment to see the full error message
const passwordController = require('../../../../lib/application/passwords/password-controller');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Router | Password router', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/password-reset-demands', function () {
    const method = 'POST';
    const url = '/api/password-reset-demands';

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 http status code', async function () {
      // given
      sinon.stub(passwordController, 'createResetDemand').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const payload = {
        data: {
          attributes: {
            email: 'uzinagaz@example.net',
            'temporary-key': 'clé',
          },
          type: 'password-reset',
        },
      };

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When payload has a bad format or no email is provided', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 400 http status code', async function () {
        // given
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const payload = {
          data: {
            attributes: {},
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/password-reset-demands/{temporaryKey}', function () {
    const method = 'GET';
    const url = '/api/password-reset-demands/ABCDEF123';

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 201 http status code', async function () {
      // given
      sinon.stub(passwordController, 'checkResetDemand').resolves('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request(method, url);

      // then
      expect(response.statusCode).to.equal(200);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/expired-password-updates', function () {
    const method = 'POST';
    const url = '/api/expired-password-updates';

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 201 http status code', async function () {
      // given
      sinon.stub(passwordController, 'updateExpiredPassword').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().created());
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const payload = {
        data: {
          attributes: {
            'password-reset-token': 'PASSWORD_RESET_TOKEN',
            'new-password': 'Password123',
          },
        },
      };

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(201);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When the payload has the wrong format or no passwordResetToken or newPassword is provided.', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 400 http status code', async function () {
        // given
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const payload = {
          data: {
            attributes: {
              'password-reset-token': 'PASSWORD_RESET_TOKEN',
              newPassword: null,
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });
  });
});
