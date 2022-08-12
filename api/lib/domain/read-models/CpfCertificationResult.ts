// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EuropeanNu... Remove this comment to see the full error message
const EuropeanNumericLevelFactory = require('./EuropeanNumericLevelFactory');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CpfCertifi... Remove this comment to see the full error message
class CpfCertificationResult {
  birthINSEECode: $TSFixMe;
  birthPostalCode: $TSFixMe;
  birthdate: $TSFixMe;
  competenceMarks: $TSFixMe;
  firstName: $TSFixMe;
  id: $TSFixMe;
  lastName: $TSFixMe;
  pixScore: $TSFixMe;
  publishedAt: $TSFixMe;
  sex: $TSFixMe;
  constructor({
    id,
    firstName,
    lastName,
    birthdate,
    sex,
    birthINSEECode,
    birthPostalCode,
    publishedAt,
    pixScore,
    competenceMarks
  }: $TSFixMe = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.sex = sex;
    this.birthINSEECode = birthINSEECode;
    this.birthPostalCode = birthPostalCode;
    this.publishedAt = publishedAt;
    this.pixScore = pixScore;
    this.competenceMarks = competenceMarks;
  }

  get europeanNumericLevels() {
    return EuropeanNumericLevelFactory.buildFromCompetenceMarks(this.competenceMarks);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CpfCertificationResult;
