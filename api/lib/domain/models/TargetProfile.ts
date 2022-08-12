// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'categories... Remove this comment to see the full error message
const categories = {
  OTHER: 'OTHER',
  COMPETENCES: 'COMPETENCES',
  SUBJECT: 'SUBJECT',
  DISCIPLINE: 'DISCIPLINE',
  CUSTOM: 'CUSTOM',
  PREDEFINED: 'PREDEFINED',
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
class TargetProfile {
  static categories = categories;

  badges: $TSFixMe;
  description: $TSFixMe;
  id: $TSFixMe;
  imageUrl: $TSFixMe;
  isPublic: $TSFixMe;
  isSimplifiedAccess: $TSFixMe;
  name: $TSFixMe;
  organizationsAttached: $TSFixMe;
  outdated: $TSFixMe;
  ownerOrganizationId: $TSFixMe;
  skills: $TSFixMe;
  stages: $TSFixMe;

  constructor({
    id,
    name,
    imageUrl,
    isPublic,
    isSimplifiedAccess,
    outdated,
    skills = [],
    stages,
    badges,
    ownerOrganizationId,
    description
  }: $TSFixMe = {}) {
    this.id = id;
    this.name = name;
    this.imageUrl = imageUrl;
    this.isPublic = isPublic;
    this.isSimplifiedAccess = isSimplifiedAccess;
    this.outdated = outdated;
    this.skills = skills;
    this.stages = stages;
    this.badges = badges;
    this.ownerOrganizationId = ownerOrganizationId;
    this.description = description;
    this.organizationsAttached = [];
  }

  get hasBadges() {
    return !!this.badges && this.badges.length > 0;
  }

  hasSkill(skillId: $TSFixMe) {
    return this.skills.some((skill: $TSFixMe) => skill.id === skillId);
  }

  getCompetenceIds() {
    const competenceIdsOfSkills = this.skills.map((skill: $TSFixMe) => skill.competenceId);
    const uniqCompetenceIds = new Set(competenceIdsOfSkills);
    return Array.from(uniqCompetenceIds);
  }

  getTargetedCompetences(competences: $TSFixMe) {
    const targetedCompetenceIds = this.getCompetenceIds();
    return competences.filter((competence: $TSFixMe) => targetedCompetenceIds.includes(competence.id));
  }

  getSkillIds() {
    return this.skills.map((skill: $TSFixMe) => skill.id);
  }

  getSkillCountForCompetence(competenceId: $TSFixMe) {
    return this.skills.filter((skill: $TSFixMe) => skill.competenceId === competenceId).length;
  }

  get organizations() {
    return this.organizationsAttached;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = TargetProfile;
