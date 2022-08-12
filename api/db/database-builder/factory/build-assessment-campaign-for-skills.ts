// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCampa... Remove this comment to see the full error message
const buildCampaign = require('./build-campaign');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTarge... Remove this comment to see the full error message
const buildTargetProfile = require('./build-target-profile');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTarge... Remove this comment to see the full error message
const buildTargetProfileSkill = require('./build-target-profile-skill');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../../../lib/domain/models/CampaignTypes');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildAssessmentCampaignForSkills(attributes: $TSFixMe, skillSet: $TSFixMe) {
  const targetProfileId = buildTargetProfile().id;
  skillSet.forEach((skill: $TSFixMe) => buildTargetProfileSkill({ targetProfileId, skillId: skill.id }));

  attributes.type = CampaignTypes.ASSESSMENT;
  attributes.targetProfileId = targetProfileId;

  return buildCampaign(attributes);
};
