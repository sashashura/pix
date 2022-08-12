// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ChallengeN... Remove this comment to see the full error message
const ChallengeNeutralized = require('../events/ChallengeNeutralized');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function neutralizeChallenge({
  certificationAssessmentRepository,
  certificationCourseId,
  challengeRecId,
  juryId
}: $TSFixMe) {
  const certificationAssessment = await certificationAssessmentRepository.getByCertificationCourseId({
    certificationCourseId,
  });
  certificationAssessment.neutralizeChallengeByRecId(challengeRecId);
  await certificationAssessmentRepository.save(certificationAssessment);
  return new ChallengeNeutralized({ certificationCourseId, juryId });
};
