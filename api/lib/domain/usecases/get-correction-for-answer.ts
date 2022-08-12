// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const { AssessmentNotCompletedError, NotFoundError } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getCorrectionForAnswer({
  assessmentRepository,
  answerRepository,
  correctionRepository,
  answerId,
  userId,
  locale
}: $TSFixMe = {}) {
  const integerAnswerId = parseInt(answerId);

  const answer = await answerRepository.get(integerAnswerId);
  const assessment = await assessmentRepository.get(answer.assessmentId);

  if (assessment.userId !== userId) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError(`Not found correction for answer of ID ${answerId}`);
  }

  _validateCorrectionIsAccessible(assessment);

  return correctionRepository.getByChallengeId({ challengeId: answer.challengeId, userId, locale });
};

function _validateCorrectionIsAccessible(assessment: $TSFixMe) {
  if (assessment.isForCampaign() || assessment.isCompetenceEvaluation()) {
    return;
  }

  if (!assessment.isCompleted()) {
    throw new AssessmentNotCompletedError();
  }
}
