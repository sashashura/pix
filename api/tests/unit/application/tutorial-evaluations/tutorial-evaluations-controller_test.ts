// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, hFake } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tutorialEv... Remove this comment to see the full error message
const tutorialEvaluationsController = require('../../../../lib/application/tutorial-evaluations/tutorial-evaluations-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TutorialEv... Remove this comment to see the full error message
const TutorialEvaluation = require('../../../../lib/domain/models/TutorialEvaluation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tutorialEv... Remove this comment to see the full error message
const tutorialEvaluationSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/tutorial-evaluation-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | Tutorial-evaluations', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#evaluate', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call the expected usecase', async function () {
      // given
      const tutorialId = 'tutorialId';
      const userId = 'userId';
      const status = TutorialEvaluation.statuses.LIKED;
      sinon.stub(tutorialEvaluationSerializer, 'deserialize').returns({
        status,
      });
      sinon.stub(usecases, 'addTutorialEvaluation').returns({
        id: 'tutorialEvaluationId',
      });

      const request = {
        auth: { credentials: { userId } },
        params: { tutorialId },
        payload: {
          data: {
            attributes: {
              status,
            },
          },
        },
      };

      // when
      await tutorialEvaluationsController.evaluate(request, hFake);

      // then
      const addTutorialEvaluationArgs = usecases.addTutorialEvaluation.firstCall.args[0];
      expect(addTutorialEvaluationArgs).to.have.property('userId', userId);
      expect(addTutorialEvaluationArgs).to.have.property('tutorialId', tutorialId);
      expect(addTutorialEvaluationArgs).to.have.property('status', status);
    });
  });
});
