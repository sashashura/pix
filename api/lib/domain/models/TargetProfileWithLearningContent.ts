// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
class TargetProfileWithLearningContent {
  areas: $TSFixMe;
  badges: $TSFixMe;
  category: $TSFixMe;
  comment: $TSFixMe;
  competences: $TSFixMe;
  createdAt: $TSFixMe;
  description: $TSFixMe;
  id: $TSFixMe;
  imageUrl: $TSFixMe;
  isPublic: $TSFixMe;
  isSimplifiedAccess: $TSFixMe;
  name: $TSFixMe;
  outdated: $TSFixMe;
  ownerOrganizationId: $TSFixMe;
  skills: $TSFixMe;
  stages: $TSFixMe;
  tubes: $TSFixMe;
  tubesSelection: $TSFixMe;
  tubesSelectionAreas: $TSFixMe;
  constructor({
    id,
    name,
    outdated,
    isPublic,
    createdAt,
    ownerOrganizationId,
    description,
    comment,
    skills = [],
    tubes = [],
    competences = [],
    areas = [],
    badges = [],
    stages = [],
    imageUrl,
    category,
    isSimplifiedAccess,
    tubesSelection,
    tubesSelectionAreas
  }: $TSFixMe = {}) {
    this.id = id;
    this.name = name;
    this.outdated = outdated;
    this.isPublic = isPublic;
    this.createdAt = createdAt;
    this.ownerOrganizationId = ownerOrganizationId;
    this.description = description;
    this.comment = comment;
    this.skills = skills;
    this.tubes = tubes;
    this.competences = competences;
    this.areas = areas;
    this.badges = badges;
    this.stages = _.sortBy(stages, 'threshold');
    this.imageUrl = imageUrl;
    this.category = category;
    this.isSimplifiedAccess = isSimplifiedAccess;
    this.tubesSelection = tubesSelection;
    this.tubesSelectionAreas = tubesSelectionAreas;
  }

  get skillNames() {
    return this.skills.map((skill: $TSFixMe) => skill.name);
  }

  get skillIds() {
    return this.skills.map((skill: $TSFixMe) => skill.id);
  }

  get tubeIds() {
    return this.tubes.map((tube: $TSFixMe) => tube.id);
  }

  get competenceIds() {
    return this.competences.map((competence: $TSFixMe) => competence.id);
  }

  get reachableStages() {
    return _(this.stages)
      .filter(({
      threshold
    }: $TSFixMe) => threshold > 0)
      .value();
  }

  hasSkill(skillId: $TSFixMe) {
    return this.skills.some((skill: $TSFixMe) => skill.id === skillId);
  }

  hasBadges() {
    return this.badges.length > 0;
  }

  hasReachableStages() {
    return this.reachableStages.length > 0;
  }

  getTubeIdOfSkill(skillId: $TSFixMe) {
    const skillTube = this.tubes.find((tube: $TSFixMe) => tube.hasSkill(skillId));

    return skillTube ? skillTube.id : null;
  }

  getCompetenceIdOfSkill(skillId: $TSFixMe) {
    const skillTube = this.tubes.find((tube: $TSFixMe) => tube.hasSkill(skillId));

    return skillTube ? skillTube.competenceId : null;
  }

  findSkill(skillId: $TSFixMe) {
    const foundSkill = _.find(this.skills, (skill: $TSFixMe) => skill.id === skillId);
    return foundSkill || null;
  }

  findTube(tubeId: $TSFixMe) {
    const foundTube = _.find(this.tubes, (tube: $TSFixMe) => tube.id === tubeId);
    return foundTube || null;
  }

  getCompetence(competenceId: $TSFixMe) {
    const foundCompetence = _.find(this.competences, (competence: $TSFixMe) => competence.id === competenceId);
    return foundCompetence || null;
  }

  getArea(areaId: $TSFixMe) {
    const foundArea = _.find(this.areas, (area: $TSFixMe) => area.id === areaId);
    return foundArea || null;
  }

