// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function addTutorialEvaluation({
  tutorialRepository,
  tutorialEvaluationRepository,
  userId,
  tutorialId,
  status
}: $TSFixMe = {}) {
  await tutorialRepository.get(tutorialId);

  return tutorialEvaluationRepository.createOrUpdate({ userId, tutorialId, status });
};
