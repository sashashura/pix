// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MINIMUM_RE... Remove this comment to see the full error message
const { MINIMUM_REPRODUCIBILITY_RATE_TO_BE_CERTIFIED } = require('../constants');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Reproducib... Remove this comment to see the full error message
class ReproducibilityRate {
  value: $TSFixMe;
  constructor(value: $TSFixMe) {
    this.value = value;
  }

  static from({
    numberOfNonNeutralizedChallenges,
    numberOfCorrectAnswers
  }: $TSFixMe) {
    if (numberOfNonNeutralizedChallenges === 0) return new ReproducibilityRate(0);
    return new ReproducibilityRate(Math.round((numberOfCorrectAnswers / numberOfNonNeutralizedChallenges) * 100));
  }

  isEnoughToBeCertified() {
    return this.value >= MINIMUM_REPRODUCIBILITY_RATE_TO_BE_CERTIFIED;
  }

  isEqualOrAbove(value: $TSFixMe) {
    return this.value >= value;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  ReproducibilityRate,
};
