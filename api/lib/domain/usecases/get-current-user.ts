// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserWithAc... Remove this comment to see the full error message
const UserWithActivity = require('../read-models/UserWithActivity');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getCurrentUser({
  authenticatedUserId,
  userRepository,
  campaignParticipationRepository
}: $TSFixMe) {
  const [hasAssessmentParticipations, codeForLastProfileToShare] = await Promise.all([
    campaignParticipationRepository.hasAssessmentParticipations(authenticatedUserId),
    campaignParticipationRepository.getCodeOfLastParticipationToProfilesCollectionCampaignForUser(authenticatedUserId),
  ]);
  const user = await userRepository.get(authenticatedUserId);
  return new UserWithActivity({
    user,
    hasAssessmentParticipations,
    codeForLastProfileToShare,
  });
};
