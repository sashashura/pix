// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCourse = require('../../../../lib/domain/models/CertificationCourse');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildAssessment = require('./build-assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationIssueReport = require('../../../../lib/domain/models/CertificationIssueReport');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationIssueReportCategories,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/models/CertificationIssueReportCategory');

function buildCertificationCourse({
  id = 123,
  firstName = 'Gandhi',
  lastName = 'Matmatah',
  birthplace = 'Perpignan',
  birthdate = '1985-01-20',
  sex = 'F',
  birthPostalCode = '75005',
  birthINSEECode = null,
  birthCountry = 'FRANCE',
  createdAt = new Date('2020-01-01'),
  completedAt = new Date('2020-02-01'),
  externalId = 'externalId',
  examinerComment = 'A cassé le clavier',
  hasSeenEndTestScreen = false,
  nbChallenges = 15,
  isV2Certification = false,
  isPublished = false,
  verificationCode = 'P-ABCD1234',
  // @ts-expect-error TS(2683): 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  assessment = buildAssessment({ certificationCourseId: this.id }),
  challenges = [],
  userId = 456,
  sessionId = 789,
  isCancelled = false,
  abortReason = null,
  complementaryCertificationCourses = [],
} = {}) {
  const certificationIssueReports = [];
  if (examinerComment && examinerComment !== '') {
    certificationIssueReports.push(
      new CertificationIssueReport({
        id: 159,
        certificationCourseId: id,
        category: CertificationIssueReportCategories.OTHER,
        description: examinerComment,
      })
    );
  }

  return new CertificationCourse({
    id,
    firstName,
    lastName,
    birthdate,
    birthplace,
    birthPostalCode,
    birthINSEECode,
    birthCountry,
    sex,
    createdAt,
    completedAt,
    externalId,
    certificationIssueReports,
    hasSeenEndTestScreen,
    nbChallenges,
    isV2Certification,
    isPublished,
    verificationCode,
    assessment,
    challenges,
    sessionId,
    userId,
    isCancelled,
    abortReason,
    complementaryCertificationCourses,
  });
}

buildCertificationCourse.unpersisted = function ({
  firstName = 'Gandhi',
  lastName = 'Matmatah',
  birthplace = 'Perpignan',
  birthdate = '1985-01-20',
  sex = 'F',
  birthPostalCode = '75005',
  birthINSEECode = null,
  birthCountry = 'FRANCE',
  createdAt = new Date('2020-01-01'),
  completedAt = new Date('2020-02-01'),
  externalId = 'externalId',
  hasSeenEndTestScreen = false,
  nbChallenges = 15,
  isV2Certification = false,
  isPublished = false,
  verificationCode = 'P-ABCD1234',
  // @ts-expect-error TS(2683): 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  assessment = buildAssessment({ certificationCourseId: this.id }),
  challenges = [],
  userId = 456,
  sessionId = 789,
  isCancelled = false,
  abortReason = null,
  complementaryCertificationCourses = [],
} = {}) {
  return new CertificationCourse({
    firstName,
    lastName,
    birthdate,
    birthplace,
    birthPostalCode,
    birthINSEECode,
    birthCountry,
    sex,
    createdAt,
    completedAt,
    externalId,
    certificationIssueReports: [],
    hasSeenEndTestScreen,
    nbChallenges,
    isV2Certification,
    isPublished,
    verificationCode,
    assessment,
    challenges,
    sessionId,
    userId,
    isCancelled,
    abortReason,
    complementaryCertificationCourses,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildCertificationCourse;
