const { knex } = require('../../../db/knex-database-connection');
const _ = require('lodash');
const { TargetProfileInvalidError } = require('../../domain/errors');
const skillRepository = require('./skill-repository');
const tubeRepository = require('./tube-repository');
const competenceRepository = require('./competence-repository');
const LearningContent = require('../../domain/models/LearningContent');

async function findLearningContentByCampaign(campaignId, locale) {
  const skillIds = await knex('campaign_skills').where({ campaignId }).pluck('skillId');

  const { skills, tubes, competences, areas } = await _getLearningContentBySkillIds(skillIds, locale);

  return new LearningContent({ skills, tubes, competences, areas });
}

async function _getLearningContentBySkillIds(skillIds, locale) {
  const skills = await skillRepository.findOperativeByIds(skillIds);
  if (_.isEmpty(skills)) {
    throw new TargetProfileInvalidError();
  }
  const tubeIds = _.uniq(skills.map((skill) => skill.tubeId));
  const tubes = await tubeRepository.findActiveByRecordIds(tubeIds, locale);

  const competenceIds = _.uniq(tubes.map((tube) => tube.competenceId));
  const competences = await competenceRepository.findByRecordIds({ competenceIds, locale });

  const areas = _.uniqBy(
    competences.map(({ area }) => area),
    'id'
  );

  return {
    skills,
    tubes,
    competences,
    areas,
  };
}

module.exports = {
  findLearningContentByCampaign,
};
