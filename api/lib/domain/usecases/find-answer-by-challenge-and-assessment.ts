// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function findAnswerByChallengeAndAssessment({
  challengeId,
  assessmentId,
  userId,
  answerRepository,
  assessmentRepository
}: $TSFixMe = {}) {
  const integerAssessmentId = parseInt(assessmentId);
  if (!Number.isFinite(integerAssessmentId)) {
    return null;
  }

  const ownedByUser = await assessmentRepository.ownedByUser({ id: assessmentId, userId });
  if (!ownedByUser) {
    return null;
  }

  return answerRepository.findByChallengeAndAssessment({ challengeId, assessmentId: integerAssessmentId });
};
