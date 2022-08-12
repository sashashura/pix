// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'scorecardC... Remove this comment to see the full error message
const scorecardController = require('../../../../lib/application/scorecards/scorecard-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/scorecards');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Router | scorecard-router', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/scorecards/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exist', async function () {
      // given
      sinon.stub(scorecardController, 'getScorecard').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const options = {
        method: 'GET',
        url: '/api/scorecards/foo',
      };

      // when
      const response = await httpTestServer.request(options.method, options.url);

      // then
      expect(response.statusCode).to.equal(200);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/scorecards/{id}/tutorials', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exist', async function () {
      // given
      sinon.stub(scorecardController, 'findTutorials').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const options = {
        method: 'GET',
        url: '/api/scorecards/foo/tutorials',
      };

      // when
      const response = await httpTestServer.request(options.method, options.url);

      // then
      expect(response.statusCode).to.equal(200);
    });
  });
});
