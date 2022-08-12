// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'status'.
const { status } = require('./AssessmentResult');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationAssessmentScore {
  competenceMarks: $TSFixMe;
  hasEnoughNonNeutralizedChallengesToBeTrusted: $TSFixMe;
  percentageCorrectAnswers: $TSFixMe;
  constructor({
    competenceMarks = [],
    percentageCorrectAnswers = 0,
    hasEnoughNonNeutralizedChallengesToBeTrusted
  }: $TSFixMe = {}) {
    this.competenceMarks = competenceMarks;
    this.percentageCorrectAnswers = percentageCorrectAnswers;
    this.hasEnoughNonNeutralizedChallengesToBeTrusted = hasEnoughNonNeutralizedChallengesToBeTrusted;
  }

  get nbPix() {
    if (_.isEmpty(this.competenceMarks)) {
      return 0;
    }
    return _.sumBy(this.competenceMarks, 'score');
  }

  get status() {
    if (this.nbPix === 0) {
      return status.REJECTED;
    }
    return status.VALIDATED;
  }

  getCompetenceMarks() {
    return this.competenceMarks;
  }

  getPercentageCorrectAnswers() {
    return this.percentageCorrectAnswers;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationAssessmentScore;
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports.statuses = status;
