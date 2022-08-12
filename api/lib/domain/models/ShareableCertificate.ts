// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ShareableC... Remove this comment to see the full error message
class ShareableCertificate {
  birthdate: $TSFixMe;
  birthplace: $TSFixMe;
  certificationCenter: $TSFixMe;
  certifiedBadgeImages: $TSFixMe;
  cleaCertificationResult: $TSFixMe;
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
    cleaCertificationResult,
    certifiedBadgeImages,
    resultCompetenceTree = null,
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
    this.cleaCertificationResult = cleaCertificationResult;
    this.certifiedBadgeImages = certifiedBadgeImages;
    this.resultCompetenceTree = resultCompetenceTree;
    this.maxReachableLevelOnCertificationDate = maxReachableLevelOnCertificationDate;
  }

  setResultCompetenceTree(resultCompetenceTree: $TSFixMe) {
    this.resultCompetenceTree = resultCompetenceTree;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ShareableCertificate;
