// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'JuryCertif... Remove this comment to see the full error message
const JuryCertification = require('../../../../lib/domain/models/JuryCertification');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildCertificationIssueReport = require('./build-certification-issue-report');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCompe... Remove this comment to see the full error message
const buildCompetenceMark = require('./build-competence-mark');

const buildJuryCertification = function ({
  certificationCourseId = 123,
  sessionId = 456,
  userId = 789,
  assessmentId = 159,
  firstName = 'Malik',
  lastName = 'Wayne',
  birthplace = 'Torreilles',
  birthdate = '2000-08-30',
  birthINSEECode = '66212',
  birthPostalCode = null,
  birthCountry = 'France',
  sex = 'M',
  status = 'validated',
  isPublished = true,
  createdAt = new Date('2020-01-01'),
  completedAt = new Date('2020-02-01'),
  pixScore = 55,
  juryId = 66,
  commentForCandidate = 'comment candidate',
  commentForOrganization = 'comment organization',
  commentForJury = 'comment jury',
  competenceMarks = [buildCompetenceMark()],
  certificationIssueReports = [buildCertificationIssueReport()],
  commonComplementaryCertificationCourseResults = [],
  complementaryCertificationCourseResultsWithExternal = {},
} = {}) {
  return new JuryCertification({
    certificationCourseId,
    sessionId,
    userId,
    assessmentId,
    firstName,
    lastName,
    birthplace,
    birthdate,
    birthINSEECode,
    birthPostalCode,
    birthCountry,
    sex,
    status,
    isPublished,
    createdAt,
    completedAt,
    pixScore,
    juryId,
    commentForCandidate,
    commentForOrganization,
    commentForJury,
    competenceMarks,
    certificationIssueReports,
    commonComplementaryCertificationCourseResults,
    complementaryCertificationCourseResultsWithExternal,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildJuryCertification;
