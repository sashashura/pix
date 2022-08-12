// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, HttpTestServer, generateValidRequestAuthorizationHeader } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'oidcContro... Remove this comment to see the full error message
const oidcController = require('../../../../../lib/application/authentication/oidc/oidc-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../../lib/application/authentication/oidc');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Application | Route | OidcRouter', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/oidc/redirect-logout-url', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      sinon.stub(oidcController, 'getRedirectLogoutUrl').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
      server = new HttpTestServer();
      server.setupAuthentication();
      await server.register(moduleUnderTest);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a response with HTTP status code 200', async function () {
      // given & when
      const { statusCode } = await server.requestObject({
        method: 'GET',
        url: '/api/oidc/redirect-logout-url?identity_provider=POLE_EMPLOI&logout_url_uuid=b45cb781-4e9a-49b6-8c7e-ff5f02e07720',
        headers: { authorization: generateValidRequestAuthorizationHeader() },
      });

      // then
      expect(statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when missing required parameters', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('all', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a response with HTTP status code 400', async function () {
          // given & when
          const { statusCode } = await server.requestObject({
            method: 'GET',
            url: '/api/oidc/redirect-logout-url',
            headers: { authorization: generateValidRequestAuthorizationHeader() },
          });

          // then
          expect(statusCode).to.equal(400);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('identity_provider', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a response with HTTP status code 400', async function () {
          // given & when
          const { statusCode } = await server.requestObject({
            method: 'GET',
            url: '/api/oidc/redirect-logout-url?logout_url_uuid=b45cb781-4e9a-49b6-8c7e-ff5f02e07720',
            headers: { authorization: generateValidRequestAuthorizationHeader() },
          });

          // then
          expect(statusCode).to.equal(400);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('logout_url_uuid', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a response with HTTP status code 400', async function () {
          // given & when
          const { statusCode } = await server.requestObject({
            method: 'GET',
            url: '/api/oidc/redirect-logout-url?identity_provider=POLE_EMPLOI',
            headers: { authorization: generateValidRequestAuthorizationHeader() },
          });

          // then
          expect(statusCode).to.equal(400);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when identity_provider parameter is not POLE_EMPLOI', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a response with HTTP status code 400', async function () {
        // given & when
        const { statusCode } = await server.requestObject({
          method: 'GET',
          url: '/api/oidc/redirect-logout-url?identity_provider=MY_IDP&logout_url_uuid=b45cb781-4e9a-49b6-8c7e-ff5f02e07720',
          headers: { authorization: generateValidRequestAuthorizationHeader() },
        });

        // then
        expect(statusCode).to.equal(400);
      });
    });
  });
});
