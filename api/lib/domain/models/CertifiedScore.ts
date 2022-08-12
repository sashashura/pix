// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_COUNT_... Remove this comment to see the full error message
const { PIX_COUNT_BY_LEVEL } = require('../constants');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CertifiedS... Remove this comment to see the full error message
class CertifiedScore {
  value: $TSFixMe;
  constructor(value: $TSFixMe) {
    this.value = value;
  }
  static from({
    certifiedLevel,
    estimatedScore
  }: $TSFixMe) {
    if (certifiedLevel.isUncertified()) {
      return new CertifiedScore(0);
    }
    if (certifiedLevel.isDowngraded()) {
      return new CertifiedScore(estimatedScore - PIX_COUNT_BY_LEVEL);
    }
    return new CertifiedScore(estimatedScore);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  CertifiedScore,
};
