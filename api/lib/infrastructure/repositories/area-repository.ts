// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Area'.
const Area = require('../../domain/models/Area');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'areaDataso... Remove this comment to see the full error message
const areaDatasource = require('../datasources/learning-content/area-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceRepository = require('./competence-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getTransla... Remove this comment to see the full error message
const { getTranslatedText } = require('../../domain/services/get-translated-text');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain({
  areaData,
  locale
}: $TSFixMe) {
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

// @ts-expect-error TS(2393): Duplicate function implementation.
async function list({
  locale
}: $TSFixMe = {}) {
  const areaDataObjects = await areaDatasource.list();
  return areaDataObjects.map((areaData: $TSFixMe) => _toDomain({ areaData, locale }));
}

async function listWithPixCompetencesOnly({
  locale
}: $TSFixMe = {}) {
  const [areas, competences] = await Promise.all([
    list({ locale }),
    competenceRepository.listPixCompetencesOnly({ locale }),
  ]);
  areas.forEach((area: $TSFixMe) => {
    area.competences = _.filter(competences, { area: { id: area.id } });
  });
  return _.filter(areas, ({
    competences
  }: $TSFixMe) => !_.isEmpty(competences));
}

async function findByFrameworkIdWithCompetences({
  frameworkId,
  locale
}: $TSFixMe) {
  const areaDatas = await areaDatasource.findByFrameworkId(frameworkId);
  const areas = areaDatas.map((areaData: $TSFixMe) => _toDomain({ areaData, locale }));
  const competences = await competenceRepository.list({ locale });
  areas.forEach((area: $TSFixMe) => {
    area.competences = _.filter(competences, { area: { id: area.id } });
  });
  return areas;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  list,
  listWithPixCompetencesOnly,
  findByFrameworkIdWithCompetences,
};
