'use strict';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DatabaseBu... Remove this comment to see the full error message
const DatabaseBuilder = require('../database-builder/database-builder');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const answersBuilder = require('./data/answers-builder');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const assessmentsBuilder = require('./data/assessments-builder');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildPixAileProfile = require('./data/pix-aile-profile-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignsP... Remove this comment to see the full error message
const { campaignsProBuilder } = require('./data/campaigns-pro-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignsS... Remove this comment to see the full error message
const { campaignsSupBuilder } = require('./data/campaigns-sup-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignsS... Remove this comment to see the full error message
const { campaignsScoBuilder } = require('./data/campaigns-sco-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const { certificationCandidatesBuilder } = require('./data/certification/certification-candidates-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgeAcqui... Remove this comment to see the full error message
const { badgeAcquisitionBuilder } = require('./data/certification/badge-acquisition-builder');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'complement... Remove this comment to see the full error message
  complementaryCertificationCourseResultsBuilder,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('./data/certification/complementary-certification-course-results-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const { certificationCentersBuilder } = require('./data/certification/certification-centers-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const { certificationCoursesBuilder } = require('./data/certification/certification-courses-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationScoresBuilder = require('./data/certification/certification-scores-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const { certificationSessionsBuilder } = require('./data/certification/certification-sessions-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const { certificationUsersBuilder } = require('./data/certification/users');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const { certificationUserProfilesBuilder } = require('./data/certification/user-profiles-builder');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationCenterMembershipsBuilder = require('./data/certification/certification-center-memberships-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const { organizationsProBuilder } = require('./data/organizations-pro-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const { organizationsScoBuilder } = require('./data/organizations-sco-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const { organizationsSupBuilder } = require('./data/organizations-sup-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const { organizationPlacesProBuilder } = require('./data/organization-places-pro-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgesBuil... Remove this comment to see the full error message
const { badgesBuilder } = require('./data/badges-builder');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const tagsBuilder = require('./data/tags-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const { targetProfilesBuilder } = require('./data/target-profiles-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usersBuild... Remove this comment to see the full error message
const { usersBuilder } = require('./data/users-builder');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const pixAdminRolesBuilder = require('./data/pix-admin-roles-builder');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const stagesBuilder = require('./data/stages-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const { certificationCpfCountryBuilder } = require('./data/certification/certification-cpf-country-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const { certificationCpfCityBuilder } = require('./data/certification/certification-cpf-city-builder');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getEligibl... Remove this comment to see the full error message
  getEligibleCampaignParticipations,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateKn... Remove this comment to see the full error message
  generateKnowledgeElementSnapshots,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../scripts/prod/generate-knowledge-element-snapshots-for-campaigns');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const computeParticipationsResults = require('../../scripts/prod/compute-participation-results');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const poleEmploiSendingsBuilder = require('./data/pole-emploi-sendings-builder');

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.seed = async (knex: $TSFixMe) => {
  const databaseBuilder = new DatabaseBuilder({ knex });

  // Users
  usersBuilder({ databaseBuilder });
  pixAdminRolesBuilder({ databaseBuilder });

  // Organizations
  tagsBuilder({ databaseBuilder });

  organizationsProBuilder({ databaseBuilder });
  organizationPlacesProBuilder({ databaseBuilder });

  organizationsScoBuilder({ databaseBuilder });

  organizationsSupBuilder({ databaseBuilder });

  // Target Profiles
  targetProfilesBuilder({ databaseBuilder });
  badgesBuilder({ databaseBuilder });
  stagesBuilder({ databaseBuilder });

  // Certifications
  certificationCentersBuilder({ databaseBuilder });
  certificationUsersBuilder({ databaseBuilder });
  certificationCenterMembershipsBuilder({ databaseBuilder });
  await certificationUserProfilesBuilder({ databaseBuilder });
  certificationSessionsBuilder({ databaseBuilder });
  certificationCandidatesBuilder({ databaseBuilder });
  await certificationCoursesBuilder({ databaseBuilder });
  certificationScoresBuilder({ databaseBuilder });
  badgeAcquisitionBuilder({ databaseBuilder });
  complementaryCertificationCourseResultsBuilder({ databaseBuilder });
  certificationCpfCountryBuilder({ databaseBuilder });
  certificationCpfCityBuilder({ databaseBuilder });

  // Éléments de parcours
  campaignsProBuilder({ databaseBuilder });
  campaignsSupBuilder({ databaseBuilder });
  campaignsScoBuilder({ databaseBuilder });
  assessmentsBuilder({ databaseBuilder });
  answersBuilder({ databaseBuilder });

  // Éléments de parcours pour l'utilisateur Pix Aile
  buildPixAileProfile({ databaseBuilder });

  // Création d'envois pole emploi
  poleEmploiSendingsBuilder({ databaseBuilder });

  await databaseBuilder.commit();
  await databaseBuilder.fixSequences();
  const campaignParticipationData = await getEligibleCampaignParticipations(50000);
  await generateKnowledgeElementSnapshots(campaignParticipationData, 1);
  await computeParticipationsResults(10, false);
};
