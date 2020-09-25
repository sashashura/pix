const _ = require('lodash');
const { knex } = require('../bookshelf');
const TargetProfileWithLearningContent = require('../../domain/models/TargetProfileWithLearningContent');
const TargetedSkill = require('../../domain/models/TargetedSkill');
const TargetedTube = require('../../domain/models/TargetedTube');
const TargetedCompetence = require('../../domain/models/TargetedCompetence');
const TargetedArea = require('../../domain/models/TargetedArea');
const skillDatasource = require('../../infrastructure/datasources/airtable/skill-datasource');
const tubeDatasource = require('../../infrastructure/datasources/airtable/tube-datasource');
const competenceDatasource = require('../../infrastructure/datasources/airtable/competence-datasource');
const areaDatasource = require('../../infrastructure/datasources/airtable/area-datasource');
const { NotFoundError } = require('../../domain/errors');
const { FRENCH_FRANCE } = require('../../domain/constants').LOCALE;
const { getTranslatedText } = require('../../domain/services/get-translated-text');

module.exports = {

  async get({ id, locale = FRENCH_FRANCE }) {
    const results = await knex('target-profiles')
      .leftJoin('target-profiles_skills', 'target-profiles_skills.targetProfileId', 'target-profiles.id')
      .select('target-profiles.id', 'target-profiles.name', 'target-profiles_skills.skillId')
      .where('target-profiles.id', id);

    if (_.isEmpty(results)) {
      throw new NotFoundError(`Le profil cible ${id} n'existe pas`);
    }

    const skillIds = _.compact(results.map(({ skillId }) => skillId));
    const {
      skills,
      tubes,
      competences,
      areas,
    } = await _getTargetedLearningContent(skillIds, locale);

    return new TargetProfileWithLearningContent({
      id: results[0].id,
      name: results[0].name,
      skills,
      tubes,
      competences,
      areas,
    });
  },
};

async function _getTargetedLearningContent(skillIds, locale) {
  const skills = await _findTargetedSkills(skillIds);
  const tubes = await _findTargetedTubes(skills, locale);
  const competences = await _findTargetedCompetences(tubes, locale);
  const areas = await _findTargetedAreas(competences, locale);

  return {
    skills,
    tubes,
    competences,
    areas,
  };
}

async function _findTargetedSkills(skillIds) {
  const airtableSkills = await skillDatasource.findOperativeByRecordIds(skillIds);
  return airtableSkills.map((airtableSkill) => {
    return new TargetedSkill(airtableSkill);
  });
}

async function _findTargetedTubes(skills, locale) {
  const skillsByTubeId = _.groupBy(skills, 'tubeId');
  const airtableTubes = await tubeDatasource.findByRecordIds(Object.keys(skillsByTubeId));
  return airtableTubes.map((airtableTube) => {
    const practicalTitle = getTranslatedText(locale, { frenchText: airtableTube.practicalTitleFrFr, englishText: airtableTube.practicalTitleEnUs });
    return new TargetedTube({
      ...airtableTube,
      practicalTitle,
      skills: skillsByTubeId[airtableTube.id],
    });
  });
}

async function _findTargetedCompetences(tubes, locale) {
  const tubesByCompetenceId = _.groupBy(tubes, 'competenceId');
  const airtableCompetences = await competenceDatasource.findByRecordIds(Object.keys(tubesByCompetenceId));
  return airtableCompetences.map((airtableCompetence) => {
    const name = getTranslatedText(locale, { frenchText: airtableCompetence.nameFrFr, englishText: airtableCompetence.nameEnUs });
    return new TargetedCompetence({
      ...airtableCompetence,
      name,
      tubes: tubesByCompetenceId[airtableCompetence.id],
    });
  });
}

async function _findTargetedAreas(competences, locale) {
  const competencesByAreaId = _.groupBy(competences, 'areaId');
  const airtableAreas = await areaDatasource.findByRecordIds(Object.keys(competencesByAreaId));
  return airtableAreas.map((airtableArea) => {
    const title = getTranslatedText(locale, { frenchText: airtableArea.titleFrFr, englishText: airtableArea.titleEnUs });
    return new TargetedArea({
      ...airtableArea,
      title,
      competences: competencesByAreaId[airtableArea.id],
    });
  });
}
