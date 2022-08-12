// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getChallengeForPixAutoAnswer({
  assessmentId,
  assessmentRepository,
  challengeForPixAutoAnswerRepository
}: $TSFixMe) {
  const assessment = await assessmentRepository.get(assessmentId);
  if (!assessment) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError(`Assessment not found for ID ${assessmentId}`);
  }

  const lastChallengeId = assessment.lastChallengeId;
  return challengeForPixAutoAnswerRepository.get(lastChallengeId);
};
