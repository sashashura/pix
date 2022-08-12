// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildAsses... Remove this comment to see the full error message
const buildAssessment = require('./build-assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildUser'... Remove this comment to see the full error message
const buildUser = require('./build-user');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCampa... Remove this comment to see the full error message
const buildCampaignParticipation = require('./build-campaign-participation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildOrgan... Remove this comment to see the full error message
const buildOrganizationLearner = require('./build-organization-learner');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildAssessmentFromParticipation(campaignParticipation: $TSFixMe, organizationLearner: $TSFixMe, user: $TSFixMe) {
  const userId = buildUser(user).id;
  const organizationLearnerId = buildOrganizationLearner(organizationLearner).id;
  const campaignParticipationId = buildCampaignParticipation({
    ...campaignParticipation,
    userId,
    organizationLearnerId,
  }).id;

  return buildAssessment({ userId, campaignParticipationId });
};
