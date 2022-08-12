// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findAnswerByChallengeAndAssessment = require('../../../../lib/domain/usecases/find-answer-by-challenge-and-assessment');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | find-answer-by-challenge-and-assessment', function () {
  const challengeId = 'recChallenge';
  const assessmentId = 123;
  const answerId = 'answerId';
  const userId = 'userId';
  let answerRepository: $TSFixMe, assessmentRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    const answer = {
      id: answerId,
      assessmentId,
      challengeId,
    };
    const assessment = {
      id: assessmentId,
      userId: userId,
    };

    answerRepository = {
      findByChallengeAndAssessment: sinon.stub(),
    };

    assessmentRepository = {
      ownedByUser: sinon.stub(),
    };

    answerRepository.findByChallengeAndAssessment.withArgs({ challengeId, assessmentId }).resolves(answer);
    assessmentRepository.ownedByUser.withArgs({ id: assessmentId, userId }).resolves(assessment);
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the assessmentid passed is not an integer', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should get the answer', async function () {
      // when
      const result = await findAnswerByChallengeAndAssessment({
        challengeId,
        assessmentId: 'salut',
        userId,
        answerRepository,
        assessmentRepository,
      });

      // then
      return expect(result).to.be.null;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user asked for answer is the user of the assessment', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should get the answer', async function () {
      // when
      const resultAnswer = await findAnswerByChallengeAndAssessment({
        challengeId,
        assessmentId,
        userId,
        answerRepository,
        assessmentRepository,
      });

      // then
      expect(resultAnswer.id).to.equal(answerId);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user asked for answer is not the user of the assessment', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null', async function () {
      // when
      const result = await findAnswerByChallengeAndAssessment({
        challengeId,
        assessmentId,
        userId: userId + 1,
        answerRepository,
        assessmentRepository,
      });

      // then
      return expect(result).to.be.null;
    });
  });
});
