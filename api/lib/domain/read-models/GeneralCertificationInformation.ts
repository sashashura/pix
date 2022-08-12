class GeneralCertificationInformation {
  birthCountry: $TSFixMe;
  birthINSEECode: $TSFixMe;
  birthPostalCode: $TSFixMe;
  birthdate: $TSFixMe;
  birthplace: $TSFixMe;
  certificationCourseId: $TSFixMe;
  certificationIssueReports: $TSFixMe;
  completedAt: $TSFixMe;
  createdAt: $TSFixMe;
  firstName: $TSFixMe;
  isCancelled: $TSFixMe;
  isPublished: $TSFixMe;
  lastName: $TSFixMe;
  sessionId: $TSFixMe;
  sex: $TSFixMe;
  userId: $TSFixMe;
  constructor({
    certificationCourseId,
    sessionId,
    createdAt,
    completedAt,
    isPublished,
    isCancelled,
    firstName,
    lastName,
    birthdate,
    birthplace,
    birthCountry,
    birthPostalCode,
    birthINSEECode,
    sex,
    userId,
    certificationIssueReports
  }: $TSFixMe) {
    this.certificationCourseId = certificationCourseId;

    this.sessionId = sessionId;
    this.createdAt = createdAt;
    this.completedAt = completedAt;
    this.isPublished = isPublished;
    this.isCancelled = isCancelled;

    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.birthplace = birthplace;
    this.birthPostalCode = birthPostalCode;
    this.birthINSEECode = birthINSEECode;
    this.birthCountry = birthCountry;
    this.sex = sex;
    this.userId = userId;

    this.certificationIssueReports = certificationIssueReports;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = GeneralCertificationInformation;
