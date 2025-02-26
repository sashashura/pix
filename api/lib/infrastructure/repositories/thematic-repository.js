const _ = require('lodash');
const Thematic = require('../../domain/models/Thematic');
const thematicDatasource = require('../datasources/learning-content/thematic-datasource');
const { getTranslatedText } = require('../../domain/services/get-translated-text');

function _toDomain(thematicData, locale) {
  const translatedName = getTranslatedText(locale, {
    frenchText: thematicData.name,
    englishText: thematicData.nameEnUs,
  });
  return new Thematic({
    id: thematicData.id,
    name: translatedName,
    index: thematicData.index,
    tubeIds: thematicData.tubeIds,
    competenceId: thematicData.competenceId,
  });
}

module.exports = {
  async list() {
    const thematicData = await thematicDatasource.list();
    return thematicData.map(_toDomain);
  },

  async findByCompetenceIds(competenceIds, locale) {
    const thematicDatas = await thematicDatasource.findByCompetenceIds(competenceIds);
    return thematicDatas.map((thematicData) => _toDomain(thematicData, locale));
  },

  async findByRecordIds(thematicIds, locale) {
    const thematicDatas = await thematicDatasource.findByRecordIds(thematicIds);
    const thematics = thematicDatas.map((thematicData) => _toDomain(thematicData, locale));
    return _.orderBy(thematics, (thematic) => thematic.name.toLowerCase());
  },
};
