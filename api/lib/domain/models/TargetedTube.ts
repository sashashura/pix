// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetedTu... Remove this comment to see the full error message
class TargetedTube {
  challenges: $TSFixMe;
  competenceId: $TSFixMe;
  description: $TSFixMe;
  id: $TSFixMe;
  level: $TSFixMe;
  practicalDescription: $TSFixMe;
  practicalTitle: $TSFixMe;
  skills: $TSFixMe;
  constructor({
    id,
    practicalTitle,
    practicalDescription,
    description,
    competenceId,
    skills = [],
    level,
    challenges = []
  }: $TSFixMe = {}) {
    this.id = id;
    this.practicalTitle = practicalTitle;
    this.practicalDescription = practicalDescription;
    this.description = description;
    this.competenceId = competenceId;
    this.skills = skills;
    this.level = level;
    this.challenges = challenges;
  }

  hasSkill(skillId: $TSFixMe) {
    return this.skills.some((skill: $TSFixMe) => skill.id === skillId);
  }

  get mobile() {
    return this.challenges && this.challenges.length > 0 && this.challenges.every((c: $TSFixMe) => c.isMobileCompliant);
  }

  get tablet() {
    return this.challenges && this.challenges.length > 0 && this.challenges.every((c: $TSFixMe) => c.isTabletCompliant);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = TargetedTube;
