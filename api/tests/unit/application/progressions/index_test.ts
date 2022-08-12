// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/progressions');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'progressio... Remove this comment to see the full error message
const progressionController = require('../../../../lib/application/progressions/progression-controller');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Router | progression-router', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/progressions/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exist', async function () {
      // given
      sinon.stub(progressionController, 'get').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(200));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/progressions/1');

      // then
      expect(response.statusCode).to.equal(200);
    });
  });
});
