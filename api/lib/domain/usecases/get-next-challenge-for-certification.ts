// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function getNextChallengeForCertification({
  certificationChallengeRepository,
  challengeRepository,
  assessment
}: $TSFixMe) {
  return certificationChallengeRepository
    .getNextNonAnsweredChallengeByCourseId(assessment.id, assessment.certificationCourseId)
    .then((certificationChallenge: $TSFixMe) => {
      return challengeRepository.get(certificationChallenge.challengeId);
    });
};
