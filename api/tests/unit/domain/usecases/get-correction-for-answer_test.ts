// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getCorrectionForAnswer = require('../../../../lib/domain/usecases/get-correction-for-answer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Answer'.
const Answer = require('../../../../lib/domain/models/Answer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const { AssessmentNotCompletedError, NotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | getCorrectionForAnswer', function () {
  const assessmentRepository = { get: () => undefined };
  const answerRepository = { get: () => undefined };
  const correctionRepository = { getByChallengeId: () => undefined };
  const assessmentId = 1;
  const answerId = 2;
  const challengeId = 12;
  const locale = 'lang-country';
  let answer;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(assessmentRepository, 'get');
    sinon.stub(answerRepository, 'get');
    sinon.stub(correctionRepository, 'getByChallengeId');

    answer = new Answer({ assessmentId, challengeId: 12 });
    (answerRepository.get as $TSFixMe).withArgs(answerId).resolves(answer);
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when assessment is not completed', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('and when the assessment is of type CERTIFICATION', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject with a assessment not completed error', async function () {
        // given
        const assessment = domainBuilder.buildAssessment({
          state: 'started',
          type: Assessment.types.CERTIFICATION,
        });
        (assessmentRepository.get as $TSFixMe).withArgs(assessmentId).resolves(assessment);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(getCorrectionForAnswer)({
          assessmentRepository,
          answerRepository,
          correctionRepository,
          answerId,
          userId: assessment.userId,
          locale,
        });

        // then
        expect(error).to.be.instanceOf(AssessmentNotCompletedError);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('and when the assessment is of type CAMPAIGN', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the content', async function () {
        // given
        const assessment = domainBuilder.buildAssessment({
          state: 'started',
          type: Assessment.types.CAMPAIGN,
        });
        (assessmentRepository.get as $TSFixMe).withArgs(assessmentId).resolves(assessment);

        const correction = Symbol('A correction');
        (correctionRepository.getByChallengeId as $TSFixMe).withArgs({ challengeId, userId: assessment.userId, locale })
    .resolves(correction);

        // when
        const responseSolution = await getCorrectionForAnswer({
          assessmentRepository,
          answerRepository,
          correctionRepository,
          answerId,
          userId: assessment.userId,
          locale,
        });

        // then
        expect(responseSolution).to.equal(correction);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('and when the assessment is COMPETENCE_EVALUATION', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the content', async function () {
        // given
        const assessment = domainBuilder.buildAssessment({
          state: 'started',
          type: Assessment.types.COMPETENCE_EVALUATION,
        });
        (assessmentRepository.get as $TSFixMe).withArgs(assessmentId).resolves(assessment);

        const correction = Symbol('A correction');
        (correctionRepository.getByChallengeId as $TSFixMe).withArgs({ challengeId, userId: assessment.userId, locale })
    .resolves(correction);

        // when
        const responseSolution = await getCorrectionForAnswer({
          assessmentRepository,
          answerRepository,
          correctionRepository,
          answerId,
          userId: assessment.userId,
          locale,
        });

        // then
        expect(responseSolution).to.equal(correction);
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when assessment is completed', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return with the correction', async function () {
      // given
      const assessment = domainBuilder.buildAssessment({ state: 'completed' });
      (assessmentRepository.get as $TSFixMe).withArgs(assessmentId).resolves(assessment);

      const correction = Symbol('A correction');
      (correctionRepository.getByChallengeId as $TSFixMe).withArgs({ challengeId, userId: assessment.userId, locale })
    .resolves(correction);

      // when
      const result = await getCorrectionForAnswer({
        assessmentRepository,
        answerRepository,
        correctionRepository,
        answerId,
        userId: assessment.userId,
        locale,
      });

      // then
      expect(result).to.equal(correction);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user ask for correction is not the user who answered the challenge', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a NotFound error', async function () {
      // given
      const assessment = domainBuilder.buildAssessment({ state: 'completed' });
      (assessmentRepository.get as $TSFixMe).withArgs(assessmentId).resolves(assessment);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(getCorrectionForAnswer)({
        assessmentRepository,
        answerRepository,
        correctionRepository,
        answerId,
        userId: 'wrong user id',
      });

      // then
      return expect(error).to.be.instanceOf(NotFoundError);
    });
  });
});
