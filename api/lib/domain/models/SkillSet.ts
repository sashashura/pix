// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SkillSet'.
class SkillSet {
  badgeId: $TSFixMe;
  id: $TSFixMe;
  name: $TSFixMe;
  skillIds: $TSFixMe;
  constructor({
    id,
    name,
    skillIds,
    badgeId
  }: $TSFixMe = {}) {
    this.id = id;
    this.name = name;
    this.skillIds = skillIds;
    this.badgeId = badgeId;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SkillSet;
