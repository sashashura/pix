// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const addTutorialToUser = require('../../../../lib/domain/usecases/add-tutorial-to-user');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | add-tutorial-to-user', function () {
  let tutorialRepository;
  let userTutorialRepository: $TSFixMe;
  let skillRepository;
  let userId: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    userTutorialRepository = { addTutorial: sinon.spy() };
    userId = 'userId';
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the tutorial exists', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when skillId is not given', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call the userTutorialRepository', async function () {
        // Given
        tutorialRepository = { get: domainBuilder.buildTutorial };
        skillRepository = { get: sinon.stub() };
        const skillId = null;
        const tutorialId = 'tutorialId';

        // When
        await addTutorialToUser({
          tutorialRepository,
          userTutorialRepository,
          skillRepository,
          userId,
          tutorialId,
          skillId,
        });

        // Then
        expect(userTutorialRepository.addTutorial).to.have.been.calledWith({ userId, tutorialId, skillId });
        expect(skillRepository.get).not.to.have.been.called;
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when skillId is given', function () {
      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('when skill exists', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should call the userTutorialRepository', async function () {
          // Given
          tutorialRepository = { get: domainBuilder.buildTutorial };
          skillRepository = { get: sinon.stub().resolves({}) };
          const skillId = 'skillId';
          const tutorialId = 'tutorialId';

          // When
          await addTutorialToUser({
            tutorialRepository,
            userTutorialRepository,
            skillRepository,
            userId,
            tutorialId,
            skillId,
          });

          // Then
          expect(userTutorialRepository.addTutorial).to.have.been.calledWith({ userId, tutorialId, skillId });
          expect(skillRepository.get).to.have.been.calledWith(skillId);
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('when skill does not exist', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw a Domain error', async function () {
          // Given
          tutorialRepository = { get: domainBuilder.buildTutorial };
          // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
          skillRepository = { get: sinon.stub().rejects(new NotFoundError()) };
          const skillId = 'skillIdNotFound';
          const tutorialId = 'tutorialId';

          // When
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(addTutorialToUser)({
            tutorialRepository,
            userTutorialRepository,
            skillRepository,
            userId,
            tutorialId,
            skillId,
          });

          // Then
          expect(error).to.be.instanceOf(NotFoundError);
          expect(skillRepository.get).to.have.been.calledWith(skillId);
        });
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context("when the tutorial doesn't exist", function () {
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
      const error = await catchErr(addTutorialToUser)({
        tutorialRepository,
        userTutorialRepository,
        userId,
        tutorialId,
      });

      // Then
      expect(userTutorialRepository.addTutorial).to.not.have.been.called;
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });
});
