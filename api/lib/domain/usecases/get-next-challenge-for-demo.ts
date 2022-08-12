// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const { AssessmentEndedError } = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('../../infrastructure/utils/lodash-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../infrastructure/logger');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function getNextChallengeForDemo({
  assessment,
  answerRepository,
  challengeRepository,
  courseRepository
}: $TSFixMe) {
  const courseId = assessment.courseId;

  const logContext = {
    zone: 'usecase.getNextChallengeForDemo',
    type: 'usecase',
    assessmentId: assessment.id,
    courseId,
  };
  logger.trace(logContext, 'looking for next challenge in DEMO assessment');

  return Promise.all([courseRepository.get(courseId), answerRepository.findByAssessment(assessment.id)])
    .then(([course, answers]) => {
      logContext.courseId = course.id;
      logger.trace(logContext, 'found course, selecting challenge');
      return _selectNextChallengeId(course, answers);
    })
    .then((nextChallengeId) => {
      if (nextChallengeId) {
        (logContext as $TSFixMe).nextChallengeId = nextChallengeId;
        logger.trace(logContext, 'found next challenge');
        return nextChallengeId;
      }

      logger.trace(logContext, 'no next challenge. Assessment ended');
      throw new AssessmentEndedError();
    })
    .then(challengeRepository.get);
};

function _selectNextChallengeId(course: $TSFixMe, answers: $TSFixMe) {
  const courseChallengeIds = course.challenges;
  const answeredChallengeIds = _.map(answers, 'challengeId');

  return _(courseChallengeIds).difference(answeredChallengeIds).first();
}
