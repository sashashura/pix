// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceMark = require('./CompetenceMark');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'status'.
const status = {
  CANCELLED: 'cancelled',
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'JuryCertif... Remove this comment to see the full error message
class JuryCertification {
  assessmentId: $TSFixMe;
  birthCountry: $TSFixMe;
  birthINSEECode: $TSFixMe;
  birthPostalCode: $TSFixMe;
  birthdate: $TSFixMe;
  birthplace: $TSFixMe;
  certificationCourseId: $TSFixMe;
  certificationIssueReports: $TSFixMe;
  commentForCandidate: $TSFixMe;
  commentForJury: $TSFixMe;
  commentForOrganization: $TSFixMe;
  commonComplementaryCertificationCourseResults: $TSFixMe;
  competenceMarks: $TSFixMe;
  complementaryCertificationCourseResultsWithExternal: $TSFixMe;
  completedAt: $TSFixMe;
  createdAt: $TSFixMe;
  firstName: $TSFixMe;
  isPublished: $TSFixMe;
  juryId: $TSFixMe;
  lastName: $TSFixMe;
  pixScore: $TSFixMe;
  sessionId: $TSFixMe;
  sex: $TSFixMe;
  status: $TSFixMe;
  userId: $TSFixMe;
  constructor({
    certificationCourseId,
    sessionId,
    userId,
    assessmentId,
    firstName,
    lastName,
    birthdate,
    sex,
    birthplace,
    birthINSEECode,
    birthCountry,
    birthPostalCode,
    createdAt,
    completedAt,
    status,
    isPublished,
    juryId,
    pixScore,
    competenceMarks,
    commentForCandidate,
    commentForOrganization,
    commentForJury,
    certificationIssueReports,
    complementaryCertificationCourseResultsWithExternal,
    commonComplementaryCertificationCourseResults
  }: $TSFixMe) {
    this.certificationCourseId = certificationCourseId;
    this.sessionId = sessionId;
    this.userId = userId;
    this.assessmentId = assessmentId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.sex = sex;
    this.birthplace = birthplace;
    this.birthINSEECode = birthINSEECode;
    this.birthCountry = birthCountry;
    this.birthPostalCode = birthPostalCode;
    this.createdAt = createdAt;
    this.completedAt = completedAt;
    this.status = status;
    this.isPublished = isPublished;
    this.juryId = juryId;
    this.pixScore = pixScore;
    this.competenceMarks = competenceMarks;
    this.commentForCandidate = commentForCandidate;
    this.commentForOrganization = commentForOrganization;
    this.commentForJury = commentForJury;
    this.certificationIssueReports = certificationIssueReports;
    this.complementaryCertificationCourseResultsWithExternal = complementaryCertificationCourseResultsWithExternal;
    this.commonComplementaryCertificationCourseResults = commonComplementaryCertificationCourseResults;
  }

  static from({
    juryCertificationDTO,
    certificationIssueReports,
    competenceMarkDTOs,
    complementaryCertificationCourseResultsWithExternal,
    commonComplementaryCertificationCourseResults
  }: $TSFixMe) {
    const competenceMarks = competenceMarkDTOs.map(
      (competenceMarkDTO: $TSFixMe) => new CompetenceMark({
        ...competenceMarkDTO,
      })
    );

    return new JuryCertification({
      certificationCourseId: juryCertificationDTO.certificationCourseId,
      sessionId: juryCertificationDTO.sessionId,
      userId: juryCertificationDTO.userId,
      assessmentId: juryCertificationDTO.assessmentId,
      firstName: juryCertificationDTO.firstName,
      lastName: juryCertificationDTO.lastName,
      birthdate: juryCertificationDTO.birthdate,
      sex: juryCertificationDTO.sex,
      birthplace: juryCertificationDTO.birthplace,
      birthINSEECode: juryCertificationDTO.birthINSEECode,
      birthCountry: juryCertificationDTO.birthCountry,
      birthPostalCode: juryCertificationDTO.birthPostalCode,
      createdAt: juryCertificationDTO.createdAt,
      completedAt: juryCertificationDTO.completedAt,
      status: _getStatus(juryCertificationDTO.assessmentResultStatus, juryCertificationDTO.isCancelled),
      isPublished: juryCertificationDTO.isPublished,
      juryId: juryCertificationDTO.juryId,
      pixScore: juryCertificationDTO.pixScore,
      competenceMarks,
      commentForCandidate: juryCertificationDTO.commentForCandidate,
      commentForOrganization: juryCertificationDTO.commentForOrganization,
      commentForJury: juryCertificationDTO.commentForJury,
      certificationIssueReports,
      complementaryCertificationCourseResultsWithExternal,
      commonComplementaryCertificationCourseResults,
    });
  }
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _getStatus(assessmentResultStatus: $TSFixMe, isCourseCancelled: $TSFixMe) {
  if (isCourseCancelled) return status.CANCELLED;
  return assessmentResultStatus;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = JuryCertification;
