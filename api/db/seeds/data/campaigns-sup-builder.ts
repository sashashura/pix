const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TARGET_PRO... Remove this comment to see the full error message
  TARGET_PROFILE_PIC_DIAG_INITIAL_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TARGET_PRO... Remove this comment to see the full error message
  TARGET_PROFILE_PIX_DROIT_ID,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('./target-profiles-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SUP_UNIVER... Remove this comment to see the full error message
const { SUP_UNIVERSITY_ID } = require('./organizations-sup-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SUP_STUDEN... Remove this comment to see the full error message
const { SUP_STUDENT_ASSOCIATED_ID, SUP_STUDENT_DISABLED_ID } = require('./organizations-sup-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'participat... Remove this comment to see the full error message
const { participateToAssessmentCampaign, participateToProfilesCollectionCampaign } = require('./campaign-participations-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../lib/domain/models/CampaignParticipationStatuses');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED, TO_SHARE, STARTED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  campaignsSupBuilder,
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignsS... Remove this comment to see the full error message
function campaignsSupBuilder({
  databaseBuilder
}: $TSFixMe) {
  _buildCampaigns({ databaseBuilder });
  _buildSupAssessmentParticipations({ databaseBuilder });
  _buildSupProfilesCollectionParticipations({ databaseBuilder });
}

function _buildCampaigns({
  databaseBuilder
}: $TSFixMe) {
  databaseBuilder.factory.buildCampaign({
    id: 3,
    name: 'Sup - Campagne d’évaluation PIC',
    code: 'SUPPIC123',
    type: 'ASSESSMENT',
    organizationId: SUP_UNIVERSITY_ID,
    creatorId: 7,
    ownerId: 7,
    targetProfileId: TARGET_PROFILE_PIC_DIAG_INITIAL_ID,
    assessmentMethod: 'SMART_RANDOM',
    title: null,
    customLandingPageText: null,
    idPixLabel: null,
    createdAt: new Date('2020-01-05'),
  });

  databaseBuilder.factory.buildCampaign({
    id: 10,
    name: 'Sup - Campagne de collecte de profils',
    code: 'SUPCOLECT',
    type: 'PROFILES_COLLECTION',
    organizationId: SUP_UNIVERSITY_ID,
    creatorId: 8,
    ownerId: 7,
    idPixLabel: null,
    title: null,
    customLandingPageText: null,
    createdAt: new Date('2020-01-06'),
  });

  databaseBuilder.factory.buildCampaign({
    id: 20,
    name: 'Sup - Campagne d\'évaluation Pix+ Droit',
    code: 'SUPDROIT1',
    type: 'ASSESSMENT',
    organizationId: SUP_UNIVERSITY_ID,
    creatorId: 7,
    ownerId: 8,
    targetProfileId: TARGET_PROFILE_PIX_DROIT_ID,
    assessmentMethod: 'SMART_RANDOM',
    title: null,
    customLandingPageText: null,
    idPixLabel: null,
    createdAt: new Date('2020-01-08'),
  });
}

function _buildSupAssessmentParticipations({
  databaseBuilder
}: $TSFixMe) {
  const supStudentAssociated = { id: SUP_STUDENT_ASSOCIATED_ID, createdAt: new Date('2022-02-04') };
  const supStudentDisabled = { id: SUP_STUDENT_DISABLED_ID, createdAt: new Date('2022-02-05') };
  participateToAssessmentCampaign({ databaseBuilder, campaignId: 3, user: supStudentAssociated, organizationLearnerId: SUP_STUDENT_ASSOCIATED_ID, status: SHARED });
  participateToAssessmentCampaign({ databaseBuilder, campaignId: 3, user: supStudentDisabled, organizationLearnerId: SUP_STUDENT_DISABLED_ID, status: STARTED });
}

function _buildSupProfilesCollectionParticipations({
  databaseBuilder
}: $TSFixMe) {
  const supStudentAssociated = { id: SUP_STUDENT_ASSOCIATED_ID, createdAt: new Date('2022-02-06') };
  const supStudentDisabled = { id: SUP_STUDENT_DISABLED_ID, createdAt: new Date('2022-02-07') };
  participateToProfilesCollectionCampaign({ databaseBuilder, campaignId: 10, user: supStudentAssociated, organizationLearnerId: SUP_STUDENT_ASSOCIATED_ID, status: SHARED });
  participateToProfilesCollectionCampaign({ databaseBuilder, campaignId: 10, user: supStudentDisabled, organizationLearnerId: SUP_STUDENT_DISABLED_ID, status: TO_SHARE });
}
