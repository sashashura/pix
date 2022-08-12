// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tube'.
class Tube {
  competenceId: $TSFixMe;
  description: $TSFixMe;
  id: $TSFixMe;
  name: $TSFixMe;
  practicalDescription: $TSFixMe;
  practicalTitle: $TSFixMe;
  skills: $TSFixMe;
  title: $TSFixMe;
  constructor({
    id,
    name,
    title,
    description,
    practicalTitle,
    practicalDescription,
    skills = [],
    competenceId
  }: $TSFixMe = {}) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.practicalTitle = practicalTitle;
    this.practicalDescription = practicalDescription;
    this.skills = skills;
    this.competenceId = competenceId;

    if (name) {
      this.name = name;
    } else if (skills.length > 0) {
      this.name = skills[0].tubeNameWithoutPrefix;
    } else {
      this.name = '';
    }
  }

  addSkill(skillToAdd: $TSFixMe) {
    if (!this.skills.find((skill: $TSFixMe) => skill.name === skillToAdd.name)) {
      this.skills.push(skillToAdd);
    }
  }

  getEasierThan(skill: $TSFixMe) {
    return this.skills.filter((tubeSkill: $TSFixMe) => tubeSkill.difficulty <= skill.difficulty);
  }

  getHarderThan(skill: $TSFixMe) {
    return this.skills.filter((tubeSkill: $TSFixMe) => tubeSkill.difficulty >= skill.difficulty);
  }

  getHardestSkill() {
    return _.maxBy(this.skills, 'difficulty');
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Tube;
