// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tutorialEv... Remove this comment to see the full error message
const tutorialEvaluationsController = require('../../../../lib/application/tutorial-evaluations/tutorial-evaluations-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/tutorial-evaluations');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TutorialEv... Remove this comment to see the full error message
const TutorialEvaluation = require('../../../../lib/domain/models/TutorialEvaluation');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Router | tutorial-evaluations-router', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PUT /api/users/tutorials/{tutorialId}/evaluate', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exist', async function () {
      // given
      sinon.stub(tutorialEvaluationsController, 'evaluate').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(201));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const method = 'PUT';
      const url = '/api/users/tutorials/{tutorialId}/evaluate';
      const payload = { data: { attributes: { status: TutorialEvaluation.statuses.LIKED } } };

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(tutorialEvaluationsController.evaluate).have.been.called;
      expect(response.statusCode).to.equal(201);
    });
  });
});
