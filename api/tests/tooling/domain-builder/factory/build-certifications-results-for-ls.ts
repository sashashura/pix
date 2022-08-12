// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const { databaseBuilder, learningContentBuilder, mockLearningContent } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'status'.
const { status } = require('../../../../lib/domain/models/AssessmentResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');

const assessmentCreatedDate = new Date('2020-04-19');
const assessmentBeforeCreatedDate = new Date('2020-04-18');
const assessmentBeforeBeforeCreatedDate = new Date('2020-04-17');
const type = Assessment.types.CERTIFICATION;

function buildUser() {
  return databaseBuilder.factory.buildUser();
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildOrgan... Remove this comment to see the full error message
function buildOrganizationLearner({
  userId,
  organizationId,
  isDisabled
}: $TSFixMe) {
  return databaseBuilder.factory.buildOrganizationLearner({ userId, organizationId, isDisabled });
}

function _createCertificationCenter() {
  const { id, name } = databaseBuilder.factory.buildCertificationCenter({ name: 'Certif College' });
  return { certificationCenterId: id, certificationCenter: name };
}

function _buildCertificationData({
  user,
  organizationLearner,
  certificationCreatedDate,
  isPublished,
  isCancelled,
  verificationCode
}: $TSFixMe) {
  // @ts-expect-error TS(2339): Property 'id' does not exist on type '{ certificat... Remove this comment to see the full error message
  const { id: certificationCenterId, name: certificationCenter } = _createCertificationCenter();

  const session = databaseBuilder.factory.buildSession({
    certificationCenterId,
    certificationCenter,
  });

  databaseBuilder.factory.buildCertificationCandidate({
    sessionId: session.id,
    organizationLearnerId: organizationLearner.id,
    firstName: organizationLearner.firstName,
    lastName: organizationLearner.lastName,
    birthdate: organizationLearner.birthdate,
    userId: user.id,
  });

  const certificationCourse = databaseBuilder.factory.buildCertificationCourse({
    userId: user.id,
    firstName: organizationLearner.firstName,
    lastName: organizationLearner.lastName,
    birthdate: organizationLearner.birthdate,
    sessionId: session.id,
    isPublished,
    createdAt: certificationCreatedDate || new Date(),
    verificationCode,
    isCancelled,
  });

  databaseBuilder.factory.buildCertificationCourse({
    userId: user.id,
    firstName: organizationLearner.firstName,
    lastName: organizationLearner.lastName,
    birthdate: organizationLearner.birthdate,
    sessionId: session.id,
    isPublished: false,
    isCancelled,
  });

  const assessment = databaseBuilder.factory.buildAssessment({
    certificationCourseId: certificationCourse.id,
    firstName: organizationLearner.firstName,
    lastName: organizationLearner.lastName,
    birthdate: organizationLearner.birthdate,
    userId: user.id,
    type,
  });

  return {
    session,
    certificationCourse,
    assessmentId: assessment.id,
  };
}

function _createAssessmentResultWithCompetenceMarks({
  assessmentId,
  pixScore = 500,
  status,
  createdAt,
  competenceMarks = [{}, {}]
}: $TSFixMe) {
  const assessmentResult = databaseBuilder.factory.buildAssessmentResult({
    assessmentId,
    pixScore,
    status,
    createdAt,
  });

  // @ts-expect-error TS(7006): Parameter 'cm' implicitly has an 'any' type.
  competenceMarks.forEach((cm) => {
    databaseBuilder.factory.buildCompetenceMark({
      assessmentResultId: assessmentResult.id,
      competence_code: cm.code,
      level: cm.level,
    });
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildOrgan... Remove this comment to see the full error message
function buildOrganization(uai: $TSFixMe) {
  return databaseBuilder.factory.buildOrganization({ externalId: uai });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCance... Remove this comment to see the full error message
function buildCancelledCertificationData({
  user,
  organizationLearner,
  verificationCode,
  pixScore,
  competenceMarks,
  certificationCreatedDate
}: $TSFixMe) {
  return _buildValidatedCertificationData({
    user,
    organizationLearner,
    verificationCode,
    pixScore,
    certificationCreatedDate,
    competenceMarks,
    isPublished: false,
    isCancelled: true,
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildValid... Remove this comment to see the full error message
function buildValidatedPublishedCertificationData({
  user,
  organizationLearner,
  verificationCode,
  pixScore,
  competenceMarks,
  certificationCreatedDate
}: $TSFixMe) {
  return _buildValidatedCertificationData({
    user,
    organizationLearner,
    verificationCode,
    pixScore,
    certificationCreatedDate,
    competenceMarks,
    isPublished: true,
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildValid... Remove this comment to see the full error message
function buildValidatedUnpublishedCertificationData({
  user,
  organizationLearner,
  verificationCode,
  pixScore,
  competenceMarks,
  certificationCreatedDate
}: $TSFixMe) {
  return _buildValidatedCertificationData({
    user,
    organizationLearner,
    verificationCode,
    pixScore,
    certificationCreatedDate,
    competenceMarks,
    isPublished: false,
  });
}

function _buildValidatedCertificationData({
  user,
  organizationLearner,
  verificationCode,
  pixScore,
  competenceMarks,
  certificationCreatedDate,
  isPublished,
  isCancelled = false
}: $TSFixMe) {
  const certificationStatus = status.VALIDATED;
  const { session, certificationCourse, assessmentId } = _buildCertificationData({
    user,
    organizationLearner,
    verificationCode,
    type,
    pixScore,
    isPublished,
    isCancelled,
    certificationCreatedDate,
  });

  _createAssessmentResultWithCompetenceMarks({
    assessmentId,
    pixScore,
    status: certificationStatus,
    createdAt: assessmentCreatedDate,
    competenceMarks,
  });

  _createAssessmentResultWithCompetenceMarks({
    assessmentId,
    pixScore,
    status: certificationStatus,
    createdAt: assessmentBeforeCreatedDate,
  });

  databaseBuilder.factory.buildAssessmentResult({
    assessmentId,
    pixScore,
    status: certificationStatus,
    createdAt: assessmentBeforeBeforeCreatedDate,
  });

  return {
    session,
    certificationCourse,
  };
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildRejec... Remove this comment to see the full error message
function buildRejectedPublishedCertificationData({
  user,
  organizationLearner,
  competenceMarks,
  certificationCreationDate
}: $TSFixMe) {
  const certificationStatus = status.REJECTED;
  const { assessmentId } = _buildCertificationData({
    user,
    organizationLearner,
    isPublished: true,
    createdAt: certificationCreationDate,
  });

  _createAssessmentResultWithCompetenceMarks({
    assessmentId,
    status: certificationStatus,
    createdAt: assessmentCreatedDate,
    competenceMarks,
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildError... Remove this comment to see the full error message
function buildErrorUnpublishedCertificationData({
  user,
  organizationLearner,
  competenceMarks
}: $TSFixMe) {
  const certificationStatus = status.REJECTED;
  const { assessmentId } = _buildCertificationData({
    user,
    organizationLearner,
    isPublished: false,
  });

  _createAssessmentResultWithCompetenceMarks({
    assessmentId,
    status: certificationStatus,
    createdAt: assessmentCreatedDate,
    competenceMarks,
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCerti... Remove this comment to see the full error message
function buildCertificationDataWithNoCompetenceMarks({
  user,
  organizationLearner
}: $TSFixMe) {
  const certificationStatus = status.REJECTED;
  const { assessmentId } = _buildCertificationData({
    user,
    organizationLearner,
    publicationDate: null,
  });

  databaseBuilder.factory.buildAssessmentResult({
    assessmentId,
    status: certificationStatus,
    createdAt: assessmentBeforeBeforeCreatedDate,
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
function mockLearningContentCompetences() {
  const learningContent = [
    {
      id: 'rec99',
      code: '2',
      titleFr: 'Communication et collaboration',
      competences: [
        {
          id: 'rec50',
          index: '2.1',
          name: 'Interagir',
          tubes: [],
        },
        {
          id: 'rec51',
          index: '2.2',
          name: 'Partager et publier',
          tubes: [],
        },
        {
          id: 'rec52',
          index: '2.3',
          name: 'Collaborer',
          tubes: [],
        },
      ],
    },
    {
      id: 'rec98',
      code: '3',
      titleFr: 'Création de contenu',
      competences: [
        {
          id: 'rec53',
          index: '3.1',
          name: 'Développer des documents textuels',
          tubes: [],
        },
        {
          id: 'rec54',
          index: '3.2',
          name: 'Développer des documents multimedia',
          tubes: [],
        },
      ],
    },
    {
      id: 'rec97',
      code: '1',
      titleFr: 'Information et données',
      competences: [
        {
          id: 'rec55',
          index: '1.1',
          name: 'Mener une recherche et une veille d’information',
          tubes: [],
        },
        {
          id: 'rec56',
          index: '1.2',
          name: 'Gérer des données',
          tubes: [],
        },
      ],
    },
  ];

  const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
  mockLearningContent(learningContentObjects);
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  buildValidatedPublishedCertificationData,
  buildValidatedUnpublishedCertificationData,
  buildCancelledCertificationData,
  buildRejectedPublishedCertificationData,
  buildErrorUnpublishedCertificationData,
  buildCertificationDataWithNoCompetenceMarks,
  mockLearningContentCompetences,
  buildOrganization,
  buildUser,
  buildOrganizationLearner,
};
