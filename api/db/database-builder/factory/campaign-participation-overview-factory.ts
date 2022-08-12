// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildAsses... Remove this comment to see the full error message
const buildAssessment = require('./build-assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCampa... Remove this comment to see the full error message
const buildCampaign = require('./build-campaign');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCampa... Remove this comment to see the full error message
const buildCampaignParticipation = require('./build-campaign-participation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTarge... Remove this comment to see the full error message
const buildTargetProfileSkill = require('./build-target-profile-skill');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTarge... Remove this comment to see the full error message
const buildTargetProfile = require('./build-target-profile');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildUser = require('./build-user');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../lib/domain/models/CampaignParticipationStatuses');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'STARTED'.
const { STARTED, SHARED, TO_SHARE } = CampaignParticipationStatuses;

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  build({
    userId,
    createdAt,
    sharedAt,
    assessmentCreatedAt,
    assessmentState,
    campaignId,
    deletedAt,
    deletedBy,
    id
  }: $TSFixMe = {}) {
    const status = assessmentState === Assessment.states.COMPLETED ? TO_SHARE : STARTED;

    const campaignParticipation = buildCampaignParticipation({
      userId,
      campaignId,
      createdAt: createdAt,
      sharedAt: sharedAt,
      status: sharedAt ? SHARED : status,
      deletedAt,
      deletedBy,
    });

    buildAssessment({
      id,
      userId,
      campaignParticipationId: campaignParticipation.id,
      state: assessmentState,
      createdAt: assessmentCreatedAt,
    });

    return campaignParticipation;
  },

  buildOnGoing({
    userId,
    createdAt,
    assessmentCreatedAt,
    targetProfileSkills
  }: $TSFixMe = {}) {
    const targetProfile = buildTargetProfile();
    targetProfileSkills.forEach((skill: $TSFixMe) => buildTargetProfileSkill({ targetProfileId: targetProfile.id, skillId: skill })
    );
    const campaign = buildCampaign({ targetProfileId: targetProfile.id });

    const campaignParticipation = buildCampaignParticipation({
      userId,
      createdAt: createdAt,
      sharedAt: null,
      status: STARTED,
      campaignId: campaign.id,
    });

    buildAssessment({
      userId,
      campaignParticipationId: campaignParticipation.id,
      state: Assessment.states.STARTED,
      createdAt: assessmentCreatedAt,
    });

    return campaignParticipation;
  },

  buildToShare({
    userId,
    createdAt,
    assessmentCreatedAt,
    targetProfileSkills
  }: $TSFixMe = {}) {
    const targetProfile = buildTargetProfile();
    targetProfileSkills.forEach((skill: $TSFixMe) => buildTargetProfileSkill({ targetProfileId: targetProfile.id, skillId: skill })
    );
    const campaign = buildCampaign({ targetProfileId: targetProfile.id });

    const campaignParticipation = buildCampaignParticipation({
      userId,
      createdAt: createdAt,
      sharedAt: null,
      status: TO_SHARE,
      campaignId: campaign.id,
    });

    buildAssessment({
      userId,
      campaignParticipationId: campaignParticipation.id,
      state: Assessment.states.COMPLETED,
      createdAt: assessmentCreatedAt,
    });

    return campaignParticipation;
  },

  buildEnded({
    userId,
    createdAt,
    sharedAt,
    assessmentCreatedAt,
    targetProfileSkills
  }: $TSFixMe = {}) {
    const targetProfile = buildTargetProfile();
    targetProfileSkills.forEach((skill: $TSFixMe) => buildTargetProfileSkill({ targetProfileId: targetProfile.id, skillId: skill })
    );
    const campaign = buildCampaign({ targetProfileId: targetProfile.id });

    const campaignParticipation = buildCampaignParticipation({
      userId,
      createdAt: createdAt,
      sharedAt: sharedAt || createdAt,
      campaignId: campaign.id,
    });

    buildAssessment({
      userId,
      campaignParticipationId: campaignParticipation.id,
      state: Assessment.states.COMPLETED,
      createdAt: assessmentCreatedAt,
    });

    return campaignParticipation;
  },

  buildArchived({
    userId,
    createdAt,
    sharedAt,
    assessmentCreatedAt,
    campaignArchivedAt = new Date('1998-07-01'),
    targetProfileSkills
  }: $TSFixMe = {}) {
    const targetProfile = buildTargetProfile();
    targetProfileSkills.forEach((skill: $TSFixMe) => buildTargetProfileSkill({ targetProfileId: targetProfile.id, skillId: skill })
    );
    const campaign = buildCampaign({ targetProfileId: targetProfile.id, archivedAt: campaignArchivedAt });

    const campaignParticipation = buildCampaignParticipation({
      userId,
      campaignId: campaign.id,
      createdAt: createdAt,
      sharedAt: sharedAt || createdAt,
      status: STARTED,
    });

    buildAssessment({
      userId,
      campaignParticipationId: campaignParticipation.id,
      createdAt: assessmentCreatedAt,
    });

    return campaignParticipation;
  },

  buildDeleted({
    userId,
    createdAt,
    sharedAt,
    assessmentCreatedAt,
    deletedAt = new Date('1998-07-01'),
    deletedBy = buildUser().id,
    targetProfileSkills
  }: $TSFixMe = {}) {
    const targetProfile = buildTargetProfile();
    targetProfileSkills.forEach((skill: $TSFixMe) => buildTargetProfileSkill({ targetProfileId: targetProfile.id, skillId: skill })
    );
    const campaign = buildCampaign({ targetProfileId: targetProfile.id });

    const campaignParticipation = buildCampaignParticipation({
      userId,
      campaignId: campaign.id,
      createdAt: createdAt,
      sharedAt: sharedAt || createdAt,
      deletedAt,
      deletedBy,
      status: STARTED,
    });

    buildAssessment({
      userId,
      campaignParticipationId: campaignParticipation.id,
      createdAt: assessmentCreatedAt,
    });

    return campaignParticipation;
  },
};
