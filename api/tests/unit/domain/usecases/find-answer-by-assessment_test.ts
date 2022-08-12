// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findAnswerByAssessment = require('../../../../lib/domain/usecases/find-answer-by-assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError, EntityValidationError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | find-answer-by-challenge-and-assessment', function () {
  const assessmentId = 123;
  const userId = 'userId';
  let answerRepository: $TSFixMe, assessmentRepository: $TSFixMe, answers: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    answers = [
      {
        id: 1,
        assessmentId,
      },
      {
        id: 2,
        assessmentId,
      },
    ];
    const assessment = {
      id: assessmentId,
      userId: userId,
    };

    answerRepository = {
      findByAssessment: sinon.stub(),
    };

    assessmentRepository = {
      ownedByUser: sinon.stub(),
    };

    answerRepository.findByAssessment.withArgs(assessmentId).resolves(answers);
    assessmentRepository.ownedByUser.withArgs({ id: assessmentId, userId }).resolves(assessment);
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the assessmentid passed is not an integer', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(findAnswerByAssessment)({
        assessmentId: 'salut',
        userId,
        answerRepository,
        assessmentRepository,
      });

      // then
      expect(error).to.be.instanceOf(EntityValidationError);
      expect((error as $TSFixMe).invalidAttributes[0].attribute).to.equal('assessmentId');
      expect((error as $TSFixMe).invalidAttributes[0].message).to.equal('This assessment ID is not valid.');
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user asked for answer is the user of the assessment', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should get the answer', async function () {
      // when
      const resultAnswers = await findAnswerByAssessment({
        assessmentId,
        userId,
        answerRepository,
        assessmentRepository,
      });

      // then
      expect(resultAnswers).to.deep.equal(answers);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user asked for answer is not the user of the assessment', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return empty array', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(findAnswerByAssessment)({
        assessmentId,
        userId: userId + 1,
        answerRepository,
        assessmentRepository,
      });

      // then
      expect(result).to.be.instanceOf(UserNotAuthorizedToAccessEntityError);
    });
  });
});
