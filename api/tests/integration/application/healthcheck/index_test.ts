// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, HttpTestServer } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/healthcheck');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const healthCheckController = require('../../../../lib/application/healthcheck/healthcheck-controller');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Application | Route | healthcheckRouter', function () {
  let httpTestServer: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    sinon.stub(healthCheckController, 'get').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
    sinon.stub(healthCheckController, 'checkDbStatus').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
    sinon.stub(healthCheckController, 'checkRedisStatus').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
    sinon.stub(healthCheckController, 'crashTest').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exist', async function () {
      // given
      const method = 'GET';
      const url = '/api';

      // when
      const response = await httpTestServer.request(method, url);

      // then
      expect(response.statusCode).to.equal(200);
      expect(healthCheckController.get).to.have.been.calledOnce;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/healthcheck/db', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exist', async function () {
      // given
      const method = 'GET';
      const url = '/api/healthcheck/db';

      // when
      const response = await httpTestServer.request(method, url);

      // then
      expect(response.statusCode).to.equal(200);
      expect(healthCheckController.checkDbStatus).to.have.been.calledOnce;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/healthcheck/redis', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exist', async function () {
      // given
      const method = 'GET';
      const url = '/api/healthcheck/redis';

      // when
      const response = await httpTestServer.request(method, url);

      // then
      expect(response.statusCode).to.equal(200);
      expect(healthCheckController.checkRedisStatus).to.have.been.calledOnce;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/healthcheck/crash', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exist', async function () {
      // given
      const method = 'GET';
      const url = '/api/healthcheck/crash';

      // when
      const response = await httpTestServer.request(method, url);

      // then
      expect(response.statusCode).to.equal(200);
      expect(healthCheckController.crashTest).to.have.been.calledOnce;
    });
  });
});
