// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const updateLastQuestionState = require('../../../../lib/domain/usecases/update-last-question-state');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | update-last-question-state', function () {
  const assessmentId = 'assessmentId';
  const focusedChallengeId = 'focusedChallengeId';
  const notFocusedChallengeId = 'notFocusedChallengeId';
  let domainTransaction: $TSFixMe;
  let challengeRepository: $TSFixMe;
  let assessmentRepository: $TSFixMe;
  let lastQuestionState: $TSFixMe;
  let focusedChallenge: $TSFixMe;
  let notFocusedChallenge: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    domainTransaction = Symbol('domainTransaction');
    challengeRepository = {
      get: sinon.stub(),
    };
    assessmentRepository = {
      get: sinon.stub(),
      updateLastQuestionState: sinon.stub(),
    };

    focusedChallenge = domainBuilder.buildChallenge({
      id: focusedChallengeId,
      focused: true,
    });

    notFocusedChallenge = domainBuilder.buildChallenge({
      id: notFocusedChallengeId,
      focused: false,
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when lastQuestionState is ASKED', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      lastQuestionState = Assessment.statesOfLastQuestion.ASKED;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call assessmentRepository.updateLastQuestionState', async function () {
      // Given
      assessmentRepository.updateLastQuestionState
        .withArgs({ id: assessmentId, lastQuestionState, domainTransaction })
        .resolves();

      // When
      await updateLastQuestionState({
        assessmentId,
        lastQuestionState,
        challengeId: focusedChallengeId,
        domainTransaction,
        assessmentRepository,
        challengeRepository,
      });

      // Then
      sinon.assert.called(assessmentRepository.updateLastQuestionState);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when lastQuestionState is FOCUSEDOUT', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      lastQuestionState = Assessment.statesOfLastQuestion.FOCUSEDOUT;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return early when challengeId is not provided', async function () {
      // Given
      challengeRepository.get.withArgs(notFocusedChallengeId, domainTransaction).resolves(notFocusedChallenge);

      // When
      await updateLastQuestionState({
        assessmentId,
        lastQuestionState,
        challengeId: undefined,
        domainTransaction,
        assessmentRepository,
        challengeRepository,
      });

      // Then
      sinon.assert.notCalled(challengeRepository.get);
      sinon.assert.called(assessmentRepository.updateLastQuestionState);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should early return if challenge is not focused', async function () {
      // Given
      challengeRepository.get.withArgs(notFocusedChallengeId, domainTransaction).resolves(notFocusedChallenge);

      // When
      await updateLastQuestionState({
        assessmentId,
        lastQuestionState,
        challengeId: notFocusedChallengeId,
        domainTransaction,
        assessmentRepository,
        challengeRepository,
      });

      // Then
      sinon.assert.notCalled(assessmentRepository.updateLastQuestionState);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when challenge is focused', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return early if the provided challenge id differs from assessment.lastChallengeId in repository', async function () {
        // Given
        challengeRepository.get.withArgs(focusedChallengeId, domainTransaction).resolves(focusedChallenge);

        const assessment = domainBuilder.buildAssessment({
          id: assessmentId,
          lastChallengeId: notFocusedChallengeId,
          state: 'started',
        });
        assessmentRepository.get.withArgs(assessmentId, domainTransaction).resolves(assessment);

        // When
        await updateLastQuestionState({
          assessmentId,
          lastQuestionState,
          challengeId: focusedChallengeId,
          domainTransaction,
          assessmentRepository,
          challengeRepository,
        });

        // Then
        sinon.assert.notCalled(assessmentRepository.updateLastQuestionState);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call assessmentRepository.updateLastQuestionState when the challenge id equals assessment.lastChallengeId', async function () {
        // Given
        challengeRepository.get.withArgs(focusedChallengeId, domainTransaction).resolves(focusedChallenge);

        const assessment = domainBuilder.buildAssessment({
          id: assessmentId,
          lastChallengeId: focusedChallengeId,
          state: 'started',
        });
        assessmentRepository.get.withArgs(assessmentId, domainTransaction).resolves(assessment);

        assessmentRepository.updateLastQuestionState
          .withArgs({ id: assessmentId, lastQuestionState, domainTransaction })
          .resolves();

        // When
        await updateLastQuestionState({
          assessmentId,
          lastQuestionState,
          challengeId: focusedChallengeId,
          domainTransaction,
          assessmentRepository,
          challengeRepository,
        });

        // Then
        sinon.assert.called(assessmentRepository.updateLastQuestionState);
      });
    });
  });
});
