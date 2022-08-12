// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillRepos... Remove this comment to see the full error message
const skillRepository = require('../../../../lib/infrastructure/repositories/skill-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceRepository = require('../../../../lib/infrastructure/repositories/competence-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'challengeR... Remove this comment to see the full error message
const challengeRepository = require('../../../../lib/infrastructure/repositories/challenge-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgeRepos... Remove this comment to see the full error message
const badgeRepository = require('../../../../lib/infrastructure/repositories/badge-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../../../lib/infrastructure/logger');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'keys'.
const { keys } = require('../../../../lib/domain/models/Badge');

let allChallenges: $TSFixMe = [];
let allPixCompetences: $TSFixMe = [];
let allDroitCompetences: $TSFixMe = [];
let allEduCompetences: $TSFixMe = [];
const skillsByCompetenceId = {};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'makeUserPi... Remove this comment to see the full error message
async function makeUserPixCertifiable({
  userId,
  countCertifiableCompetences,
  levelOnEachCompetence,
  databaseBuilder
}: $TSFixMe) {
  await _cacheLearningContent();
  const assessmentId = _createComplementeCompetenceEvaluationAssessment({ userId, databaseBuilder });
  const pickedCompetences = _pickRandomPixCompetences(countCertifiableCompetences);
  _.each(pickedCompetences, (competence: $TSFixMe) => {
    _makePixCompetenceCertifiable({ userId, databaseBuilder, competence, levelOnEachCompetence, assessmentId });
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'makeUserPi... Remove this comment to see the full error message
async function makeUserPixDroitCertifiable({
  userId,
  databaseBuilder
}: $TSFixMe) {
  await _cacheLearningContent();
  const assessmentId = _createComplementeCompetenceEvaluationAssessment({ userId, databaseBuilder });
  _.each(allDroitCompetences, (competence: $TSFixMe) => {
    _makePlusCompetenceCertifiable({ userId, databaseBuilder, competence, assessmentId });
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'makeUserPi... Remove this comment to see the full error message
async function makeUserPixEduCertifiable({
  userId,
  databaseBuilder
}: $TSFixMe) {
  await _cacheLearningContent();
  const assessmentId = _createComplementeCompetenceEvaluationAssessment({ userId, databaseBuilder });
  _.each(allEduCompetences, (competence: $TSFixMe) => {
    _makePlusCompetenceCertifiable({ userId, databaseBuilder, competence, assessmentId });
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'makeUserCl... Remove this comment to see the full error message
async function makeUserCleaCertifiable({
  userId,
  databaseBuilder
}: $TSFixMe) {
  await _cacheLearningContent();
  const assessmentId = _createComplementeCompetenceEvaluationAssessment({ userId, databaseBuilder });
  const { skillSets } = await badgeRepository.getByKey(keys.PIX_EMPLOI_CLEA_V3);
  const skillIds = skillSets.flatMap(({
    skillIds
  }: $TSFixMe) => skillIds);
  return bluebird.mapSeries(skillIds, async (skillId: $TSFixMe) => {
    const skill = await skillRepository.get(skillId);
    return _addAnswerAndKnowledgeElementForSkill({ assessmentId, userId, skill, databaseBuilder });
  });
}

function _createComplementeCompetenceEvaluationAssessment({
  databaseBuilder,
  userId
}: $TSFixMe) {
  return databaseBuilder.factory.buildAssessment({
    userId,
    type: 'COMPETENCE_EVALUATION',
    state: 'completed',
  }).id;
}

async function _cacheLearningContent() {
  if (allChallenges.length === 0) {
    const allCompetences = await competenceRepository.list();
    allChallenges = await challengeRepository.list();
    allPixCompetences = _.filter(allCompetences, { origin: 'Pix' });
    allDroitCompetences = _.filter(allCompetences, { origin: 'Droit' });
    allEduCompetences = _.filter(allCompetences, { origin: 'Edu' });
    await bluebird.mapSeries(allCompetences, async (competence: $TSFixMe) => {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      skillsByCompetenceId[competence.id] = await skillRepository.findActiveByCompetenceId(competence.id);
    });
  }
}

function _pickRandomPixCompetences(countCompetences: $TSFixMe) {
  const shuffledCompetences = _.sortBy(allPixCompetences, () => _.random(0, 100));
  return _.slice(shuffledCompetences, 0, countCompetences);
}

function _makePixCompetenceCertifiable({
  databaseBuilder,
  userId,
  competence,
  levelOnEachCompetence,
  assessmentId
}: $TSFixMe) {
  const skillsToValidate = _findSkillsToValidateSpecificLevel(competence, levelOnEachCompetence);
  _.each(skillsToValidate, (skill: $TSFixMe) => {
    _addAnswerAndKnowledgeElementForSkill({ assessmentId, userId, skill, databaseBuilder });
  });
}

function _makePlusCompetenceCertifiable({
  databaseBuilder,
  userId,
  competence,
  assessmentId
}: $TSFixMe) {
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  const skillsToValidate = skillsByCompetenceId[competence.id];
  _.each(skillsToValidate, (skill: $TSFixMe) => {
    _addAnswerAndKnowledgeElementForSkill({ assessmentId, userId, skill, databaseBuilder });
  });
}

function _findSkillsToValidateSpecificLevel(competence: $TSFixMe, expectedLevel: $TSFixMe) {
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  const skills = skillsByCompetenceId[competence.id];
  const orderedByDifficultySkills = _(skills)
    .map((skill: $TSFixMe) => {
      skill.difficulty = parseInt(skill.name.slice(-1));
      return skill;
    })
    .sortBy('difficulty')
    .value();
  const pickedSkills = [];
  let pixScore = 0;
  while ((pixScore < 8 * expectedLevel || pickedSkills.length < 3) && orderedByDifficultySkills.length > 0) {
    const currentSkill = orderedByDifficultySkills.shift();
    pixScore += currentSkill.pixValue;
    pickedSkills.push(currentSkill);
  }
  return pickedSkills;
}

function _addAnswerAndKnowledgeElementForSkill({
  assessmentId,
  userId,
  skill,
  databaseBuilder
}: $TSFixMe) {
  const challenge = _findFirstChallengeValidatedBySkillId(skill.id);
  if (!challenge) {
    logger.warn(`There is no challenge for skill ${skill.id}`);
    return;
  }
  const answerId = databaseBuilder.factory.buildAnswer({
    value: 'dummy value',
    result: 'ok',
    assessmentId,
    challengeId: challenge.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    timeout: null,
    resultDetails: 'dummy value',
  }).id;
  databaseBuilder.factory.buildKnowledgeElement({
    source: 'direct',
    status: 'validated',
    answerId,
    assessmentId,
    skillId: skill.id,
    createdAt: new Date(),
    earnedPix: skill.pixValue,
    userId,
    competenceId: skill.competenceId,
  });
}

function _findFirstChallengeValidatedBySkillId(skillId: $TSFixMe) {
  return _.find(allChallenges, { status: 'validé', skill: { id: skillId } });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  makeUserPixCertifiable,
  makeUserPixDroitCertifiable,
  makeUserCleaCertifiable,
  makeUserPixEduCertifiable,
};
