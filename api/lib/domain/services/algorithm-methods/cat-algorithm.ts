// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../../models/KnowledgeElement');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'pipe'.
const { pipe } = require('lodash/fp');

// This file implements methods useful for a CAT algorithm
// https://en.wikipedia.org/wiki/Computerized_adaptive_testing
// https://en.wikipedia.org/wiki/Item_response_theory

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  findMaxRewardingSkills,
  getPredictedLevel,
};

function getPredictedLevel(knowledgeElements: $TSFixMe, skills: $TSFixMe) {
  return _.maxBy(_enumerateCatLevels(), (level: $TSFixMe) => _probabilityThatUserHasSpecificLevel(level, knowledgeElements, skills)
  );
}

function _enumerateCatLevels() {
  const firstLevel = 0.5;
  const lastLevel = 8; // The upper boundary is not included in the range
  const levelStep = 0.5;
  return _.range(firstLevel, lastLevel, levelStep);
}

function _probabilityThatUserHasSpecificLevel(level: $TSFixMe, knowledgeElements: $TSFixMe, skills: $TSFixMe) {
  const directKnowledgeElements = _.filter(knowledgeElements, (ke: $TSFixMe) => ke.source === 'direct');
  const extraAnswers = directKnowledgeElements.map((ke: $TSFixMe) => {
    const skill = skills.find((skill: $TSFixMe) => skill.id === ke.skillId);
    const maxDifficulty = skill.difficulty || 2;
    const binaryOutcome = ke.status === KnowledgeElement.StatusType.VALIDATED ? 1 : 0;
    return { binaryOutcome, maxDifficulty };
  });

  const answerThatAnyoneCanSolve = { maxDifficulty: 0, binaryOutcome: 1 };
  const answerThatNobodyCanSolve = { maxDifficulty: 7, binaryOutcome: 0 };
  extraAnswers.push(answerThatAnyoneCanSolve, answerThatNobodyCanSolve);

  const diffBetweenResultAndProbaToResolve = extraAnswers.map(
    (answer: $TSFixMe) => answer.binaryOutcome - _probaOfCorrectAnswer(level, answer.maxDifficulty)
  );

  return -Math.abs(diffBetweenResultAndProbaToResolve.reduce((a: $TSFixMe, b: $TSFixMe) => a + b));
}

function findMaxRewardingSkills(...args: $TSFixMe[]) {
  return pipe(_getMaxRewardingSkills, _clearSkillsIfNotRewarding)(...args);
}

function _getMaxRewardingSkills({
  availableSkills,
  predictedLevel,
  tubes,
  knowledgeElements
}: $TSFixMe) {
  return _.reduce(
    availableSkills,
    (acc: $TSFixMe, skill: $TSFixMe) => {
      const skillReward = _computeReward({ skill, predictedLevel, tubes, knowledgeElements });
      if (skillReward > acc.maxReward) {
        acc.maxReward = skillReward;
        acc.maxRewardingSkills = [skill];
      } else if (skillReward === acc.maxReward) {
        acc.maxRewardingSkills.push(skill);
      }
      return acc;
    },
    { maxRewardingSkills: [], maxReward: -Infinity }
  ).maxRewardingSkills;
}

// Skills that won't bring anymore information on the user is a termination condition of the CAT algorithm
function _clearSkillsIfNotRewarding(skills: $TSFixMe) {
  return _.filter(skills, (skill: $TSFixMe) => skill.reward !== 0);
}

function _computeReward({
  skill,
  predictedLevel,
  tubes,
  knowledgeElements
}: $TSFixMe) {
  const proba = _probaOfCorrectAnswer(predictedLevel, skill.difficulty);
  const extraSkillsIfSolvedCount = _getNewSkillsInfoIfSkillSolved(skill, tubes, knowledgeElements).length;
  const failedSkillsIfUnsolvedCount = _getNewSkillsInfoIfSkillUnsolved(skill, tubes, knowledgeElements).length;

  return proba * extraSkillsIfSolvedCount + (1 - proba) * failedSkillsIfUnsolvedCount;
}

// The probability P(gap) of giving the correct answer is given by the "logistic function"
// https://en.wikipedia.org/wiki/Logistic_function
function _probaOfCorrectAnswer(userEstimatedLevel: $TSFixMe, challengeDifficulty: $TSFixMe) {
  return 1 / (1 + Math.exp(-(userEstimatedLevel - challengeDifficulty)));
}

function _getNewSkillsInfoIfSkillSolved(skillTested: $TSFixMe, tubes: $TSFixMe, knowledgeElements: $TSFixMe) {
  let extraValidatedSkills = _findTubeByName(tubes, skillTested.tubeNameWithoutPrefix)
    .getEasierThan(skillTested)
    .filter(_skillNotTestedYet(knowledgeElements));

  if (!_.isEmpty(skillTested.linkedSkills)) {
    extraValidatedSkills = _.concat(extraValidatedSkills, skillTested.linkedSkills);
  }
  return _.uniqBy(extraValidatedSkills, 'id');
}

function _getNewSkillsInfoIfSkillUnsolved(skillTested: $TSFixMe, tubes: $TSFixMe, knowledgeElements: $TSFixMe) {
  let extraFailedSkills = _findTubeByName(tubes, skillTested.tubeNameWithoutPrefix)
    .getHarderThan(skillTested)
    .filter(_skillNotTestedYet(knowledgeElements));

  if (!_.isEmpty(skillTested.linkedSkills)) {
    extraFailedSkills = _.concat(extraFailedSkills, skillTested.linkedSkills);
  }
  return _.uniqBy(extraFailedSkills, 'id');
}

function _findTubeByName(tubes: $TSFixMe, tubeName: $TSFixMe) {
  return tubes.find((tube: $TSFixMe) => tube.name === tubeName);
}

function _skillNotTestedYet(knowledgeElements: $TSFixMe) {
  return (skill: $TSFixMe) => {
    const skillsAlreadyTested = _.map(knowledgeElements, 'skillId');
    return !skillsAlreadyTested.includes(skill.id);
  };
}
