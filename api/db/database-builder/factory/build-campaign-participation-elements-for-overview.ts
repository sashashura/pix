// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildAsses... Remove this comment to see the full error message
const buildAssessment = require('./build-assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildOrgan... Remove this comment to see the full error message
const buildOrganization = require('./build-organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCampa... Remove this comment to see the full error message
const buildCampaignParticipation = require('./build-campaign-participation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCampa... Remove this comment to see the full error message
const buildCampaign = require('./build-campaign');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCampaignParticipationElementsForOverview({
  userId,
  index,
  lastAssessmentState,
  campaignParticipationCreatedAt,
  campaignParticipationSharedAt,
  campaignArchivedAt,
  isShared
}: $TSFixMe = {}) {
  const organization = buildOrganization({
    name: `${index} - My organization`,
  });

  const campaign = buildCampaign({
    organizationId: organization.id,
    title: `${index} - My campaign`,
    createdAt: new Date('2000-01-01T10:00:00Z'),
    archivedAt: campaignArchivedAt ? campaignArchivedAt : null,
  });

  const campaignParticipation = buildCampaignParticipation({
    userId,
    createdAt: campaignParticipationCreatedAt,
    campaignId: campaign.id,
    isShared,
    sharedAt: campaignParticipationSharedAt,
  });

  buildAssessment({
    userId,
    campaignParticipationId: campaignParticipation.id,
    state: Assessment.states.COMPLETED,
    createdAt: new Date('2000-07-01T10:00:00Z'),
  });

  buildAssessment({
    userId,
    campaignParticipationId: campaignParticipation.id,
    state: lastAssessmentState,
    createdAt: new Date('2000-07-02T10:00:00Z'),
  });

  return {
    campaign,
    campaignParticipation,
    organization,
  };
};
