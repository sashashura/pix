// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config();
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'calculateS... Remove this comment to see the full error message
const calculateScoringInformationForCompetence =
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  require('../lib/domain/services/scoring/scoring-service').calculateScoringInformationForCompetence;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildKnowl... Remove this comment to see the full error message
const buildKnowledgeElement = require('../db/database-builder/factory/build-knowledge-element');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tubeReposi... Remove this comment to see the full error message
const tubeRepository = require('../lib/infrastructure/repositories/tube-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillRepos... Remove this comment to see the full error message
const skillRepository = require('../lib/infrastructure/repositories/skill-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('../lib/infrastructure/repositories/knowledge-element-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'cache'.
const cache = require('../lib/infrastructure/caches/learning-content-cache');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'disconnect... Remove this comment to see the full error message
const { disconnect } = require('../db/knex-database-connection');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getUserSki... Remove this comment to see the full error message
async function getUserSkillsGroupedByTubeId(elements: $TSFixMe) {
  const ids = _.map(elements, (current: $TSFixMe) => current.skillId);
  const skills = [];
  for (const id of ids) {
    const skill = await skillRepository.get(id);
    skills.push(skill);
  }

  // we group them by tube id
  return _.groupBy(skills, 'tubeId');
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getHardest... Remove this comment to see the full error message
function getHardestSkillByTubeId(skillsGroupedByTubeId: $TSFixMe) {
  const result = {};
  _.forIn(skillsGroupedByTubeId, (tubeSkills: $TSFixMe, tubeId: $TSFixMe) => {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    result[tubeId] = _.maxBy(tubeSkills, 'difficulty');
  });

  return result;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getTubeByI... Remove this comment to see the full error message
async function getTubeByIds(ids: $TSFixMe) {
  return Promise.all(ids.map(async (tubeId: $TSFixMe) => tubeRepository.get(tubeId)));
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getUserVal... Remove this comment to see the full error message
async function getUserValidatedKnowledgeElements(userId: $TSFixMe) {
  const foundKnowledgeElements = await knowledgeElementRepository.findUniqByUserId({ userId });
  return await foundKnowledgeElements.filter((ke: $TSFixMe) => {
    return ke.isValidated;
  });
}

function buildKnowledgeElementsFromSkillsInTube(skills: $TSFixMe) {
  return _.map(skills, (current: $TSFixMe, index: $TSFixMe) => {
    const options = {};
    (options as $TSFixMe).skillId = current.id;
    (options as $TSFixMe).source = index === skills.length - 1 ? 'direct' : 'inferred';
    (options as $TSFixMe).competenceId = current.competenceId;
    (options as $TSFixMe).earnedPix = current.pixValue;
    const ke = buildKnowledgeElement(options);
    return ke;
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'compareUse... Remove this comment to see the full error message
async function compareUserScoreWithLatestRelease(userId: $TSFixMe) {
  const knowledgeElements = await getUserValidatedKnowledgeElements(userId);

  // we get the actual pix score
  const knowledgeElementsByCompetenceId = await knowledgeElementRepository.findUniqByUserIdGroupedByCompetenceId({
    userId,
  });

  // then we get the score for each competence
  const scores = _.map(knowledgeElementsByCompetenceId, function (knowledgeElements: $TSFixMe) {
    return calculateScoringInformationForCompetence({ knowledgeElements });
  });

  // and we sum it
  const userScore = _.sumBy(scores, 'pixScoreForCompetence');

  // we get the user skills
  const skillsGroupedByTubeId = await getUserSkillsGroupedByTubeId(knowledgeElements);

  // and we keep the hardest skill by tube id
  const hardestSkillByTubeId = getHardestSkillByTubeId(skillsGroupedByTubeId);

  // then we get the tubes
  const tubes = await getTubeByIds(Object.keys(hardestSkillByTubeId));

  // then we loop over the tubes
  const fakeKnowledgeElements = [];

  for (const currentTube of tubes) {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const hardestSkill = hardestSkillByTubeId[currentTube.id];

    if (!hardestSkill) continue;

    // we find active skills by competence and tube id
    const activeSkills = await skillRepository.findActiveByTubeId(currentTube.id);
    currentTube.skills = activeSkills;

    // and we get the actual ref skills into the tube that are easier or equal the hardest Skill
    const earnedSkills = currentTube.getEasierThan(hardestSkill);

    // then, we rebuild fake knowledgeElements based on those skills and we store it
    fakeKnowledgeElements.push(...buildKnowledgeElementsFromSkillsInTube(earnedSkills));
  }

  const fakeKnowledgeElementsGroupedCompetenceId = _.groupBy(fakeKnowledgeElements, 'competenceId');
  const scoresByCompetenceId = _.map(fakeKnowledgeElementsGroupedCompetenceId, function (current: $TSFixMe) {
    return calculateScoringInformationForCompetence({ knowledgeElements: current }).pixScoreForCompetence;
  });

  const todayScore = _.sum(scoresByCompetenceId);

  return {
    userId,
    userScore,
    todayScore,
  };
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main(userId: $TSFixMe) {
  const result = await compareUserScoreWithLatestRelease(userId);
  cache.quit();
  disconnect();
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log(result);
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  compareUserScoreWithLatestRelease,
  getUserValidatedKnowledgeElements,
  getUserSkillsGroupedByTubeId,
  getHardestSkillByTubeId,
  getTubeByIds,
};

// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
main(parseInt(process.argv[2]));
