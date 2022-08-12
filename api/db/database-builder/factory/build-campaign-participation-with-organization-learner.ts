// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildAsses... Remove this comment to see the full error message
const buildAssessment = require('./build-assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCampa... Remove this comment to see the full error message
const buildCampaignParticipation = require('./build-campaign-participation');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildOrganizationLearnerWithUser = require('./build-organization-learner-with-user');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = (organizationLearner: $TSFixMe, campaignParticipation: $TSFixMe, withAssessment: $TSFixMe) => {
  const { userId, id: organizationLearnerId } = buildOrganizationLearnerWithUser(organizationLearner);
  const campaignParticipationCreated = buildCampaignParticipation({
    userId,
    organizationLearnerId,
    ...campaignParticipation,
  });
  if (withAssessment) {
    buildAssessment({ userId, campaignParticipationId: campaignParticipationCreated.id });
  }
  return campaignParticipationCreated;
};
