// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config();
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserSavedT... Remove this comment to see the full error message
const UserSavedTutorial = require('../lib/domain/models/UserSavedTutorial');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../lib/domain/models/KnowledgeElement');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserSavedT... Remove this comment to see the full error message
const UserSavedTutorialWithTutorial = require('../lib/domain/models/UserSavedTutorialWithTutorial');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('../lib/infrastructure/repositories/knowledge-element-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tutorialDa... Remove this comment to see the full error message
const tutorialDatasource = require('../lib/infrastructure/datasources/learning-content/tutorial-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillDatas... Remove this comment to see the full error message
const skillDatasource = require('../lib/infrastructure/datasources/learning-content/skill-datasource');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Starting filling skillId to user saved tutorials');

  const userSavedTutorialsWithoutSkillId = await getAllUserSavedTutorialsWithoutSkillId();
  const tutorials = await getAllTutorials();
  const skills = await getAllSkills();

  const tutorialsWithSkills = associateSkillsToTutorial(skills, tutorials);

  for (const userSavedTutorialWithoutSkillId of userSavedTutorialsWithoutSkillId) {
    const userSavedTutorial = associateTutorialToUserSavedTutorial(
      userSavedTutorialWithoutSkillId,
      tutorialsWithSkills
    );
    if (!userSavedTutorial.tutorial) {
      continue;
    }

    const skillId = await getMostRelevantSkillId(userSavedTutorial);

    if (!skillId) {
      continue;
    }

    await knex('user-saved-tutorials').update({ skillId }).where({ id: userSavedTutorial.id });
  }

  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('End filling skillId to user saved tutorials');
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getAllUser... Remove this comment to see the full error message
async function getAllUserSavedTutorialsWithoutSkillId() {
  const userSavedTutorials = await knex('user-saved-tutorials').whereNull('skillId');
  return userSavedTutorials.map(_toDomain);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(userSavedTutorial: $TSFixMe) {
  return new UserSavedTutorial({
    id: userSavedTutorial.id,
    tutorialId: userSavedTutorial.tutorialId,
    userId: userSavedTutorial.userId,
    skillId: userSavedTutorial.skillId,
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getAllTuto... Remove this comment to see the full error message
async function getAllTutorials() {
  return tutorialDatasource.list();
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getAllSkil... Remove this comment to see the full error message
async function getAllSkills() {
  return skillDatasource.list();
}

function _skillHasTutorialId(skill: $TSFixMe, tutorialId: $TSFixMe) {
  return skill.tutorialIds.includes(tutorialId);
}

function _skillHasLearningMoreTutorialId(skill: $TSFixMe, tutorialId: $TSFixMe) {
  return skill.learningMoreTutorialIds?.includes(tutorialId);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'associateS... Remove this comment to see the full error message
function associateSkillsToTutorial(skills: $TSFixMe, tutorials: $TSFixMe) {
  return tutorials.map((tutorial: $TSFixMe) => {
    const skillIds = skills.filter((skill: $TSFixMe) => _skillHasTutorialId(skill, tutorial.id)).map((skill: $TSFixMe) => skill.id);
    const referenceBySkillsIdsForLearningMore = skills
      .filter((skill: $TSFixMe) => _skillHasLearningMoreTutorialId(skill, tutorial.id))
      .map((skill: $TSFixMe) => skill.id);
    return {
      ...tutorial,
      skillIds,
      referenceBySkillsIdsForLearningMore,
    };
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'associateT... Remove this comment to see the full error message
function associateTutorialToUserSavedTutorial(userSavedTutorial: $TSFixMe, tutorials: $TSFixMe) {
  const tutorial = tutorials.find((tutorial: $TSFixMe) => tutorial.id === userSavedTutorial.tutorialId);
  return new UserSavedTutorialWithTutorial({ ...userSavedTutorial, tutorial });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getMostRel... Remove this comment to see the full error message
async function getMostRelevantSkillId(userSavedTutorialWithTutorial: $TSFixMe) {
  const userId = userSavedTutorialWithTutorial.userId;
  const tutorialSkillIds = userSavedTutorialWithTutorial.tutorial.skillIds;
  const tutorialReferenceBySkillsIdsForLearningMore =
    userSavedTutorialWithTutorial.tutorial.referenceBySkillsIdsForLearningMore;

  const knowledgeElements = await knowledgeElementRepository.findUniqByUserId({ userId });

  const invalidatedDirectKnowledgeElements = knowledgeElements.filter(_isInvalidatedAndDirect);

  const mostRelevantKnowledgeElement = invalidatedDirectKnowledgeElements.find((knowledgeElement: $TSFixMe) => tutorialSkillIds.includes(knowledgeElement.skillId)
  );
  if (mostRelevantKnowledgeElement) {
    return mostRelevantKnowledgeElement.skillId;
  }

  if (!tutorialReferenceBySkillsIdsForLearningMore?.length) {
    return undefined;
  }

  return knowledgeElements.find(({
    skillId
  }: $TSFixMe) => tutorialReferenceBySkillsIdsForLearningMore.includes(skillId))
    ?.skillId;
}

function _isInvalidatedAndDirect({
  status,
  source
}: $TSFixMe) {
  return status === KnowledgeElement.StatusType.INVALIDATED && source === KnowledgeElement.SourceType.DIRECT;
}

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
if (require.main === module) {
  main().then(
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    () => process.exit(0),
    (err) => {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.error(err);
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.exit(1);
    }
  );
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  getAllUserSavedTutorialsWithoutSkillId,
  getAllTutorials,
  getAllSkills,
  associateTutorialToUserSavedTutorial,
  associateSkillsToTutorial,
  getMostRelevantSkillId,
  main,
};
