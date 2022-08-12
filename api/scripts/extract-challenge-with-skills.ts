// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'challengeR... Remove this comment to see the full error message
const challengeRepository = require('../lib/infrastructure/repositories/challenge-repository');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const skillsRepository = require('../lib/infrastructure/repositories/skill-repository');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const competencesRepository = require('../lib/infrastructure/repositories/competence-repository');

async function findChallengesWithSkills() {
  const [challenges, skillsFromDb] = await _getReferentialData();
  const skills = _addLevelTubeAndLinkedSkillsToEachSkills(skillsFromDb);

  const knowledgeElementsToCreateForEachChallenges: $TSFixMe = [];
  _.forEach(challenges, (challenge: $TSFixMe) => {
    knowledgeElementsToCreateForEachChallenges[challenge.id] = [];
    const skillsOfChallenges = _getSkillsOfChallenge(challenge.skills, skills);
    const skillsValidatedIfChallengeIsSuccessful = _getValidatedSkills(skillsOfChallenges);
    const skillsInvalidatedIfChallengeIsFailed = _getInvalidatedSkills(skillsOfChallenges);

    const knowledgeElementsValidatedDirect = _.map(skillsOfChallenges, (skill: $TSFixMe) => _createObjectValidatedDirect(skill));
    const knowledgeElementsValidatedInferred = _.map(skillsValidatedIfChallengeIsSuccessful, (skill: $TSFixMe) => _createObjectValidatedInferred(skill)
    );

    const knowledgeElementsInvalidatedDirect = _.map(skillsOfChallenges, (skill: $TSFixMe) => _createObjectInvalidatedDirect(skill)
    );
    const knowledgeElementsInvalidatedInferred = _.map(skillsInvalidatedIfChallengeIsFailed, (skill: $TSFixMe) => _createObjectInvalidatedInferred(skill)
    );

    knowledgeElementsToCreateForEachChallenges[challenge.id]['validated'] = _.concat(
      knowledgeElementsValidatedDirect,
      knowledgeElementsValidatedInferred
    );
    knowledgeElementsToCreateForEachChallenges[challenge.id]['invalidated'] = _.concat(
      knowledgeElementsInvalidatedDirect,
      knowledgeElementsInvalidatedInferred
    );
  });

  return knowledgeElementsToCreateForEachChallenges;
}

async function _getReferentialData() {
  // Récupération des challenges qui ont des acquis
  let challenges = await challengeRepository.findValidated();
  challenges = _.filter(challenges, (c: $TSFixMe) => {
    return c.skills.length > 0;
  });

  // Récupération des compétences (pour les acquis)
  const competences = await competencesRepository.list();
  // Récupération des acquis par compétences
  let skills = await Promise.all(
    _.map(competences, (competence: $TSFixMe) => {
      return skillsRepository.findByCompetenceId(competence.id);
    })
  );

  skills = _.flatten(skills);
  return [challenges, skills];
}

function _addLevelTubeAndLinkedSkillsToEachSkills(skills: $TSFixMe) {
  _(skills)
    .forEach((skill: $TSFixMe) => {
      skill.level = skill.name.slice(-1);
      skill.tube = skill.name.substring(1, skill.name.length - 1);
    })
    .forEach((skill: $TSFixMe) => {
      skill.lowerSkills = _.filter(skills, (otherSkill: $TSFixMe) => {
        return otherSkill.tube === skill.tube && otherSkill.level < skill.level;
      });
      skill.higherSkills = _.filter(skills, (otherSkill: $TSFixMe) => {
        return otherSkill.tube === skill.tube && otherSkill.level > skill.level;
      });
    });
  return skills;
}

function _getValidatedSkills(skillsOfChallenges: $TSFixMe) {
  const skillsValidated = _(skillsOfChallenges)
    .map((skillGivenByChallenge: $TSFixMe) => {
      return skillGivenByChallenge.lowerSkills;
    })
    .flatten()
    .remove((skillValidated: $TSFixMe) => {
      return !_.some(skillsOfChallenges, (skill: $TSFixMe) => {
        return skill.id === skillValidated.id;
      });
    })
    .uniqBy('id')
    .value();
  return skillsValidated;
}

function _getInvalidatedSkills(skillsOfChallenges: $TSFixMe) {
  const skillsInvalidated = _.intersectionBy(_.flatMap(skillsOfChallenges, 'higherSkills'), skillsOfChallenges, 'id');
  return skillsInvalidated;
}

function _getSkillsOfChallenge(skillsOfChallenge: $TSFixMe, skills: $TSFixMe) {
  const idOfSkills = _.map(skillsOfChallenge, 'id');
  return _.filter(skills, (skill: $TSFixMe) => {
    return _.includes(idOfSkills, skill.id);
  });
}

function _createObjectValidatedDirect(skill: $TSFixMe) {
  return {
    source: 'direct',
    status: 'validated',
    skillId: skill.id,
    earnedPix: skill.pixValue,
    competenceId: skill.competenceId,
  };
}

function _createObjectValidatedInferred(skill: $TSFixMe) {
  return {
    source: 'inferred',
    status: 'validated',
    skillId: skill.id,
    earnedPix: skill.pixValue,
    competenceId: skill.competenceId,
  };
}

function _createObjectInvalidatedDirect(skill: $TSFixMe) {
  return {
    source: 'direct',
    status: 'invalidated',
    skillId: skill.id,
    earnedPix: 0,
    competenceId: skill.competenceId,
  };
}

function _createObjectInvalidatedInferred(skill: $TSFixMe) {
  return {
    source: 'inferred',
    status: 'invalidated',
    skillId: skill.id,
    earnedPix: 0,
    competenceId: skill.competenceId,
  };
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = findChallengesWithSkills;
