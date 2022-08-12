// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { buildTargetProfileWithLearningContent } = require('./build-target-profile-with-learning-content');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignCo... Remove this comment to see the full error message
const CampaignCollectiveResult = require('../../../../lib/domain/read-models/CampaignCollectiveResult');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCampaignCollectiveResult({
  id = 123,
  targetProfile = buildTargetProfileWithLearningContent(),
  participantsValidatedKECountByCompetenceId = [],
  participantCount = 0,
} = {}) {
  const campaignCollectiveResult = new CampaignCollectiveResult({ id, targetProfile });

  if (participantCount) {
    participantsValidatedKECountByCompetenceId.forEach((participantValidatedKECountByCompetence) => {
      campaignCollectiveResult.addValidatedSkillCountToCompetences(participantValidatedKECountByCompetence);
    });
    campaignCollectiveResult.finalize(participantCount);
  }

  return campaignCollectiveResult;
};
