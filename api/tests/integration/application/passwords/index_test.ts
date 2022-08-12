// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, HttpTestServer } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/passwords');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'passwordCo... Remove this comment to see the full error message
const passwordController = require('../../../../lib/application/passwords/password-controller');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Application | Password | Routes', function () {
  let httpTestServer: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    sinon.stub(passwordController, 'checkResetDemand').resolves('ok');
    sinon.stub(passwordController, 'createResetDemand').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().created());
    sinon.stub(passwordController, 'updateExpiredPassword').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().created());

    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/password-reset-demands', function () {
    const method = 'POST';
    const url = '/api/password-reset-demands';
    const headers = {
      'accept-language': 'fr',
    };
    const payload = {
      data: {
        type: 'password-reset-demands',
        attributes: { email: 'user@example.net' },
      },
    };

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 201 http status code', async function () {
      // when
      const response = await httpTestServer.request(method, url, payload, null, headers);

      // then
      expect(response.statusCode).to.equal(201);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/password-reset-demands/{temporaryKey}', function () {
    const method = 'GET';
    const url = '/api/password-reset-demands/ABCDEF123';

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 http status code', async function () {
      // when
      const response = await httpTestServer.request(method, url);

      // then
      expect(response.statusCode).to.equal(200);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/expired-password-updates', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 201 http status code', async function () {
      // given
      const method = 'POST';
      const url = '/api/expired-password-updates';
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
  });
});
