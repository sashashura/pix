// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Skill'.
const Skill = require('../models/Skill');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'statuses'.
const statuses = {
  VALIDATED: 'validated',
  INVALIDATED: 'invalidated',
  RESET: 'reset',
};

// Everytime a user answers a challenge, it gives an information about what he knows
// at a given point in time about a specific skill. This is represented by a 'direct'
// knowledge element. Depending on the success of the response, we can also infer more
// knowledge elements about him regarding other skills: these knowledge elements are thereby 'inferred'.
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sources'.
const sources = {
  DIRECT: 'direct',
  INFERRED: 'inferred',
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
class KnowledgeElement {
  static SourceType = sources;

  static StatusType = statuses;

  answerId: $TSFixMe;
  assessmentId: $TSFixMe;
  competenceId: $TSFixMe;
  createdAt: $TSFixMe;
  earnedPix: $TSFixMe;
  id: $TSFixMe;
  skillId: $TSFixMe;
  source: $TSFixMe;
  status: $TSFixMe;
  userId: $TSFixMe;

  constructor({
    id,
    createdAt,
    source,
    status,
    earnedPix,
    answerId,
    assessmentId,
    skillId,
    userId,
    competenceId
  }: $TSFixMe = {}) {
    this.id = id;
    this.createdAt = createdAt;
    this.source = source;
    this.status = status;
    this.earnedPix = earnedPix;
    this.answerId = answerId;
    this.assessmentId = assessmentId;
    this.skillId = skillId;
    this.userId = userId;
    this.competenceId = competenceId;
  }

  get isValidated() {
    return this.status === statuses.VALIDATED;
  }

  get isInvalidated() {
    // @ts-expect-error TS(2551): Property 'INVALIDATED' does not exist on type '{ D... Remove this comment to see the full error message
    return this.status === statuses.INVALIDATED;
  }

  isDirectlyValidated() {
    return this.status === statuses.VALIDATED && this.source === (sources as $TSFixMe).DIRECT;
  }

  static createKnowledgeElementsForAnswer({
    answer,
    challenge,
    previouslyFailedSkills,
    previouslyValidatedSkills,
    targetSkills,
    userId
  }: $TSFixMe) {
    const directKnowledgeElement = _createDirectKnowledgeElement({
      answer,
      challenge,
      previouslyFailedSkills,
      previouslyValidatedSkills,
      targetSkills,
      userId,
    });

    return _enrichDirectKnowledgeElementWithInferredKnowledgeElements({
      answer,
      directKnowledgeElement,
      previouslyFailedSkills,
      previouslyValidatedSkills,
      targetSkills,
      userId,
    });
  }

  static computeDaysSinceLastKnowledgeElement(knowledgeElements: $TSFixMe) {
    const lastCreatedAt = _(knowledgeElements).map('createdAt').max();
    const precise = true;
    return moment().diff(lastCreatedAt, 'days', precise);
  }

  static findDirectlyValidatedFromGroups(knowledgeElementsByCompetence: $TSFixMe) {
    return _(knowledgeElementsByCompetence)
      .values()
      .flatten()
      .filter({ status: KnowledgeElement.StatusType.VALIDATED })
      .filter({ source: KnowledgeElement.SourceType.DIRECT })
      .value();
  }
}

function _createDirectKnowledgeElement({
  answer,
  challenge,
  previouslyFailedSkills,
  previouslyValidatedSkills,
  targetSkills,
  userId
}: $TSFixMe) {
  // @ts-expect-error TS(2551): Property 'INVALIDATED' does not exist on type '{ D... Remove this comment to see the full error message
  const status = answer.isOk() ? statuses.VALIDATED : statuses.INVALIDATED;

  const filters = [
    _skillIsInTargetedSkills({ targetSkills }),
    _skillIsNotAlreadyAssessed({ previouslyFailedSkills, previouslyValidatedSkills }),
  ];
  if (filters.every((filter) => filter(challenge.skill))) {
    const source = (sources as $TSFixMe).DIRECT;
    const skill = challenge.skill;
    return _createKnowledgeElement({ skill, source, status, answer, userId });
  }
}

function _skillIsInTargetedSkills({
  targetSkills
}: $TSFixMe) {
  return (skill: $TSFixMe) => !_(targetSkills).intersectionWith([skill], Skill.areEqualById).isEmpty();
}

function _skillIsNotAlreadyAssessed({
  previouslyFailedSkills,
  previouslyValidatedSkills
}: $TSFixMe) {
  const alreadyAssessedSkills = previouslyValidatedSkills.concat(previouslyFailedSkills);
  return (skill: $TSFixMe) => _(alreadyAssessedSkills).intersectionWith([skill], Skill.areEqualById).isEmpty();
}

function _enrichDirectKnowledgeElementWithInferredKnowledgeElements({
  answer,
  directKnowledgeElement,
  previouslyFailedSkills,
  previouslyValidatedSkills,
  targetSkills,
  userId
}: $TSFixMe) {
  const targetSkillsGroupedByTubeName = _.groupBy(targetSkills, (skill: $TSFixMe) => skill.tubeNameWithoutPrefix);
  // @ts-expect-error TS(2551): Property 'INVALIDATED' does not exist on type '{ D... Remove this comment to see the full error message
  const status = answer.isOk() ? statuses.VALIDATED : statuses.INVALIDATED;

  if (directKnowledgeElement) {
    const directSkill = _findSkillByIdFromTargetSkills(directKnowledgeElement.skillId, targetSkills);

    const newKnowledgeElements = targetSkillsGroupedByTubeName[directSkill.tubeNameWithoutPrefix]
      .filter(_skillIsNotAlreadyAssessed({ previouslyFailedSkills, previouslyValidatedSkills }))
      .flatMap((skillToInfer: $TSFixMe) => {
        const newKnowledgeElements = _createInferredKnowledgeElements({
          answer,
          status,
          directSkill,
          skillToInfer,
          userId,
        });
        return newKnowledgeElements;
      });
    return [directKnowledgeElement, ...newKnowledgeElements];
  }
  return [];
}

function _findSkillByIdFromTargetSkills(skillId: $TSFixMe, targetSkills: $TSFixMe) {
  const skillToCopy = targetSkills.find((skill: $TSFixMe) => skill.id === skillId);
  return new Skill({ id: skillToCopy.id, name: skillToCopy.name });
}

function _createInferredKnowledgeElements({
  answer,
  status,
  directSkill,
  skillToInfer,
  userId
}: $TSFixMe) {
  const newInferredKnowledgeElements = [];
  if (status === statuses.VALIDATED && skillToInfer.difficulty < directSkill.difficulty) {
    const newKnowledgeElement = _createKnowledgeElement({
    answer,
    skill: skillToInfer,
    userId,
    status: statuses.VALIDATED,
    source: (sources as $TSFixMe).INFERRED,
});
    newInferredKnowledgeElements.push(newKnowledgeElement);
  }
  // @ts-expect-error TS(2551): Property 'INVALIDATED' does not exist on type '{ D... Remove this comment to see the full error message
  if (status === statuses.INVALIDATED && skillToInfer.difficulty > directSkill.difficulty) {
    const newKnowledgeElement = _createKnowledgeElement({
    answer,
    skill: skillToInfer,
    userId,
    // @ts-expect-error TS(2551): Property 'INVALIDATED' does not exist on type '{ D... Remove this comment to see the full error message
    status: statuses.INVALIDATED,
    source: (sources as $TSFixMe).INFERRED,
});
    newInferredKnowledgeElements.push(newKnowledgeElement);
  }
  return newInferredKnowledgeElements;
}

function _createKnowledgeElement({
  answer,
  skill,
  userId,
  status,
  source
}: $TSFixMe) {
  const pixValue = status === statuses.VALIDATED ? skill.pixValue : 0;

  return new KnowledgeElement({
    answerId: answer.id,
    assessmentId: answer.assessmentId,
    earnedPix: pixValue,
    skillId: skill.id,
    source,
    status,
    competenceId: skill.competenceId,
    userId,
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = KnowledgeElement;
