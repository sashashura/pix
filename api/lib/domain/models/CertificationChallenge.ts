// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationChallenge {
  associatedSkillId: $TSFixMe;
  associatedSkillName: $TSFixMe;
  certifiableBadgeKey: $TSFixMe;
  challengeId: $TSFixMe;
  competenceId: $TSFixMe;
  courseId: $TSFixMe;
  id: $TSFixMe;
  isNeutralized: $TSFixMe;
  constructor({
    id,
    associatedSkillName,
    associatedSkillId,
    challengeId,
    courseId,
    competenceId,
    isNeutralized,
    certifiableBadgeKey
  }: $TSFixMe = {}) {
    this.id = id;
    this.associatedSkillName = associatedSkillName;
    this.associatedSkillId = associatedSkillId;
    this.challengeId = challengeId;
    this.competenceId = competenceId;
    this.courseId = courseId;
    this.isNeutralized = isNeutralized;
    this.certifiableBadgeKey = certifiableBadgeKey;
  }

  static createForPixCertification({
    associatedSkillName,
    associatedSkillId,
    challengeId,
    competenceId
  }: $TSFixMe) {
    return new CertificationChallenge({
      id: undefined,
      courseId: undefined,
      associatedSkillName,
      associatedSkillId,
      challengeId,
      competenceId,
      isNeutralized: false,
      certifiableBadgeKey: null,
    });
  }

  static createForPixPlusCertification({
    associatedSkillName,
    associatedSkillId,
    challengeId,
    competenceId,
    certifiableBadgeKey
  }: $TSFixMe) {
    return new CertificationChallenge({
      id: undefined,
      courseId: undefined,
      associatedSkillName,
      associatedSkillId,
      challengeId,
      competenceId,
      isNeutralized: false,
      certifiableBadgeKey,
    });
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationChallenge;
