// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const addTutorialEvaluation = require('../../../../lib/domain/usecases/add-tutorial-evaluation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TutorialEv... Remove this comment to see the full error message
const TutorialEvaluation = require('../../../../lib/domain/models/TutorialEvaluation');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | add-tutorial-evaluation', function () {
  let tutorialRepository;
  let tutorialEvaluationRepository: $TSFixMe;
  let userId: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    tutorialEvaluationRepository = { createOrUpdate: sinon.spy() };
    userId = 'userId';
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the tutorial exists', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call the userTutorialRepository', async function () {
      // Given
      tutorialRepository = {
        get: domainBuilder.buildTutorial,
      };
      const tutorialId = 'tutorialId';
      const status = TutorialEvaluation.statuses.LIKED;

      // When
      await addTutorialEvaluation({
        tutorialRepository,
        tutorialEvaluationRepository,
        userId,
        tutorialId,
        status,
      });

      // Then
      expect(tutorialEvaluationRepository.createOrUpdate).to.have.been.calledWith({ userId, tutorialId, status });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the tutorial doesnt exist', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a Domain error', async function () {
      // Given
      tutorialRepository = {
        get: async () => {
          // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
          throw new NotFoundError();
        },
      };
      const tutorialId = 'nonExistentTutorialId';

      // When
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(addTutorialEvaluation)({
        tutorialRepository,
        tutorialEvaluationRepository,
        userId,
        tutorialId,
      });

      // Then
      expect(tutorialEvaluationRepository.createOrUpdate).to.not.have.been.called;
      expect(result).to.be.instanceOf(NotFoundError);
    });
  });
});
