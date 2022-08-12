// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildAssessmentCampaignForSkills = require('./build-assessment-campaign-for-skills');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../../../lib/domain/models/CampaignTypes');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildAssessmentCampaign(attributes: $TSFixMe, skills = [{ id: 'skill', name: 'skillName' }]) {
  attributes.type = CampaignTypes.ASSESSMENT;

  return buildAssessmentCampaignForSkills(attributes, skills);
};
