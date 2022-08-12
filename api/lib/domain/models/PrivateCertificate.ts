// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const { status: assessmentResultStatuses } = require('./AssessmentResult');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'status'.
const status = {
  REJECTED: 'rejected',
  VALIDATED: 'validated',
  ERROR: 'error',
  CANCELLED: 'cancelled',
  STARTED: 'started',
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PrivateCer... Remove this comment to see the full error message
class PrivateCertificate {
  static status = status;

  birthdate: $TSFixMe;
  birthplace: $TSFixMe;
  certificationCenter: $TSFixMe;
  certifiedBadgeImages: $TSFixMe;
  cleaCertificationResult: $TSFixMe;
  commentForCandidate: $TSFixMe;
  date: $TSFixMe;
  deliveredAt: $TSFixMe;
  firstName: $TSFixMe;
  id: $TSFixMe;
  isPublished: $TSFixMe;
  lastName: $TSFixMe;
  maxReachableLevelOnCertificationDate: $TSFixMe;
  pixScore: $TSFixMe;
  resultCompetenceTree: $TSFixMe;
  userId: $TSFixMe;
  verificationCode: $TSFixMe;

  constructor({
    id,
    firstName,
    lastName,
    birthdate,
    birthplace,
    isPublished,
    userId,
    date,
    deliveredAt,
    certificationCenter,
    pixScore,
    status,
    commentForCandidate,
    cleaCertificationResult,
    certifiedBadgeImages,
    resultCompetenceTree = null,
    verificationCode,
    maxReachableLevelOnCertificationDate
  }: $TSFixMe = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.birthplace = birthplace;
    this.isPublished = isPublished;
    this.userId = userId;
    this.date = date;
    this.deliveredAt = deliveredAt;
    this.certificationCenter = certificationCenter;
    this.pixScore = pixScore;
    // @ts-expect-error TS(2576): Property 'status' does not exist on type 'PrivateC... Remove this comment to see the full error message
    this.status = status;
    this.commentForCandidate = commentForCandidate;
    this.cleaCertificationResult = cleaCertificationResult;
    this.certifiedBadgeImages = certifiedBadgeImages;
    this.resultCompetenceTree = resultCompetenceTree;
    this.verificationCode = verificationCode;
    this.maxReachableLevelOnCertificationDate = maxReachableLevelOnCertificationDate;
  }

  static buildFrom({
    id,
    firstName,
    lastName,
    birthdate,
    birthplace,
    isPublished,
    userId,
    date,
    deliveredAt,
    certificationCenter,
    pixScore,
    commentForCandidate,
    cleaCertificationResult,
    certifiedBadgeImages,
    resultCompetenceTree = null,
    verificationCode,
    maxReachableLevelOnCertificationDate,
    assessmentResultStatus,
    isCancelled
  }: $TSFixMe) {
    const status = _computeStatus(assessmentResultStatus, isCancelled);
    return new PrivateCertificate({
      id,
      firstName,
      lastName,
      birthdate,
      birthplace,
      isPublished,
      userId,
      date,
      deliveredAt,
      certificationCenter,
      pixScore,
      commentForCandidate,
      cleaCertificationResult,
      certifiedBadgeImages,
      resultCompetenceTree,
      verificationCode,
      maxReachableLevelOnCertificationDate,
      status,
    });
  }

  setResultCompetenceTree(resultCompetenceTree: $TSFixMe) {
    this.resultCompetenceTree = resultCompetenceTree;
  }
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _computeStatus(assessmentResultStatus: $TSFixMe, isCancelled: $TSFixMe) {
  if (isCancelled) return status.CANCELLED;
  if (assessmentResultStatus === assessmentResultStatuses.VALIDATED) return status.VALIDATED;
  if (assessmentResultStatus === assessmentResultStatuses.REJECTED) return status.REJECTED;
  if (assessmentResultStatus === assessmentResultStatuses.ERROR) return status.ERROR;
  return (status as $TSFixMe).STARTED;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = PrivateCertificate;
