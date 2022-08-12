// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Skill'.
class Skill {
  competenceId: $TSFixMe;
  id: $TSFixMe;
  learningMoreTutorialIds: $TSFixMe;
  level: $TSFixMe;
  name: $TSFixMe;
  pixValue: $TSFixMe;
  tubeId: $TSFixMe;
  tutorialIds: $TSFixMe;
  version: $TSFixMe;
  constructor({
    id,
    name,
    pixValue,
    competenceId,
    tutorialIds = [],
    learningMoreTutorialIds = [],
    tubeId,
    version,
    level
  }: $TSFixMe = {}) {
    this.id = id;
    this.name = name;
    this.pixValue = pixValue;
    this.competenceId = competenceId;
    this.tutorialIds = tutorialIds;
    this.learningMoreTutorialIds = learningMoreTutorialIds;
    this.tubeId = tubeId;
    this.version = version;
    this.level = level;
  }

  get difficulty() {
    return parseInt(this.name.slice(-1));
  }

  get tubeName() {
    return this.name.slice(0, -1); //with skill'@sourceImage2', returns '@sourceImage'
  }

  get tubeNameWithoutPrefix() {
    return this.tubeName.slice(1); //with skill '@sourceImage2', returns 'sourceImage'
  }

  static areEqual(oneSkill: $TSFixMe, otherSkill: $TSFixMe) {
    if (oneSkill == null || otherSkill == null) {
      return false;
    }

    return oneSkill.name === otherSkill.name;
  }

  static areEqualById(oneSkill: $TSFixMe, otherSkill: $TSFixMe) {
    if (oneSkill == null || otherSkill == null) {
      return false;
    }

    return oneSkill.id === otherSkill.id;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Skill;
