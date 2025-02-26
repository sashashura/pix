const Area = require('../../domain/models/Area');
const areaDatasource = require('../datasources/learning-content/area-datasource');
const competenceRepository = require('./competence-repository');
const { getTranslatedText } = require('../../domain/services/get-translated-text');
const _ = require('lodash');

function _toDomain({ areaData, locale }) {
  const translatedTitle = getTranslatedText(locale, {
    frenchText: areaData.titleFrFr,
    englishText: areaData.titleEnUs,
  });
  return new Area({
    id: areaData.id,
    code: areaData.code,
    name: areaData.name,
    title: translatedTitle,
    color: areaData.color,
    frameworkId: areaData.frameworkId,
  });
}

async function list({ locale } = {}) {
  const areaDataObjects = await areaDatasource.list();
  return areaDataObjects.map((areaData) => _toDomain({ areaData, locale }));
}

async function listWithPixCompetencesOnly({ locale } = {}) {
  const [areas, competences] = await Promise.all([
    list({ locale }),
    competenceRepository.listPixCompetencesOnly({ locale }),
  ]);
  areas.forEach((area) => {
    area.competences = _.filter(competences, { area: { id: area.id } });
  });
  return _.filter(areas, ({ competences }) => !_.isEmpty(competences));
}

async function findByFrameworkIdWithCompetences({ frameworkId, locale }) {
  const areaDatas = await areaDatasource.findByFrameworkId(frameworkId);
  const areas = areaDatas.map((areaData) => _toDomain({ areaData, locale }));
  const competences = await competenceRepository.list({ locale });
  areas.forEach((area) => {
    area.competences = _.filter(competences, { area: { id: area.id } });
  });
  return areas;
}

async function findByRecordIds({ areaIds, locale }) {
  const areaDataObjects = await areaDatasource.list();
  return areaDataObjects.filter(({ id }) => areaIds.includes(id)).map((areaData) => _toDomain({ areaData, locale }));
}

module.exports = {
  list,
  listWithPixCompetencesOnly,
  findByFrameworkIdWithCompetences,
  findByRecordIds,
};
