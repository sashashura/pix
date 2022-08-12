// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'pipe'.
const { pipe } = require('lodash/fp');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'constants'... Remove this comment to see the full error message
const constants = require('../../constants');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  getFilteredSkillsForFirstChallenge,
  getFilteredSkillsForNextChallenge,
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getFiltere... Remove this comment to see the full error message
function getFilteredSkillsForFirstChallenge({
  knowledgeElements,
  tubes,
  targetSkills
}: $TSFixMe) {
  return pipe(
    _getPlayableSkill,
    _getUntestedSkills.bind(null, knowledgeElements),
    _keepSkillsFromEasyTubes.bind(null, tubes),
    _removeTimedSkillsIfNeeded.bind(null, true),
    _focusOnDefaultLevel.bind(null)
  )(targetSkills);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getFiltere... Remove this comment to see the full error message
function getFilteredSkillsForNextChallenge({
  knowledgeElements,
  tubes,
  predictedLevel,
  isLastChallengeTimed,
  targetSkills
}: $TSFixMe) {
  return pipe(
    _getPlayableSkill,
    _getUntestedSkills.bind(null, knowledgeElements),
    _keepSkillsFromEasyTubes.bind(null, tubes),
    _removeTimedSkillsIfNeeded.bind(null, isLastChallengeTimed),
    _removeTooDifficultSkills.bind(null, predictedLevel)
  )(targetSkills);
}

function _getUntestedSkills(knowledgeElements: $TSFixMe, skills: $TSFixMe) {
  return _.filter(skills, _skillNotAlreadyTested(knowledgeElements));
}

function _getPlayableSkill(skills: $TSFixMe) {
  return _.filter(skills, (skill: $TSFixMe) => skill.isPlayable);
}

function _getPrioritySkills(tubes: $TSFixMe) {
  return pipe(_getEasyTubes, _getSkillsFromTubes)(tubes);
}

function _keepSkillsFromEasyTubes(tubes: $TSFixMe, targetSkills: $TSFixMe) {
  const skillsFromEasyTubes = _getPrioritySkills(tubes);
  const availableSkillsFromEasyTubes = _.intersectionBy(targetSkills, skillsFromEasyTubes, 'id');
  if (!_.isEmpty(availableSkillsFromEasyTubes)) {
    return availableSkillsFromEasyTubes;
  }
  return targetSkills;
}

function _getEasyTubes(tubes: $TSFixMe) {
  return _.filter(tubes, (tube: $TSFixMe) => tube.getHardestSkill().difficulty <= constants.MAX_LEVEL_TO_BE_AN_EASY_TUBE);
}

function _getSkillsFromTubes(tubes: $TSFixMe) {
  return _.flatMap(tubes, (tube: $TSFixMe) => tube.skills);
}

function _skillNotAlreadyTested(knowledgeElements: $TSFixMe) {
  return (skill: $TSFixMe) => {
    const alreadyTestedSkillIds = _.map(knowledgeElements, 'skillId');
    return !alreadyTestedSkillIds.includes(skill.id);
  };
}

function _removeTimedSkillsIfNeeded(isLastChallengeTimed: $TSFixMe, targetSkills: $TSFixMe) {
  if (isLastChallengeTimed) {
    const skillsWithoutTimedChallenges = _.filter(targetSkills, (skill: $TSFixMe) => !skill.timed);
    return skillsWithoutTimedChallenges.length > 0 ? skillsWithoutTimedChallenges : targetSkills;
  }
  return targetSkills;
}

function _focusOnDefaultLevel(targetSkills: $TSFixMe) {
  if (_.isEmpty(targetSkills)) {
    return targetSkills;
  }

  const remapDifficulty = (difficulty: $TSFixMe) => difficulty == constants.DEFAULT_LEVEL_FOR_FIRST_CHALLENGE ? Number.MIN_VALUE : difficulty;
  const [, potentialFirstSkills] = _(targetSkills)
    .groupBy('difficulty')
    .entries()
    // @ts-expect-error TS(7031): Binding element 'difficulty' implicitly has an 'an... Remove this comment to see the full error message
    .minBy(([difficulty, _targetSkills]) => remapDifficulty(parseFloat(difficulty)));

  return potentialFirstSkills;
}

function _removeTooDifficultSkills(predictedLevel: $TSFixMe, targetSkills: $TSFixMe) {
  return _.filter(targetSkills, (skill: $TSFixMe) => !_isSkillTooHard(skill, predictedLevel));
}

function _isSkillTooHard(skill: $TSFixMe, predictedLevel: $TSFixMe) {
  return skill.difficulty - predictedLevel > constants.MAX_DIFF_BETWEEN_USER_LEVEL_AND_SKILL_LEVEL;
}
