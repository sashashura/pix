const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'HttpTestSe... Remove this comment to see the full error message
  HttpTestServer,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
  sinon,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeaderForApplication,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'poleEmploi... Remove this comment to see the full error message
const poleEmploiController = require('../../../../lib/application/pole-emploi/pole-emploi-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/pole-emploi');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Router | pole-emploi-router', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/pole-emploi/envois', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 if the user is a pole emploi user', async function () {
      sinon.stub(poleEmploiController, 'getSendings').callsFake((_request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));

      const httpTestServer = new HttpTestServer();
      httpTestServer.setupAuthentication();
      await httpTestServer.register(moduleUnderTest);

      const POLE_EMPLOI_CLIENT_ID = 'poleEmploiClientId';
      const POLE_EMPLOI_SCOPE = 'pole-emploi-participants-result';
      const POLE_EMPLOI_SOURCE = 'poleEmploi';

      const method = 'GET';
      const url = '/api/pole-emploi/envois';
      const headers = {
        authorization: generateValidRequestAuthorizationHeaderForApplication(
          POLE_EMPLOI_CLIENT_ID,
          POLE_EMPLOI_SOURCE,
          POLE_EMPLOI_SCOPE
        ),
      };
      // when
      const response = await httpTestServer.request(method, url, null, null, headers);

      // then
      expect(response.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 401 if the user is a pole emploi user', async function () {
      const httpTestServer = new HttpTestServer();
      httpTestServer.setupAuthentication();
      await httpTestServer.register(moduleUnderTest);

      const method = 'GET';
      const url = '/api/pole-emploi/envois';
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      const headers = { authorization: generateValidRequestAuthorizationHeaderForApplication('') };
      // when
      const response = await httpTestServer.request(method, url, null, null, headers);

      // then
      expect(response.statusCode).to.equal(401);
    });
  });
});
