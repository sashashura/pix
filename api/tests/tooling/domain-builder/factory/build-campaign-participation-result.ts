// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationResult = require('../../../../lib/domain/models/CampaignParticipationResult');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCampaignParticipationResult({
  id = 1,
  isCompleted = true,
  totalSkillsCount = 10,
  testedSkillsCount = 8,
  validatedSkillsCount = 5,
  competenceResults = [],
  campaignParticipationBadges,
  reachedStage = {},
  stageCount = 5
}: $TSFixMe = {}) {
  return new CampaignParticipationResult({
    id,
    isCompleted,
    totalSkillsCount,
    testedSkillsCount,
    validatedSkillsCount,
    competenceResults,
    campaignParticipationBadges,
    reachedStage,
    stageCount,
  });
};
