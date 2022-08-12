// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Challenge'... Remove this comment to see the full error message
const Challenge = require('../../domain/models/Challenge');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'challengeD... Remove this comment to see the full error message
const challengeDatasource = require('../datasources/learning-content/challenge-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillDatas... Remove this comment to see the full error message
const skillDatasource = require('../datasources/learning-content/skill-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillAdapt... Remove this comment to see the full error message
const skillAdapter = require('../adapters/skill-adapter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'solutionAd... Remove this comment to see the full error message
const solutionAdapter = require('../adapters/solution-adapter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'LearningCo... Remove this comment to see the full error message
const LearningContentResourceNotFound = require('../datasources/learning-content/LearningContentResourceNotFound');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(id: $TSFixMe) {
    try {
      const challenge = await challengeDatasource.get(id);
      const skill = await skillDatasource.get(challenge.skillId);
      return _toDomain({ challengeDataObject: challenge, skillDataObject: skill });
    } catch (error) {
      if (error instanceof LearningContentResourceNotFound) {
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
        throw new NotFoundError();
      }
      throw error;
    }
  },

  async getMany(ids: $TSFixMe) {
    try {
      const challengeDataObjects = await challengeDatasource.getMany(ids);
      const skills = await skillDatasource.getMany(challengeDataObjects.map(({
        skillId
      }: $TSFixMe) => skillId));
      return _toDomainCollection({ challengeDataObjects, skills });
    } catch (error) {
      if (error instanceof LearningContentResourceNotFound) {
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
        throw new NotFoundError();
      }
      throw error;
    }
  },

  async list() {
    const challengeDataObjects = await challengeDatasource.list();
    const skills = await skillDatasource.list();
    return _toDomainCollection({ challengeDataObjects, skills });
  },

  async findValidated() {
    const challengeDataObjects = await challengeDatasource.findValidated();
    const activeSkills = await skillDatasource.findActive();
    return _toDomainCollection({ challengeDataObjects, skills: activeSkills });
  },

  async findOperative() {
    const challengeDataObjects = await challengeDatasource.findOperative();
    const operativeSkills = await skillDatasource.findOperative();
    return _toDomainCollection({ challengeDataObjects, skills: operativeSkills });
  },

  async findOperativeHavingLocale(locale: $TSFixMe) {
    const challengeDataObjects = await challengeDatasource.findOperativeHavingLocale(locale);
    const operativeSkills = await skillDatasource.findOperative();
    return _toDomainCollection({ challengeDataObjects, skills: operativeSkills });
  },

  async findValidatedByCompetenceId(competenceId: $TSFixMe) {
    const challengeDataObjects = await challengeDatasource.findValidatedByCompetenceId(competenceId);
    const activeSkills = await skillDatasource.findActive();
    return _toDomainCollection({ challengeDataObjects, skills: activeSkills });
  },

  async findOperativeBySkills(skills: $TSFixMe) {
    const skillIds = skills.map((skill: $TSFixMe) => skill.id);
    const challengeDataObjects = await challengeDatasource.findOperativeBySkillIds(skillIds);
    const operativeSkills = await skillDatasource.findOperative();
    return _toDomainCollection({ challengeDataObjects, skills: operativeSkills });
  },

  async findFlashCompatible(locale: $TSFixMe) {
    const challengeDataObjects = await challengeDatasource.findFlashCompatible(locale);
    const activeSkills = await skillDatasource.findActive();
    return _toDomainCollection({ challengeDataObjects, skills: activeSkills });
  },

  async findValidatedBySkillId(skillId: $TSFixMe) {
    const challengeDataObjects = await challengeDatasource.findValidatedBySkillId(skillId);
    const activeSkills = await skillDatasource.findActive();
    return _toDomainCollection({ challengeDataObjects, skills: activeSkills });
  },

  async findValidatedPrototype() {
    const challengeDataObjects = await challengeDatasource.findValidatedPrototype();
    const activeSkills = await skillDatasource.findActive();
    return _toDomainCollection({ challengeDataObjects, skills: activeSkills });
  },
};

function _toDomainCollection({
  challengeDataObjects,
  skills
}: $TSFixMe) {
  const lookupSkill = (id: $TSFixMe) => _.find(skills, { id });
  const challenges = challengeDataObjects.map((challengeDataObject: $TSFixMe) => {
    const skillDataObject = lookupSkill(challengeDataObject.skillId);

    return _toDomain({
      challengeDataObject,
      skillDataObject,
    });
  });

  return challenges;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain({
  challengeDataObject,
  skillDataObject
}: $TSFixMe) {
  const skill = skillDataObject ? skillAdapter.fromDatasourceObject(skillDataObject) : null;

  const solution = solutionAdapter.fromDatasourceObject(challengeDataObject);

  const validator = Challenge.createValidatorForChallengeType({
    challengeType: challengeDataObject.type,
    solution,
  });

  return new Challenge({
    id: challengeDataObject.id,
    type: challengeDataObject.type,
    status: challengeDataObject.status,
    instruction: challengeDataObject.instruction,
    alternativeInstruction: challengeDataObject.alternativeInstruction,
    proposals: challengeDataObject.proposals,
    timer: challengeDataObject.timer,
    illustrationUrl: challengeDataObject.illustrationUrl,
    attachments: challengeDataObject.attachments,
    embedUrl: challengeDataObject.embedUrl,
    embedTitle: challengeDataObject.embedTitle,
    embedHeight: challengeDataObject.embedHeight,
    skill,
    validator,
    competenceId: challengeDataObject.competenceId,
    illustrationAlt: challengeDataObject.illustrationAlt,
    format: challengeDataObject.format,
    locales: challengeDataObject.locales,
    autoReply: challengeDataObject.autoReply,
    focused: challengeDataObject.focusable,
    discriminant: challengeDataObject.alpha,
    difficulty: challengeDataObject.delta,
    responsive: challengeDataObject.responsive,
    genealogy: challengeDataObject.genealogy,
  });
}
