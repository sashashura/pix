// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const { AssessmentEndedError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getNextChallengeForDemo = require('../../../../lib/domain/usecases/get-next-challenge-for-demo');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Use Cases | get-next-challenge-for-demo', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get-next-challenge-for-demo', function () {
    let courseRepository: $TSFixMe;
    let challengeRepository: $TSFixMe;
    let answerRepository: $TSFixMe;

    let assessment: $TSFixMe;
    let course;
    let firstChallenge: $TSFixMe;
    let secondChallenge: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      firstChallenge = domainBuilder.buildChallenge({ id: 'first_challenge' });
      secondChallenge = domainBuilder.buildChallenge({ id: 'second_challenge' });
      course = domainBuilder.buildCourse({ id: 18415, challenges: [firstChallenge.id, secondChallenge.id] });
      assessment = domainBuilder.buildAssessment({ id: 1165, courseId: course.id });

      courseRepository = { get: sinon.stub().resolves(course) };
      challengeRepository = { get: sinon.stub() };
      answerRepository = { findByAssessment: sinon.stub() };
      challengeRepository.get.withArgs('first_challenge').resolves(firstChallenge);
      challengeRepository.get.withArgs('second_challenge').resolves(secondChallenge);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the first challenge if no answer exist', async function () {
      // given
      answerRepository.findByAssessment.resolves([]);

      // when
      const result = await getNextChallengeForDemo({
        courseRepository,
        challengeRepository,
        answerRepository,
        assessment,
      });

      // then
      expect(result).to.equal(firstChallenge);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the second challenge if the first challenge is already answered', async function () {
      // given
      const firstAnswer = domainBuilder.buildAnswer({ challengeId: firstChallenge.id, assessmentId: assessment.id });
      answerRepository.findByAssessment.resolves([firstAnswer]);

      // when
      const result = await getNextChallengeForDemo({
        courseRepository,
        challengeRepository,
        answerRepository,
        assessment,
      });

      // then
      expect(result).to.equal(secondChallenge);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a AssessmentEndedError when there are no more challenges to ask', function () {
      // given
      const firstAnswer = domainBuilder.buildAnswer({ challengeId: firstChallenge.id, assessmentId: assessment.id });
      const secondAnswer = domainBuilder.buildAnswer({ challengeId: secondChallenge.id, assessmentId: assessment.id });
      answerRepository.findByAssessment.resolves([firstAnswer, secondAnswer]);

      // when
      const promise = getNextChallengeForDemo({ courseRepository, challengeRepository, answerRepository, assessment });

      // then
      return expect(promise).to.be.rejectedWith(AssessmentEndedError);
    });
  });
});
