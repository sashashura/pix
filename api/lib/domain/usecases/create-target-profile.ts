// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfileForCreation = require('../models/TargetProfileForCreation');
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createTargetProfile({
  targetProfileData,
  targetProfileRepository,
  targetProfileWithLearningContentRepository
}: $TSFixMe) {
  const targetProfileForCreation = new TargetProfileForCreation(targetProfileData);
  const targetProfileId = await targetProfileRepository.create(targetProfileForCreation);
  return targetProfileWithLearningContentRepository.get({ id: targetProfileId });
};
