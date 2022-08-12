// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Thematic'.
const Thematic = require('../../domain/models/Thematic');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'thematicDa... Remove this comment to see the full error message
const thematicDatasource = require('../datasources/learning-content/thematic-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getTransla... Remove this comment to see the full error message
const { getTranslatedText } = require('../../domain/services/get-translated-text');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(thematicData: $TSFixMe, locale: $TSFixMe) {
  const translatedName = getTranslatedText(locale, {
    frenchText: thematicData.name,
    englishText: thematicData.nameEnUs,
  });
  return new Thematic({
    id: thematicData.id,
    name: translatedName,
    index: thematicData.index,
    tubeIds: thematicData.tubeIds,
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async list() {
    const thematicData = await thematicDatasource.list();
    return thematicData.map(_toDomain);
  },

  async findByCompetenceIds(competenceIds: $TSFixMe, locale: $TSFixMe) {
    const thematicDatas = await thematicDatasource.findByCompetenceIds(competenceIds);
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 2.
    return thematicDatas.map((thematicData: $TSFixMe) => _toDomain(thematicData, locale));
  },
};
