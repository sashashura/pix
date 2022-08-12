// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CertifiedS... Remove this comment to see the full error message
class CertifiedSkill {
  difficulty: $TSFixMe;
  hasBeenAskedInCertif: $TSFixMe;
  id: $TSFixMe;
  name: $TSFixMe;
  tubeId: $TSFixMe;
  constructor({
    id,
    name,
    hasBeenAskedInCertif,
    tubeId
  }: $TSFixMe) {
    this.id = id;
    this.name = name;
    this.hasBeenAskedInCertif = hasBeenAskedInCertif;
    this.tubeId = tubeId;
    this.difficulty = parseInt(name.slice(-1));
  }
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CertifiedT... Remove this comment to see the full error message
class CertifiedTube {
  competenceId: $TSFixMe;
  id: $TSFixMe;
  name: $TSFixMe;
  constructor({
    id,
    name,
    competenceId
  }: $TSFixMe) {
    this.id = id;
    this.name = name;
    this.competenceId = competenceId;
  }
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CertifiedC... Remove this comment to see the full error message
class CertifiedCompetence {
  areaId: $TSFixMe;
  id: $TSFixMe;
  name: $TSFixMe;
  constructor({
    id,
    name,
    areaId
  }: $TSFixMe) {
    this.id = id;
    this.name = name;
    this.areaId = areaId;
  }
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CertifiedA... Remove this comment to see the full error message
class CertifiedArea {
  color: $TSFixMe;
  id: $TSFixMe;
  name: $TSFixMe;
  constructor({
    id,
    name,
    color
  }: $TSFixMe) {
    this.id = id;
    this.name = name;
    this.color = color;
  }
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CertifiedP... Remove this comment to see the full error message
class CertifiedProfile {
  certifiedAreas: $TSFixMe;
  certifiedCompetences: $TSFixMe;
  certifiedSkills: $TSFixMe;
  certifiedTubes: $TSFixMe;
  id: $TSFixMe;
  userId: $TSFixMe;
  constructor({
    id,
    userId,
    certifiedSkills,
    certifiedTubes,
    certifiedCompetences,
    certifiedAreas
  }: $TSFixMe) {
    this.id = id;
    this.userId = userId;
    this.certifiedSkills = certifiedSkills;
    this.certifiedTubes = certifiedTubes;
    this.certifiedCompetences = certifiedCompetences;
    this.certifiedAreas = certifiedAreas;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  CertifiedProfile,
  CertifiedArea,
  CertifiedCompetence,
  CertifiedTube,
  CertifiedSkill,
};
