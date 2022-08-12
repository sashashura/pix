// @ts-expect-error TS(2300): Duplicate identifier 'Certificate'.
class Certificate {
  birthdate: $TSFixMe;
  certificationCenter: $TSFixMe;
  competenceResults: $TSFixMe;
  date: $TSFixMe;
  deliveredAt: $TSFixMe;
  firstName: $TSFixMe;
  id: $TSFixMe;
  lastName: $TSFixMe;
  middleName: $TSFixMe;
  nationalStudentId: $TSFixMe;
  pixScore: $TSFixMe;
  status: $TSFixMe;
  thirdName: $TSFixMe;
  verificationCode: $TSFixMe;
  constructor({
    id,
    firstName,
    middleName,
    thirdName,
    lastName,
    birthdate,
    nationalStudentId,
    status,
    pixScore,
    verificationCode,
    date,
    deliveredAt,
    certificationCenter,
    competenceResults = []
  }: $TSFixMe = {}) {
    this.id = id;
    this.firstName = firstName;
    this.middleName = middleName;
    this.thirdName = thirdName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.nationalStudentId = nationalStudentId;
    this.date = date;
    this.deliveredAt = deliveredAt;
    this.pixScore = pixScore;
    this.status = status;
    this.certificationCenter = certificationCenter;
    this.competenceResults = competenceResults;
    this.verificationCode = verificationCode;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Certificate;