  getAreaOfCompetence(competenceId: $TSFixMe) {
    const area = this.areas.find((area: $TSFixMe) => area.hasCompetence(competenceId));

    return area || null;
  }

  getKnowledgeElementsGroupedByCompetence(knowledgeElements: $TSFixMe) {
    return this._filterTargetedKnowledgeElementAndGroupByCompetence(knowledgeElements);
  }

  getValidatedKnowledgeElementsGroupedByTube(knowledgeElements: $TSFixMe) {
    return this._filterTargetedKnowledgeElementAndGroupByTube(
      knowledgeElements,
      // @ts-expect-error TS(2345): Argument of type '(knowledgeElement: $TSFixMe) => ... Remove this comment to see the full error message
      (knowledgeElement: $TSFixMe) => knowledgeElement.isValidated
    );
  }

  _filterTargetedKnowledgeElementAndGroupByCompetence(knowledgeElements: $TSFixMe, knowledgeElementFilter = () => true) {
    const knowledgeElementsGroupedByCompetence = {};
    for (const competenceId of this.competenceIds) {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      knowledgeElementsGroupedByCompetence[competenceId] = [];
    }
    for (const knowledgeElement of knowledgeElements) {
      const competenceId = this.getCompetenceIdOfSkill(knowledgeElement.skillId);
      // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
      if (competenceId && knowledgeElementFilter(knowledgeElement)) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        knowledgeElementsGroupedByCompetence[competenceId].push(knowledgeElement);
      }
    }

    return knowledgeElementsGroupedByCompetence;
  }

  _filterTargetedKnowledgeElementAndGroupByTube(knowledgeElements: $TSFixMe, knowledgeElementFilter = () => true) {
    const knowledgeElementsGroupedByTube = {};
    for (const tubeId of this.tubeIds) {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      knowledgeElementsGroupedByTube[tubeId] = [];
    }
    for (const knowledgeElement of knowledgeElements) {
      const tubeId = this.getTubeIdOfSkill(knowledgeElement.skillId);
      // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
      if (tubeId && knowledgeElementFilter(knowledgeElement)) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        knowledgeElementsGroupedByTube[tubeId].push(knowledgeElement);
      }
    }

    return knowledgeElementsGroupedByTube;
  }

  countValidatedTargetedKnowledgeElementsByCompetence(knowledgeElements: $TSFixMe) {
    const validatedGroupedByCompetence = this._filterTargetedKnowledgeElementAndGroupByCompetence(
      knowledgeElements,
      // @ts-expect-error TS(2345): Argument of type '(knowledgeElement: $TSFixMe) => ... Remove this comment to see the full error message
      (knowledgeElement: $TSFixMe) => knowledgeElement.isValidated
    );
    return _.mapValues(validatedGroupedByCompetence, 'length');
  }

  get maxSkillDifficulty() {
    const skillMaxDifficulty = _.maxBy(this.skills, 'difficulty');
    return skillMaxDifficulty ? skillMaxDifficulty.difficulty : null;
  }

  getStageThresholdBoundaries() {
    const boundaries: $TSFixMe = [];
    let lastTo: $TSFixMe = null;

    this.stages.forEach((currentStage: $TSFixMe, index: $TSFixMe) => {
      let to, from;

      if (lastTo === null) {
        from = currentStage.threshold;
      } else {
        from = lastTo + 1;
      }

      if (index + 1 >= this.stages.length) {
        to = 100;
      } else {
        const nextThreshold = this.stages[index + 1].threshold;
        to = Math.max(from, nextThreshold - 1);
      }

      lastTo = to;
      boundaries.push({ id: currentStage.id, from, to });
    });

    return boundaries;
  }

  getThresholdBoundariesFromStages(stageIds: $TSFixMe) {
    if (!stageIds || stageIds.length === 0) return null;
    // @ts-expect-error TS(7006): Parameter 'boundary' implicitly has an 'any' type.
    return this.getStageThresholdBoundaries().filter((boundary) => stageIds.includes(boundary.id));
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = TargetProfileWithLearningContent;
