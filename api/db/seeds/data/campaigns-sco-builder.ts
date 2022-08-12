// @ts-expect-error TS(6200): Definitions of the following identifiers conflict ... Remove this comment to see the full error message
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TARGET_PRO... Remove this comment to see the full error message
  TARGET_PROFILE_STAGES_BADGES_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TARGET_PRO... Remove this comment to see the full error message
  TARGET_PROFILE_PIX_EDU_FORMATION_INITIALE_2ND_DEGRE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TARGET_PRO... Remove this comment to see the full error message
  TARGET_PROFILE_PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('./target-profiles-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PRO_BASICS... Remove this comment to see the full error message
const { PRO_BASICS_BADGE_ID, PRO_TOOLS_BADGE_ID } = require('./badges-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SCO_MIDDLE... Remove this comment to see the full error message
const { SCO_MIDDLE_SCHOOL_ID, SCO_HIGH_SCHOOL_ID, SCO_AGRI_ID, SCO_AEFE_ID } = require('./organizations-sco-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SCO_STUDEN... Remove this comment to see the full error message
const { SCO_STUDENT_ID, SCO_FRENCH_USER_ID, SCO_FOREIGNER_USER_ID, SCO_FOREIGNER_USER_ID_IN_ANOTHER_ORGANIZATION, SCO_DISABLED_USER_ID } = require('./organizations-sco-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'participat... Remove this comment to see the full error message
const { participateToAssessmentCampaign, participateToProfilesCollectionCampaign } = require('./campaign-participations-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../lib/domain/models/CampaignParticipationStatuses');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED, TO_SHARE, STARTED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  campaignsScoBuilder,
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignsS... Remove this comment to see the full error message
function campaignsScoBuilder({
  databaseBuilder
}: $TSFixMe) {
  _buildCampaigns({ databaseBuilder });
  _buildScoAssessmentParticipations({ databaseBuilder });
  _buildScoProfilesCollectionParticipations({ databaseBuilder });
}

function _buildCampaigns({
  databaseBuilder
}: $TSFixMe) {
  databaseBuilder.factory.buildCampaign({
    id: 4,
    name: 'Sco - Collège - Campagne d’évaluation Badges',
    code: 'SCOBADGE1',
    type: 'ASSESSMENT',
    organizationId: SCO_MIDDLE_SCHOOL_ID,
    creatorId: 4,
    ownerId: 4,
    targetProfileId: TARGET_PROFILE_STAGES_BADGES_ID,
    assessmentMethod: 'SMART_RANDOM',
    title: null,
    customLandingPageText: null,
    idPixLabel: null,
    createdAt: new Date('2020-01-01'),
  });

  databaseBuilder.factory.buildCampaign({
    id: 7,
    name: 'Sco - Collège - Campagne de collecte de profils',
    code: 'SCOCOLECT',
    type: 'PROFILES_COLLECTION',
    organizationId: SCO_MIDDLE_SCHOOL_ID,
    creatorId: 6,
    ownerId: 6,
    idPixLabel: null,
    title: null,
    customLandingPageText: 'Veuillez envoyer votre profil',
    createdAt: new Date('2020-01-02'),
  });

  databaseBuilder.factory.buildCampaign({
    id: 8,
    name: 'Sco - Lycée - Campagne d’évaluation Badges',
    code: 'SCOBADGE2',
    type: 'ASSESSMENT',
    organizationId: SCO_HIGH_SCHOOL_ID,
    creatorId: 5,
    ownerId: 5,
    targetProfileId: TARGET_PROFILE_STAGES_BADGES_ID,
    assessmentMethod: 'SMART_RANDOM',
    idPixLabel: null,
    title: null,
    customLandingPageText: null,
    createdAt: new Date('2020-01-03'),
  });

  databaseBuilder.factory.buildCampaign({
    id: 9,
    name: 'Sco - Agriculture - Campagne d’évaluation Badges',
    code: 'SCOBADGE3',
    type: 'ASSESSMENT',
    organizationId: SCO_AGRI_ID,
    creatorId: 5,
    ownerId: 4,
    targetProfileId: TARGET_PROFILE_STAGES_BADGES_ID,
    assessmentMethod: 'SMART_RANDOM',
    idPixLabel: null,
    title: null,
    customLandingPageText: null,
    createdAt: new Date('2020-01-04'),
  });

  databaseBuilder.factory.buildCampaign({
    id: 23,
    name: 'Sco - AEFE - Campagne d’évaluation Pix+ Édu initiale',
    code: 'PIXEDUINI',
    type: 'ASSESSMENT',
    organizationId: SCO_AEFE_ID,
    creatorId: 4,
    ownerId: 5,
    targetProfileId: TARGET_PROFILE_PIX_EDU_FORMATION_INITIALE_2ND_DEGRE,
    assessmentMethod: 'SMART_RANDOM',
    title: null,
    customLandingPageText: null,
    idPixLabel: null,
    createdAt: new Date('2020-01-07'),
  });

  databaseBuilder.factory.buildCampaign({
    id: 24,
    name: 'Sco - AEFE - Campagne d’évaluation Pix+ Édu continue',
    code: 'PIXEDUCON',
    type: 'ASSESSMENT',
    organizationId: SCO_AEFE_ID,
    creatorId: 4,
    ownerId: 5,
    targetProfileId: TARGET_PROFILE_PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE,
    assessmentMethod: 'SMART_RANDOM',
    title: null,
    customLandingPageText: null,
    idPixLabel: null,
    createdAt: new Date('2020-01-07'),
  });
}

function _buildScoAssessmentParticipations({
  databaseBuilder
}: $TSFixMe) {
  const scoStudent = { id: SCO_STUDENT_ID, createdAt: new Date('2022-02-04') };
  const scoStudentFrench = { id: SCO_FRENCH_USER_ID, createdAt: new Date('2022-02-05') };
  const scoStudentForeigner = { id: SCO_FOREIGNER_USER_ID, createdAt: new Date('2022-02-05') };
  const scoStudentDisabled = { id: SCO_DISABLED_USER_ID, createdAt: new Date('2022-02-06') };

  const campaignParticipationId = participateToAssessmentCampaign({ databaseBuilder, campaignId: 4, user: scoStudent, organizationLearnerId: SCO_STUDENT_ID, status: SHARED });
  databaseBuilder.factory.buildBadgeAcquisition({ userId: SCO_STUDENT_ID, badgeId: PRO_BASICS_BADGE_ID, campaignParticipationId });
  databaseBuilder.factory.buildBadgeAcquisition({ userId: SCO_STUDENT_ID, badgeId: PRO_TOOLS_BADGE_ID, campaignParticipationId });

  participateToAssessmentCampaign({ databaseBuilder, campaignId: 4, user: scoStudentFrench, organizationLearnerId: SCO_FRENCH_USER_ID, status: TO_SHARE });
  participateToAssessmentCampaign({ databaseBuilder, campaignId: 4, user: scoStudentForeigner, organizationLearnerId: SCO_FOREIGNER_USER_ID, status: STARTED });
  participateToAssessmentCampaign({ databaseBuilder, campaignId: 4, user: scoStudentDisabled, organizationLearnerId: SCO_DISABLED_USER_ID, status: SHARED });

  participateToAssessmentCampaign({ databaseBuilder, campaignId: 8, user: scoStudentForeigner, organizationLearnerId: SCO_FOREIGNER_USER_ID_IN_ANOTHER_ORGANIZATION, status: SHARED });
}

function _buildScoProfilesCollectionParticipations({
  databaseBuilder
}: $TSFixMe) {
  const scoStudent = { id: SCO_STUDENT_ID, createdAt: new Date('2022-02-05') };
  const scoStudentFrench = { id: SCO_FRENCH_USER_ID, createdAt: new Date('2022-02-06') };
  const scoStudentForeigner = { id: SCO_FOREIGNER_USER_ID, createdAt: new Date('2022-02-07') };
  const scoStudentDisabled = { id: SCO_DISABLED_USER_ID, createdAt: new Date('2022-02-07') };

  participateToProfilesCollectionCampaign({ databaseBuilder, campaignId: 7, user: scoStudent, organizationLearnerId: SCO_STUDENT_ID, status: SHARED });
  participateToProfilesCollectionCampaign({ databaseBuilder, campaignId: 7, user: scoStudentFrench, organizationLearnerId: SCO_FRENCH_USER_ID, status: SHARED });
  participateToProfilesCollectionCampaign({ databaseBuilder, campaignId: 7, user: scoStudentForeigner, organizationLearnerId: SCO_FOREIGNER_USER_ID, status: TO_SHARE });
  participateToProfilesCollectionCampaign({ databaseBuilder, campaignId: 7, user: scoStudentDisabled, organizationLearnerId: SCO_DISABLED_USER_ID, status: SHARED });
}
