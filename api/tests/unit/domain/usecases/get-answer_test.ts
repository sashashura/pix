// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getAnswer = require('../../../../lib/domain/usecases/get-answer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-answer', function () {
  const answerId = 1;
  const userId = 'userId';
  let answerRepository: $TSFixMe;
  let assessmentRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    const answer = {
      id: 1,
      assessmentId: 3,
    };
    const assessment = {
      id: 3,
      userId: userId,
    };

    answerRepository = {
      get: sinon.stub(),
    };

    assessmentRepository = {
      ownedByUser: sinon.stub(),
    };

    answerRepository.get.withArgs(answerId).resolves(answer);
    assessmentRepository.ownedByUser.withArgs({ id: answer.assessmentId, userId }).resolves(assessment);
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user asked for answer is the user of the assessment', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should get the answer', function () {
      // when
      const result = getAnswer({ answerId, userId, answerRepository, assessmentRepository });

      // then
      return result.then((resultAnswer: $TSFixMe) => {
        expect(resultAnswer.id).to.equal(answerId);
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user asked for answer is not the user of the assessment', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a Not Found error', function () {
      // when
      const result = getAnswer({ answerId, userId: userId + 1, answerRepository, assessmentRepository });

      // then
      return expect(result).to.be.rejectedWith(NotFoundError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the answer id provided is not an integer', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a Not Found error', function () {
      // when
      const result = getAnswer({ answerId: 'salut', userId: userId + 1, answerRepository, assessmentRepository });

      // then
      return expect(result).to.be.rejectedWith(NotFoundError);
    });
  });
});
