// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userTutori... Remove this comment to see the full error message
const userTutorialsController = require('../../../../lib/application/user-tutorials/user-tutorials-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/user-tutorials');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Router | user-tutorials-router', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PUT /api/users/tutorials/{tutorialId}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exist', async function () {
      // given
      sinon.stub(userTutorialsController, 'add').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(204));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const method = 'PUT';
      const url = '/api/users/tutorials/{tutorialId}';

      // when
      const response = await httpTestServer.request(method, url);

      // then
      expect(userTutorialsController.add).have.been.called;
      expect(response.statusCode).to.equal(204);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('DELETE /api/users/tutorials/{tutorialId}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exist', async function () {
      // given
      sinon.stub(userTutorialsController, 'removeFromUser').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(204));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const method = 'DELETE';
      const url = '/api/users/tutorials/tutorialId';

      // when
      const response = await httpTestServer.request(method, url);

      // then
      expect(userTutorialsController.removeFromUser).have.been.called;
      expect(response.statusCode).to.equal(204);
    });
  });
});
