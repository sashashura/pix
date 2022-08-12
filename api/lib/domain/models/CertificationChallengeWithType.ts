// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Type'.
const { Type } = require('./Challenge');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationChallengeWithType {
  associatedSkillName: $TSFixMe;
  certifiableBadgeKey: $TSFixMe;
  challengeId: $TSFixMe;
  competenceId: $TSFixMe;
  hasBeenSkippedAutomatically: $TSFixMe;
  id: $TSFixMe;
  isNeutralized: $TSFixMe;
  type: $TSFixMe;
  constructor({
    id,
    associatedSkillName,
    challengeId,
    type,
    competenceId,
    isNeutralized,
    hasBeenSkippedAutomatically,
    certifiableBadgeKey
  }: $TSFixMe = {}) {
    this.id = id;
    this.associatedSkillName = associatedSkillName;
    this.challengeId = challengeId;
    const possibleTypeValues = Object.values(Type);
    this.type = possibleTypeValues.includes(type) ? type : 'EmptyType';
    this.competenceId = competenceId;
    this.isNeutralized = isNeutralized;
    this.hasBeenSkippedAutomatically = hasBeenSkippedAutomatically;
    this.certifiableBadgeKey = certifiableBadgeKey;
  }

  neutralize() {
    this.isNeutralized = true;
  }

  deneutralize() {
    this.isNeutralized = false;
  }

  isPixPlus() {
    return Boolean(this.certifiableBadgeKey);
  }

  skipAutomatically() {
    this.hasBeenSkippedAutomatically = true;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationChallengeWithType;
