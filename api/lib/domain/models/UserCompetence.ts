// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { MINIMUM_COMPETENCE_LEVEL_FOR_CERTIFIABILITY } = require('../constants');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserCompet... Remove this comment to see the full error message
class UserCompetence {
  area: $TSFixMe;
  estimatedLevel: $TSFixMe;
  id: $TSFixMe;
  index: $TSFixMe;
  name: $TSFixMe;
  pixScore: $TSFixMe;
  skills: $TSFixMe;
  constructor({
    id,
    index,
    name,
    area,
    pixScore,
    estimatedLevel,
    skills = []
  }: $TSFixMe = {}) {
    this.id = id;
    this.index = index;
    this.name = name;
    this.area = area;
    this.pixScore = pixScore;
    this.estimatedLevel = estimatedLevel;
    this.skills = skills;
  }

  addSkill(newSkill: $TSFixMe) {
    const hasAlreadySkill = _(this.skills)
      .filter((skill: $TSFixMe) => skill.name === newSkill.name)
      .size();

    if (!hasAlreadySkill) {
      this.skills.push(newSkill);
    }
  }

  isCertifiable() {
    return this.estimatedLevel >= MINIMUM_COMPETENCE_LEVEL_FOR_CERTIFIABILITY;
  }

  getSkillsAtLatestVersion() {
    const skillsSortedByNameAndVersion = _.orderBy(this.skills, ['name', 'version'], ['asc', 'desc']);
    return _.uniqWith(skillsSortedByNameAndVersion, (a: $TSFixMe, b: $TSFixMe) => a.name === b.name);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = UserCompetence;
