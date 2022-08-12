// @ts-expect-error TS(6200): Definitions of the following identifiers conflict ... Remove this comment to see the full error message
const _ = require('lodash');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_SUC... Remove this comment to see the full error message
  CERTIF_SUCCESS_USER_ID,
  CERTIF_SCO_STUDENT_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_FAI... Remove this comment to see the full error message
  CERTIF_FAILURE_USER_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_REG... Remove this comment to see the full error message
  CERTIF_REGULAR_USER5_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_EDU... Remove this comment to see the full error message
  CERTIF_EDU_FORMATION_INITIALE_1ER_DEGRE_USER_ID,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('./users');
const {
  TO_FINALIZE_SESSION_ID,
  NO_PROBLEM_FINALIZED_SESSION_ID,
  PROBLEMS_FINALIZED_SESSION_ID,
  PUBLISHED_SESSION_ID,
  PUBLISHED_SCO_SESSION_ID,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('./certification-sessions-builder');
const {
  CANDIDATE_DATA_SUCCESS,
  CANDIDATE_DATA_FAILURE,
  CANDIDATE_DATA_STARTED,
  CANDIDATE_SCO_DATA_SUCCESS,
  CANDIDATE_DATA_EDU,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('./certification-candidates-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIFICAT... Remove this comment to see the full error message
const { CERTIFICATION_CHALLENGES_DATA } = require('./certification-data');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationIssueReportCategories,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('./../../../../lib/domain/models/CertificationIssueReportCategory');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateCe... Remove this comment to see the full error message
  generateCertificateVerificationCode,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/services/verify-certificate-code-service');

const ASSESSMENT_SUCCESS_IN_SESSION_TO_FINALIZE_ID = 100;
const ASSESSMENT_FAILURE_IN_SESSION_TO_FINALIZE_ID = 101;
const ASSESSMENT_SUCCESS_IN_NO_PROBLEM_FINALIZED_SESSION_ID = 102;
const ASSESSMENT_FAILURE_IN_NO_PROBLEM_FINALIZED_SESSION_ID = 103;
const ASSESSMENT_SUCCESS_IN_PROBLEMS_FINALIZED_SESSION_ID = 104;
const ASSESSMENT_FAILURE_IN_PROBLEMS_FINALIZED_SESSION_ID = 105;
const ASSESSMENT_STARTED_IN_PROBLEMS_FINALIZED_SESSION_ID = 106;
const ASSESSMENT_SUCCESS_PUBLISHED_SESSION_ID = 107;
const ASSESSMENT_FAILURE_PUBLISHED_SESSION_ID = 108;
const ASSESSMENT_SUCCESS_PUBLISHED_SESSION_SCO_ID = 109;
const ASSESSMENT_EDU_PUBLISHED_SESSION_ID = 110;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIFICAT... Remove this comment to see the full error message
const CERTIFICATION_COURSE_SUCCESS_ID = 200;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIFICAT... Remove this comment to see the full error message
const CERTIFICATION_COURSE_FAILURE_ID = 403;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIFICAT... Remove this comment to see the full error message
const CERTIFICATION_COURSE_EDU_ID = 505;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
async function certificationCoursesBuilder({
  databaseBuilder
}: $TSFixMe) {
  // Each certification tests present the same questions
  const certificationInformations = [
    {
      userId: CERTIF_SUCCESS_USER_ID,
      sessionId: TO_FINALIZE_SESSION_ID,
      assessmentId: ASSESSMENT_SUCCESS_IN_SESSION_TO_FINALIZE_ID,
      candidateData: CANDIDATE_DATA_SUCCESS,
      examinerComment: null,
      hasSeenEndTestScreen: false,
      isPublished: false,
    },
    {
      userId: CERTIF_FAILURE_USER_ID,
      sessionId: TO_FINALIZE_SESSION_ID,
      assessmentId: ASSESSMENT_FAILURE_IN_SESSION_TO_FINALIZE_ID,
      candidateData: CANDIDATE_DATA_FAILURE,
      examinerComment: null,
      hasSeenEndTestScreen: false,
      isPublished: false,
    },
    {
      userId: CERTIF_SCO_STUDENT_ID,
      sessionId: PUBLISHED_SCO_SESSION_ID,
      assessmentId: ASSESSMENT_SUCCESS_PUBLISHED_SESSION_SCO_ID,
      candidateData: CANDIDATE_SCO_DATA_SUCCESS,
      examinerComment: null,
      hasSeenEndTestScreen: true,
      isPublished: true,
    },
    {
      userId: CERTIF_SUCCESS_USER_ID,
      sessionId: NO_PROBLEM_FINALIZED_SESSION_ID,
      assessmentId: ASSESSMENT_SUCCESS_IN_NO_PROBLEM_FINALIZED_SESSION_ID,
      candidateData: CANDIDATE_DATA_SUCCESS,
      examinerComment: null,
      hasSeenEndTestScreen: true,
      isPublished: false,
    },
    {
      userId: CERTIF_FAILURE_USER_ID,
      sessionId: NO_PROBLEM_FINALIZED_SESSION_ID,
      assessmentId: ASSESSMENT_FAILURE_IN_NO_PROBLEM_FINALIZED_SESSION_ID,
      candidateData: CANDIDATE_DATA_FAILURE,
      examinerComment: null,
      hasSeenEndTestScreen: true,
      isPublished: false,
    },
    {
      userId: CERTIF_SUCCESS_USER_ID,
      sessionId: PROBLEMS_FINALIZED_SESSION_ID,
      assessmentId: ASSESSMENT_SUCCESS_IN_PROBLEMS_FINALIZED_SESSION_ID,
      candidateData: CANDIDATE_DATA_SUCCESS,
      examinerComment: 'A regardé son téléphone pendant le test',
      hasSeenEndTestScreen: true,
      isPublished: false,
    },
    {
      userId: CERTIF_FAILURE_USER_ID,
      sessionId: PROBLEMS_FINALIZED_SESSION_ID,
      assessmentId: ASSESSMENT_FAILURE_IN_PROBLEMS_FINALIZED_SESSION_ID,
      candidateData: CANDIDATE_DATA_FAILURE,
      examinerComment: 'Son ordinateur a explosé',
      hasSeenEndTestScreen: false,
      isPublished: false,
    },
    {
      userId: CERTIF_REGULAR_USER5_ID,
      sessionId: PROBLEMS_FINALIZED_SESSION_ID,
      assessmentId: ASSESSMENT_STARTED_IN_PROBLEMS_FINALIZED_SESSION_ID,
      candidateData: CANDIDATE_DATA_STARTED,
      examinerComment: 'Elle a pas fini sa certif',
      hasSeenEndTestScreen: false,
      isPublished: false,
    },
    {
      id: CERTIFICATION_COURSE_SUCCESS_ID,
      userId: CERTIF_SUCCESS_USER_ID,
      sessionId: PUBLISHED_SESSION_ID,
      assessmentId: ASSESSMENT_SUCCESS_PUBLISHED_SESSION_ID,
      candidateData: CANDIDATE_DATA_SUCCESS,
      hasSeenEndTestScreen: true,
      isPublished: true,
    },
    {
      id: CERTIFICATION_COURSE_FAILURE_ID,
      userId: CERTIF_FAILURE_USER_ID,
      sessionId: PUBLISHED_SESSION_ID,
      assessmentId: ASSESSMENT_FAILURE_PUBLISHED_SESSION_ID,
      candidateData: CANDIDATE_DATA_FAILURE,
      hasSeenEndTestScreen: true,
      isPublished: true,
    },
    {
      id: CERTIFICATION_COURSE_EDU_ID,
      userId: CERTIF_EDU_FORMATION_INITIALE_1ER_DEGRE_USER_ID,
      sessionId: PUBLISHED_SESSION_ID,
      assessmentId: ASSESSMENT_EDU_PUBLISHED_SESSION_ID,
      candidateData: CANDIDATE_DATA_EDU,
      hasSeenEndTestScreen: true,
      isPublished: true,
    },
  ];

  for (const certificationInformation of certificationInformations) {
    await _buildCertificationCourse(databaseBuilder, certificationInformation);
  }
}

async function _buildCertificationCourse(
  databaseBuilder: $TSFixMe,
  {
    id,
    assessmentId,
    userId,
    sessionId,
    candidateData,
    examinerComment,
    hasSeenEndTestScreen,
    isPublished
  }: $TSFixMe,
) {
  const createdAt = new Date('2020-01-31T00:00:00Z');
  const verificationCode = await generateCertificateVerificationCode();
  const certificationCourseId = databaseBuilder.factory.buildCertificationCourse({
    ...candidateData,
    id,
    createdAt,
    isPublished,
    isV2Certification: true,
    examinerComment,
    hasSeenEndTestScreen,
    sessionId,
    userId,
    verificationCode,
  }).id;
  if (examinerComment) {
    databaseBuilder.factory.buildCertificationIssueReport({
      certificationCourseId,
      category: CertificationIssueReportCategories.OTHER,
      description: examinerComment + ' (deuxième fois)',
    });
    databaseBuilder.factory.buildCertificationIssueReport({
      certificationCourseId,
      category: CertificationIssueReportCategories.OTHER,
      description: examinerComment + ' (première fois)',
      resolvedAt: '2020-05-01T00:00:00Z',
    });
    databaseBuilder.factory.buildCertificationIssueReport({
      certificationCourseId,
      category: CertificationIssueReportCategories.CONNECTION_OR_END_SCREEN,
      description: examinerComment,
    });
  }
  let assessmentState = 'completed';
  if (assessmentId === ASSESSMENT_STARTED_IN_PROBLEMS_FINALIZED_SESSION_ID) {
    assessmentState = 'started';
  }
  databaseBuilder.factory.buildAssessment({
    id: assessmentId,
    certificationCourseId,
    type: 'CERTIFICATION',
    state: assessmentState,
    userId,
    competenceId: null,
    campaignParticipationId: null,
    isImproving: false,
    createdAt,
  });
  _.each(CERTIFICATION_CHALLENGES_DATA, (challenge: $TSFixMe) => {
    databaseBuilder.factory.buildCertificationChallenge({
      ...challenge,
      courseId: certificationCourseId,
      associatedSkillId: null,
      createdAt,
    });
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  certificationCoursesBuilder,
  ASSESSMENT_SUCCESS_IN_SESSION_TO_FINALIZE_ID,
  ASSESSMENT_FAILURE_IN_SESSION_TO_FINALIZE_ID,
  ASSESSMENT_SUCCESS_IN_NO_PROBLEM_FINALIZED_SESSION_ID,
  ASSESSMENT_FAILURE_IN_NO_PROBLEM_FINALIZED_SESSION_ID,
  ASSESSMENT_SUCCESS_IN_PROBLEMS_FINALIZED_SESSION_ID,
  ASSESSMENT_FAILURE_IN_PROBLEMS_FINALIZED_SESSION_ID,
  ASSESSMENT_STARTED_IN_PROBLEMS_FINALIZED_SESSION_ID,
  ASSESSMENT_SUCCESS_PUBLISHED_SESSION_ID,
  ASSESSMENT_FAILURE_PUBLISHED_SESSION_ID,
  ASSESSMENT_SUCCESS_PUBLISHED_SESSION_SCO_ID,
  ASSESSMENT_EDU_PUBLISHED_SESSION_ID,
  CERTIFICATION_COURSE_FAILURE_ID,
  CERTIFICATION_COURSE_SUCCESS_ID,
  CERTIFICATION_COURSE_EDU_ID,
};
