// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'dependenci... Remove this comment to see the full error message
const dependencies = {
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  accountRecoveryDemandRepository: require('../../infrastructure/repositories/account-recovery-demand-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  adminMemberRepository: require('../../infrastructure/repositories/admin-member-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  algorithmDataFetcherService: require('../../domain/services/algorithm-methods/data-fetcher'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  answerRepository: require('../../infrastructure/repositories/answer-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  areaRepository: require('../../infrastructure/repositories/area-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  assessmentRepository: require('../../infrastructure/repositories/assessment-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  assessmentResultRepository: require('../../infrastructure/repositories/assessment-result-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  authenticationMethodRepository: require('../../infrastructure/repositories/authentication-method-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  authenticationServiceRegistry: require('../services/authentication/authentication-service-registry'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  authenticationSessionService: require('../../domain/services/authentication/authentication-session-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  badgeAcquisitionRepository: require('../../infrastructure/repositories/badge-acquisition-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  badgeCriteriaService: require('../../domain/services/badge-criteria-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  badgeCriteriaRepository: require('../../infrastructure/repositories/badge-criteria-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  badgeRepository: require('../../infrastructure/repositories/badge-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  campaignAnalysisRepository: require('../../infrastructure/repositories/campaign-analysis-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  campaignAssessmentParticipationRepository: require('../../infrastructure/repositories/campaign-assessment-participation-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  campaignAssessmentParticipationResultListRepository: require('../../infrastructure/repositories/campaign-assessment-participation-result-list-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  campaignAssessmentParticipationResultRepository: require('../../infrastructure/repositories/campaign-assessment-participation-result-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  campaignCreatorRepository: require('../../infrastructure/repositories/campaign-creator-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  campaignParticipantActivityRepository: require('../../infrastructure/repositories/campaign-participant-activity-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  campaignCollectiveResultRepository: require('../../infrastructure/repositories/campaign-collective-result-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  campaignManagementRepository: require('../../infrastructure/repositories/campaign-management-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  campaignParticipationInfoRepository: require('../../infrastructure/repositories/campaign-participation-info-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  campaignParticipantRepository: require('../../infrastructure/repositories/campaign-participant-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  campaignParticipationOverviewRepository: require('../../infrastructure/repositories/campaign-participation-overview-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  campaignParticipationRepository: require('../../infrastructure/repositories/campaign-participation-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  campaignParticipationResultRepository: require('../../infrastructure/repositories/campaign-participation-result-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  campaignParticipationsStatsRepository: require('../../infrastructure/repositories/campaign-participations-stats-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  campaignProfilesCollectionParticipationSummaryRepository: require('../../infrastructure/repositories/campaign-profiles-collection-participation-summary-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  campaignProfileRepository: require('../../infrastructure/repositories/campaign-profile-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  campaignReportRepository: require('../../infrastructure/repositories/campaign-report-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  campaignRepository: require('../../infrastructure/repositories/campaign-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  campaignToJoinRepository: require('../../infrastructure/repositories/campaign-to-join-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  campaignCsvExportService: require('../../domain/services/campaign-csv-export-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  certificationAssessmentRepository: require('../../infrastructure/repositories/certification-assessment-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  certificationAttestationRepository: require('../../infrastructure/repositories/certification-attestation-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  certificationAttestationPdf: require('../../infrastructure/utils/pdf/certification-attestation-pdf'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  certificationBadgesService: require('../../domain/services/certification-badges-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  certificationCandidateRepository: require('../../infrastructure/repositories/certification-candidate-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  certificationCandidateForSupervisingRepository: require('../../infrastructure/repositories/certification-candidate-for-supervising-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  certificationCandidatesOdsService: require('../../domain/services/certification-candidates-ods-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  certificationCenterMembershipRepository: require('../../infrastructure/repositories/certification-center-membership-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  certificationCenterRepository: require('../../infrastructure/repositories/certification-center-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  certificationChallengeRepository: require('../../infrastructure/repositories/certification-challenge-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  certificationChallengesService: require('../../domain/services/certification-challenges-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  certificationCourseRepository: require('../../infrastructure/repositories/certification-course-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  certificationCpfCityRepository: require('../../infrastructure/repositories/certification-cpf-city-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  certificationCpfCountryRepository: require('../../infrastructure/repositories/certification-cpf-country-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  certificationIssueReportRepository: require('../../infrastructure/repositories/certification-issue-report-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  certificationLsRepository: require('../../infrastructure/repositories/certification-livret-scolaire-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  certificationOfficerRepository: require('../../infrastructure/repositories/certification-officer-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  certificationPointOfContactRepository: require('../../infrastructure/repositories/certification-point-of-contact-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  certificationReportRepository: require('../../infrastructure/repositories/certification-report-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  certificationRepository: require('../../infrastructure/repositories/certification-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  certificationCpfService: require('../../domain/services/certification-cpf-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  certificationResultRepository: require('../../infrastructure/repositories/certification-result-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  challengeRepository: require('../../infrastructure/repositories/challenge-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  challengeForPixAutoAnswerRepository: require('../../infrastructure/repositories/challenge-for-pix-auto-answer-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  cleaCertificationResultRepository: require('../../infrastructure/repositories/clea-certification-result-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  competenceEvaluationRepository: require('../../infrastructure/repositories/competence-evaluation-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  competenceMarkRepository: require('../../infrastructure/repositories/competence-mark-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  competenceRepository: require('../../infrastructure/repositories/competence-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  competenceTreeRepository: require('../../infrastructure/repositories/competence-tree-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  complementaryCertificationHabilitationRepository: require('../../infrastructure/repositories/complementary-certification-habilitation-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  complementaryCertificationRepository: require('../../infrastructure/repositories/complementary-certification-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  complementaryCertificationSubscriptionRepository: require('../../infrastructure/repositories/complementary-certification-subscription-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  complementaryCertificationCourseResultRepository: require('../../infrastructure/repositories/complementary-certification-course-result-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  correctionRepository: require('../../infrastructure/repositories/correction-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  countryRepository: require('../../infrastructure/repositories/country-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  courseRepository: require('../../infrastructure/repositories/course-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  cpfCertificationResultRepository: require('../../infrastructure/repositories/cpf-certification-result-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  divisionRepository: require('../../infrastructure/repositories/division-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  encryptionService: require('../../domain/services/encryption-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  endTestScreenRemovalService: require('../services/end-test-screen-removal-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  flashAssessmentResultRepository: require('../../infrastructure/repositories/flash-assessment-result-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  flashAlgorithmService: require('../../domain/services/algorithm-methods/flash'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  frameworkRepository: require('../../infrastructure/repositories/framework-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  getCompetenceLevel: require('../../domain/services/get-competence-level'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  sessionForSupervisorKitRepository: require('../../infrastructure/repositories/sessions/session-for-supervisor-kit-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  groupRepository: require('../../infrastructure/repositories/group-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  finalizedSessionRepository: require('../../infrastructure/repositories/sessions/finalized-session-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  supOrganizationLearnerRepository: require('../../infrastructure/repositories/sup-organization-learner-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  improvementService: require('../../domain/services/improvement-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  juryCertificationRepository: require('../../infrastructure/repositories/jury-certification-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  juryCertificationSummaryRepository: require('../../infrastructure/repositories/jury-certification-summary-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  jurySessionRepository: require('../../infrastructure/repositories/sessions/jury-session-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  knowledgeElementRepository: require('../../infrastructure/repositories/knowledge-element-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  mailService: require('../../domain/services/mail-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  membershipRepository: require('../../infrastructure/repositories/membership-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  obfuscationService: require('../../domain/services/obfuscation-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  organizationMemberIdentityRepository: require('../../infrastructure/repositories/organization-member-identity-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  organizationForAdminRepository: require('../../infrastructure/repositories/organization-for-admin-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  organizationRepository: require('../../infrastructure/repositories/organization-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  organizationPlacesLotRepository: require('../../infrastructure/repositories/organizations/organization-places-lot-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  organizationPlacesCapacityRepository: require('../../infrastructure/repositories/organization-places-capacity-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  organizationInvitationRepository: require('../../infrastructure/repositories/organization-invitation-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  organizationInvitedUserRepository: require('../../infrastructure/repositories/organization-invited-user-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  organizationTagRepository: require('../../infrastructure/repositories/organization-tag-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  organizationsToAttachToTargetProfileRepository: require('../../infrastructure/repositories/organizations-to-attach-to-target-profile-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  participantResultRepository: require('../../infrastructure/repositories/participant-result-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  participationsForCampaignManagementRepository: require('../../infrastructure/repositories/participations-for-campaign-management-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  participationsForUserManagementRepository: require('../../infrastructure/repositories/participations-for-user-management-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  partnerCertificationScoringRepository: require('../../infrastructure/repositories/partner-certification-scoring-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  passwordGenerator: require('../../domain/services/password-generator'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  pickChallengeService: require('../services/pick-challenge-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  pixAuthenticationService: require('../../domain/services/authentication/pix-authentication-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  pixPlusDroitMaitreCertificationResultRepository: require('../../infrastructure/repositories/pix-plus-droit-maitre-certification-result-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  pixPlusDroitExpertCertificationResultRepository: require('../../infrastructure/repositories/pix-plus-droit-expert-certification-result-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  placementProfileService: require('../../domain/services/placement-profile-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  poleEmploiSendingRepository: require('../../infrastructure/repositories/pole-emploi-sending-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  prescriberRepository: require('../../infrastructure/repositories/prescriber-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  privateCertificateRepository: require('../../infrastructure/repositories/private-certificate-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  resetPasswordService: require('../../domain/services/reset-password-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  resetPasswordDemandRepository: require('../../infrastructure/repositories/reset-password-demands-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  organizationLearnerRepository: require('../../infrastructure/repositories/organization-learner-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  organizationParticipantRepository: require('../../infrastructure/repositories/organization-participant-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  organizationLearnersCsvService: require('../../domain/services/organization-learners-csv-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  organizationLearnersXmlService: require('../../domain/services/organization-learners-xml-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  scoAccountRecoveryService: require('../services/sco-account-recovery-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  scoCertificationCandidateRepository: require('../../infrastructure/repositories/sco-certification-candidate-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  scoOrganizationParticipantRepository: require('../../infrastructure/repositories/sco-organization-participant-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  scorecardService: require('../../domain/services/scorecard-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  scoringCertificationService: require('../../domain/services/scoring/scoring-certification-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  supOrganizationParticipantRepository: require('../../infrastructure/repositories/sup-organization-participant-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  sessionForAttendanceSheetRepository: require('../../infrastructure/repositories/sessions/session-for-attendance-sheet-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  sessionPublicationService: require('../../domain/services/session-publication-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  sessionRepository: require('../../infrastructure/repositories/sessions/session-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  sessionForSupervisingRepository: require('../../infrastructure/repositories/sessions/session-for-supervising-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  sessionJuryCommentRepository: require('../../infrastructure/repositories/sessions/session-jury-comment-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  sessionSummaryRepository: require('../../infrastructure/repositories/sessions/session-summary-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  settings: require('../../config'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  shareableCertificateRepository: require('../../infrastructure/repositories/shareable-certificate-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  skillRepository: require('../../infrastructure/repositories/skill-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  skillSetRepository: require('../../infrastructure/repositories/skill-set-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  stageRepository: require('../../infrastructure/repositories/stage-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  studentRepository: require('../../infrastructure/repositories/student-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  supervisorAccessRepository: require('../../infrastructure/repositories/supervisor-access-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  tagRepository: require('../../infrastructure/repositories/tag-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  TargetProfileForSpecifierRepository: require('../../infrastructure/repositories/campaign/target-profile-for-specifier-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  targetProfileRepository: require('../../infrastructure/repositories/target-profile-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  targetProfileForUpdateRepository: require('../../infrastructure/repositories/target-profile-for-update-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  targetProfileShareRepository: require('../../infrastructure/repositories/target-profile-share-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  targetProfileWithLearningContentRepository: require('../../infrastructure/repositories/target-profile-with-learning-content-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  thematicRepository: require('../../infrastructure/repositories/thematic-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  tokenService: require('../../domain/services/token-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  refreshTokenService: require('../../domain/services/refresh-token-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  trainingRepository: require('../../infrastructure/repositories/training-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  tubeRepository: require('../../infrastructure/repositories/tube-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  tutorialEvaluationRepository: require('../../infrastructure/repositories/tutorial-evaluation-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  tutorialRepository: require('../../infrastructure/repositories/tutorial-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  userEmailRepository: require('../../infrastructure/repositories/user-email-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  userOrgaSettingsRepository: require('../../infrastructure/repositories/user-orga-settings-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  userReconciliationService: require('../services/user-reconciliation-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  userToCreateRepository: require('../../infrastructure/repositories/user-to-create-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  userRepository: require('../../infrastructure/repositories/user-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  userService: require('../../domain/services/user-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  userTutorialRepository: require('../../infrastructure/repositories/user-tutorial-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  verifyCertificateCodeService: require('../../domain/services/verify-certificate-code-service'),
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'injectDepe... Remove this comment to see the full error message
const { injectDependencies } = require('../../infrastructure/utils/dependency-injection');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = injectDependencies(
  {
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    abortCertificationCourse: require('./abort-certification-course'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    acceptOrganizationInvitation: require('./accept-organization-invitation'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    acceptPixLastTermsOfService: require('./accept-pix-last-terms-of-service'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    acceptPixCertifTermsOfService: require('./accept-pix-certif-terms-of-service'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    acceptPixOrgaTermsOfService: require('./accept-pix-orga-terms-of-service'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    addCertificationCandidateToSession: require('./add-certification-candidate-to-session'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    addPixAuthenticationMethodByEmail: require('./add-pix-authentication-method-by-email'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    addTutorialEvaluation: require('./add-tutorial-evaluation'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    addTutorialToUser: require('./add-tutorial-to-user'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    anonymizeUser: require('./anonymize-user'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    attachTargetProfilesToOrganization: require('./attach-target-profiles-to-organization'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    attachOrganizationsFromExistingTargetProfile: require('./attach-organizations-from-existing-target-profile'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    attachOrganizationsToTargetProfile: require('./attach-organizations-to-target-profile'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    archiveCampaign: require('./archive-campaign'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    archiveOrganization: require('./archive-organization'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    outdateTargetProfile: require('./outdate-target-profile'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    assignCertificationOfficerToJurySession: require('./assign-certification-officer-to-jury-session'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    authenticateAnonymousUser: require('./authenticate-anonymous-user'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    authenticateOidcUser: require('./authentication/authenticate-oidc-user'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    authenticateUser: require('./authenticate-user'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    authenticateExternalUser: require('./authenticate-external-user'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    authenticateApplication: require('./authenticate-application'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    authorizeCertificationCandidateToStart: require('./authorize-certification-candidate-to-start'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    authorizeCertificationCandidateToResume: require('./authorize-certification-candidate-to-resume'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    beginCampaignParticipationImprovement: require('./begin-campaign-participation-improvement'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    cancelOrganizationInvitation: require('./cancel-organization-invitation'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    cancelCertificationCourse: require('./cancel-certification-course'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    changeUserLang: require('./change-user-lang'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    checkScoAccountRecovery: require('./check-sco-account-recovery'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    commentSessionAsJury: require('./comment-session-as-jury'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    completeAssessment: require('./complete-assessment'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    computeCampaignAnalysis: require('./compute-campaign-analysis'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    computeCampaignCollectiveResult: require('./compute-campaign-collective-result'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    computeCampaignParticipationAnalysis: require('./compute-campaign-participation-analysis'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    correctAnswerThenUpdateAssessment: require('./correct-answer-then-update-assessment'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    correctCandidateIdentityInCertificationCourse: require('./correct-candidate-identity-in-certification-course'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    createAccessTokenFromRefreshToken: require('./create-access-token-from-refresh-token'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    createAndReconcileUserToOrganizationLearner: require('./create-and-reconcile-user-to-organization-learner'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    createBadge: require('./create-badge'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    createCampaign: require('./create-campaign'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    createCertificationCenter: require('./create-certification-center'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    createCertificationCenterMembership: require('./create-certification-center-membership'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    createCertificationCenterMembershipByEmail: require('./create-certification-center-membership-by-email'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    createCertificationCenterMembershipForScoOrganizationMember: require('./create-certification-center-membership-for-sco-organization-member'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    createLcmsRelease: require('./create-lcms-release'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    createMembership: require('./create-membership'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    createOrUpdateUserOrgaSettings: require('./create-or-update-user-orga-settings'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    createOrganization: require('./create-organization'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    createOrganizationInvitationByAdmin: require('./create-organization-invitation-by-admin'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    createOrganizationInvitations: require('./create-organization-invitations'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    createOrganizationPlacesLot: require('./create-organization-places-lot'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    createPasswordResetDemand: require('./create-password-reset-demand'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    createProOrganizations: require('./create-pro-organizations-with-tags'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    createSession: require('./create-session'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    createStage: require('./create-stage'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    createTag: require('./create-tag'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    createTargetProfile: require('./create-target-profile'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    createUser: require('./create-user'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    createUserAndReconcileToOrganizationLearnerFromExternalUser: require('./create-user-and-reconcile-to-organization-learner-from-external-user'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    createOidcUser: require('./create-oidc-user'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    deleteCampaignParticipation: require('./delete-campaign-participation'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    deleteCampaignParticipationForAdmin: require('./delete-campaign-participation-for-admin'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    deleteCertificationIssueReport: require('./delete-certification-issue-report'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    deleteSessionJuryComment: require('./delete-session-jury-comment'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    deleteSession: require('./delete-session'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    deleteUnassociatedBadge: require('./delete-unassociated-badge'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    deleteUnlinkedCertificationCandidate: require('./delete-unlinked-certification-candidate'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    deneutralizeChallenge: require('./deneutralize-challenge'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    disableMembership: require('./disable-membership'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    disableCertificationCenterMembership: require('./disable-certification-center-membership'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    dissociateUserFromOrganizationLearner: require('./dissociate-user-from-organization-learner'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    endAssessmentBySupervisor: require('./end-assessment-by-supervisor'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    enrollStudentsToSession: require('./enroll-students-to-session'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    finalizeSession: require('./finalize-session'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findAllTags: require('./find-all-tags'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findAnswerByAssessment: require('./find-answer-by-assessment'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findAnswerByChallengeAndAssessment: require('./find-answer-by-challenge-and-assessment'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findAssessmentParticipationResultList: require('./find-assessment-participation-result-list'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findAssociationBetweenUserAndOrganizationLearner: require('./find-association-between-user-and-organization-learner'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findCampaignParticipationTrainings: require('./find-campaign-participation-trainings'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findCampaignParticipationsForUserManagement: require('./find-campaign-participations-for-user-management'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findCampaignProfilesCollectionParticipationSummaries: require('./find-campaign-profiles-collection-participation-summaries'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findCertificationCenterMembershipsByCertificationCenter: require('./find-certification-center-memberships-by-certification-center'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findCountries: require('./find-countries'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findCompetenceEvaluationsByAssessment: require('./find-competence-evaluations-by-assessment'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findComplementaryCertifications: require('./find-complementary-certifications'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findLatestOngoingUserCampaignParticipations: require('./find-latest-ongoing-user-campaign-participations'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findDivisionsByCertificationCenter: require('./find-divisions-by-certification-center'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findDivisionsByOrganization: require('./find-divisions-by-organization'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findFinalizedSessionsToPublish: require('./find-finalized-sessions-to-publish'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findFinalizedSessionsWithRequiredAction: require('./find-finalized-sessions-with-required-action'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findGroupsByOrganization: require('./find-groups-by-organization'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findOrganizationPlacesLot: require('./find-organization-places-lot'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findPaginatedCampaignParticipantsActivities: require('./find-paginated-campaign-participants-activities'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findPaginatedCampaignManagements: require('./find-paginated-campaign-managements'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findPaginatedCertificationCenterSessionSummaries: require('./find-paginated-certification-center-session-summaries'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findPaginatedFilteredCertificationCenters: require('./find-paginated-filtered-certification-centers'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findPaginatedFilteredOrganizationCampaigns: require('./find-paginated-filtered-organization-campaigns'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findPaginatedFilteredOrganizationMemberships: require('./find-paginated-filtered-organization-memberships'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findPaginatedFilteredOrganizations: require('./find-paginated-filtered-organizations'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findPaginatedFilteredOrganizationLearners: require('./find-paginated-filtered-organization-learners'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findPaginatedFilteredScoParticipants: require('./find-paginated-filtered-sco-participants'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findPaginatedFilteredSupParticipants: require('./find-paginated-filtered-sup-participants'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findPaginatedFilteredTargetProfiles: require('./find-paginated-filtered-target-profiles'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findPaginatedFilteredTargetProfileOrganizations: require('./find-paginated-filtered-target-profile-organizations'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findPaginatedFilteredUsers: require('./find-paginated-filtered-users'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findPaginatedParticipationsForCampaignManagement: require('./find-paginated-participations-for-campaign-management'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findPaginatedRecommendedTutorials: require('./find-paginated-recommended-tutorials'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findPaginatedSavedTutorials: require('./find-paginated-saved-tutorials'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findPendingOrganizationInvitations: require('./find-pending-organization-invitations'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findStudentsForEnrollment: require('./find-students-for-enrollment'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findTargetProfileBadges: require('./find-target-profile-badges'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findTargetProfileStages: require('./find-target-profile-stages'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findTutorials: require('./find-tutorials'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findUserCampaignParticipationOverviews: require('./find-user-campaign-participation-overviews'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findUserPrivateCertificates: require('./find-user-private-certificates'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    flagSessionResultsAsSentToPrescriber: require('./flag-session-results-as-sent-to-prescriber'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    generateUsername: require('./generate-username'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    generateUsernameWithTemporaryPassword: require('./generate-username-with-temporary-password'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getAdminMemberDetails: require('./get-admin-member-details'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getAnswer: require('./get-answer'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getAssessment: require('./get-assessment'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getAttendanceSheet: require('./get-attendance-sheet'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getAvailableTargetProfilesForOrganization: require('./get-available-target-profiles-for-organization'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getBadgeDetails: require('./get-badge-details'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getCampaign: require('./get-campaign'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getCampaignDetailsManagement: require('./get-campaign-details-management'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getCampaignByCode: require('./get-campaign-by-code'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getCampaignAssessmentParticipation: require('./get-campaign-assessment-participation'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getCampaignAssessmentParticipationResult: require('./get-campaign-assessment-participation-result'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getCampaignParticipationsActivityByDay: require('./get-campaign-participations-activity-by-day'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getCampaignParticipationsCountByStage: require('./get-campaign-participations-counts-by-stage'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getCampaignParticipationsCountsByStatus: require('./get-campaign-participations-counts-by-status'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getCampaignProfile: require('./get-campaign-profile'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getCandidateImportSheetData: require('./get-candidate-import-sheet-data'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getCertificationAttestation: require('./certificate/get-certification-attestation'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getOrganizationMemberIdentities: require('./get-organization-members-identity'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findCertificationAttestationsForDivision: require('./certificate/find-certification-attestations-for-division'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getCertificationCandidate: require('./get-certification-candidate'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getCertificationCandidateSubscription: require('./get-certification-candidate-subscription'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getCertificationCenter: require('./get-certification-center'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getCertificationCourse: require('./get-certification-course'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getCertificationDetails: require('./get-certification-details'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getCertificationsResultsForLS: require('./certificate/get-certifications-results-for-ls'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getCertificationPointOfContact: require('./get-certification-point-of-contact'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getChallengeForPixAutoAnswer: require('./get-challenge-for-pix-auto-answer'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getCorrectionForAnswer: require('./get-correction-for-answer'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getCurrentUser: require('./get-current-user'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getExternalAuthenticationRedirectionUrl: require('./get-external-authentication-redirection-url'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getJurySession: require('./get-jury-session'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getJuryCertification: require('./get-jury-certification'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getLastChallengeIdFromAssessmentId: require('./get-last-challenge-id-from-assessment-id'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getNextChallengeForCampaignAssessment: require('./get-next-challenge-for-campaign-assessment'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getNextChallengeForCertification: require('./get-next-challenge-for-certification'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getNextChallengeForCompetenceEvaluation: require('./get-next-challenge-for-competence-evaluation'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getNextChallengeForDemo: require('./get-next-challenge-for-demo'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getNextChallengeForPreview: require('./get-next-challenge-for-preview'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getOrganizationDetails: require('./get-organization-details'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getOrganizationInvitation: require('./get-organization-invitation'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getParticipantsDivision: require('./get-participants-division'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getParticipantsGroup: require('./get-participants-group'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getAdminMembers: require('./get-admin-members'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getPaginatedParticipantsForAnOrganization: require('./get-paginated-participants-for-an-organization'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getPoleEmploiSendings: require('./get-pole-emploi-sendings'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getPrescriber: require('./get-prescriber'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getPrivateCertificate: require('./certificate/get-private-certificate'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getProgression: require('./get-progression'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getScoCertificationResultsByDivision: require('./get-sco-certification-results-by-division'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getOrganizationLearnersCsvTemplate: require('./get-organization-learners-csv-template'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getScorecard: require('./get-scorecard'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getSession: require('./get-session'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getSessionCertificationCandidates: require('./get-session-certification-candidates'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getSessionCertificationReports: require('./get-session-certification-reports'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getSessionForSupervising: require('./get-session-for-supervising'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getSessionResults: require('./get-session-results'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getSessionResultsByResultRecipientEmail: require('./get-session-results-by-result-recipient-email'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getShareableCertificate: require('./certificate/get-shareable-certificate'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getStageDetails: require('./get-stage-details'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getSupervisorKitSessionInfo: require('./get-supervisor-kit-session-info'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getTargetProfileDetails: require('./get-target-profile-details'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getTubeSkills: require('./get-tube-skills'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getFrameworks: require('./get-frameworks'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getFrameworkAreas: require('./get-framework-areas'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getAccountRecoveryDetails: require('./account-recovery/get-account-recovery-details'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getParticipationsCountByMasteryRate: require('./get-participations-count-by-mastery-rate'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    findUserAuthenticationMethods: require('./find-user-authentication-methods'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getUserByResetPasswordDemand: require('./get-user-by-reset-password-demand'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getUserCampaignAssessmentResult: require('./get-user-campaign-assessment-result'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getUserCampaignParticipationToCampaign: require('./get-user-campaign-participation-to-campaign'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getUserCertificationEligibility: require('./get-user-certification-eligibility'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getUserDetailsForAdmin: require('./get-user-details-for-admin'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getUserProfile: require('./get-user-profile'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getUserProfileSharedForCampaign: require('./get-user-profile-shared-for-campaign'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getUserWithMemberships: require('./get-user-with-memberships'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    importCertificationCandidatesFromCandidatesImportSheet: require('./import-certification-candidates-from-candidates-import-sheet'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    importSupOrganizationLearners: require('./import-sup-organization-learners'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    importOrganizationLearnersFromSIECLEFormat: require('./import-organization-learners-from-siecle'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    improveCompetenceEvaluation: require('./improve-competence-evaluation'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    linkUserToSessionCertificationCandidate: require('./link-user-to-session-certification-candidate')
      .linkUserToSessionCertificationCandidate,
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    markTargetProfileAsSimplifiedAccess: require('./mark-target-profile-as-simplified-access'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    manuallyResolveCertificationIssueReport: require('./manually-resolve-certification-issue-report'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    neutralizeChallenge: require('./neutralize-challenge'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    publishSession: require('./publish-session'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    publishSessionsInBatch: require('./publish-sessions-in-batch'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    reconcileScoOrganizationLearnerManually: require('./reconcile-sco-organization-learner-manually'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    reconcileSupOrganizationLearner: require('./reconcile-sup-organization-learner'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    reconcileScoOrganizationLearnerAutomatically: require('./reconcile-sco-organization-learner-automatically'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    rememberUserHasSeenAssessmentInstructions: require('./remember-user-has-seen-assessment-instructions'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    rememberUserHasSeenChallengeTooltip: require('./remember-user-has-seen-challenge-tooltip'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    rememberUserHasSeenNewDashboardInfo: require('./remember-user-has-seen-new-dashboard-info'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    removeAuthenticationMethod: require('./remove-authentication-method'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    replaceSupOrganizationLearners: require('./replace-sup-organization-learner'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    resetScorecard: require('./reset-scorecard'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    retrieveLastOrCreateCertificationCourse: require('./retrieve-last-or-create-certification-course'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    revokeRefreshToken: require('./revoke-refresh-token'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    saveAdminMember: require('./save-admin-member'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    saveCertificationIssueReport: require('./save-certification-issue-report'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    saveJuryComplementaryCertificationCourseResult: require('./save-jury-complementary-certification-course-result'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    sendEmailForAccountRecovery: require('./account-recovery/send-email-for-account-recovery'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    sendScoInvitation: require('./send-sco-invitation'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    sendVerificationCode: require('./send-verification-code'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    shareCampaignResult: require('./share-campaign-result'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    startCampaignParticipation: require('./start-campaign-participation'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    startOrResumeCompetenceEvaluation: require('./start-or-resume-competence-evaluation'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    startWritingCampaignAssessmentResultsToStream: require('./start-writing-campaign-assessment-results-to-stream'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    startWritingCampaignProfilesCollectionResultsToStream: require('./start-writing-campaign-profiles-collection-results-to-stream'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    superviseSession: require('./supervise-session'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    unarchiveCampaign: require('./unarchive-campaign'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    unpublishSession: require('./unpublish-session'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    reassignAuthenticationMethodToAnotherUser: require('./reassign-authentication-method-to-another-user'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    updateAdminMember: require('./update-admin-member'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    deactivateAdminMember: require('./deactivate-admin-member'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    updateBadge: require('./update-badge'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    updateCampaign: require('./update-campaign'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    updateCampaignDetailsManagement: require('./update-campaign-details-management'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    updateCertificationCenter: require('./update-certification-center'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    updateExpiredPassword: require('./update-expired-password'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    updateLastQuestionState: require('./update-last-question-state'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    updateMembership: require('./update-membership'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    updateOrganizationInformation: require('./update-organization-information'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    updateParticipantExternalId: require('./update-participant-external-id'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    uncancelCertificationCourse: require('./uncancel-certification-course'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    updateOrganizationLearnerDependentUserPassword: require('./update-organization-learner-dependent-user-password'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    updateSession: require('./update-session'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    updateStage: require('./update-stage'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    updateStudentNumber: require('./update-student-number'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    updateTargetProfile: require('./update-target-profile'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    updateUserForAccountRecovery: require('./account-recovery/update-user-for-account-recovery'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    updateUserDetailsForAdministration: require('./update-user-details-for-administration'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    updateUserEmailWithValidation: require('./update-user-email-with-validation'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    updateUserPassword: require('./update-user-password'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    getOrganizationPlacesCapacity: require('./get-organization-places-capacity'),
  },
  dependencies
);
