// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ChallengeD... Remove this comment to see the full error message
const ChallengeDeneutralized = require('../events/ChallengeDeneutralized');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function deneutralizeChallenge({
  certificationAssessmentRepository,
  certificationCourseId,
  challengeRecId,
  juryId
}: $TSFixMe) {
  const certificationAssessment = await certificationAssessmentRepository.getByCertificationCourseId({
    certificationCourseId,
  });
  certificationAssessment.deneutralizeChallengeByRecId(challengeRecId);
  await certificationAssessmentRepository.save(certificationAssessment);
  return new ChallengeDeneutralized({ certificationCourseId, juryId });
};
