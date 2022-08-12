// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tube'.
const Tube = require('../../domain/models/Tube');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tubeDataso... Remove this comment to see the full error message
const tubeDatasource = require('../datasources/learning-content/tube-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillDatas... Remove this comment to see the full error message
const skillDatasource = require('../datasources/learning-content/skill-datasource');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getTransla... Remove this comment to see the full error message
const { getTranslatedText } = require('../../domain/services/get-translated-text');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain({
  tubeData,
  locale
}: $TSFixMe) {
  const translatedPracticalTitle = getTranslatedText(locale, {
    frenchText: tubeData.practicalTitleFrFr,
    englishText: tubeData.practicalTitleEnUs,
  });
  const translatedPracticalDescription = getTranslatedText(locale, {
    frenchText: tubeData.practicalDescriptionFrFr,
    englishText: tubeData.practicalDescriptionEnUs,
  });

  return new Tube({
    id: tubeData.id,
    name: tubeData.name,
    title: tubeData.title,
    description: tubeData.description,
    practicalTitle: translatedPracticalTitle,
    practicalDescription: translatedPracticalDescription,
    competenceId: tubeData.competenceId,
  });
}

async function _findActive(tubes: $TSFixMe) {
  // @ts-expect-error TS(7031): Binding element 'tubeId' implicitly has an 'any' t... Remove this comment to see the full error message
  return bluebird.filter(tubes, async ({ id: tubeId }) => {
    const activeSkills = await skillDatasource.findActiveByTubeId(tubeId);
    return activeSkills.length > 0;
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(id: $TSFixMe) {
    const tubeData = await tubeDatasource.get(id);
    return _toDomain({ tubeData });
  },

  async list() {
    const tubeDatas = await tubeDatasource.list();
    const tubes = _.map(tubeDatas, (tubeData: $TSFixMe) => _toDomain({ tubeData }));
    return _.orderBy(tubes, (tube: $TSFixMe) => tube.name.toLowerCase());
  },

  async findByNames({
    tubeNames,
    locale
  }: $TSFixMe) {
    const tubeDatas = await tubeDatasource.findByNames(tubeNames);
    const tubes = _.map(tubeDatas, (tubeData: $TSFixMe) => _toDomain({ tubeData, locale }));
    return _.orderBy(tubes, (tube: $TSFixMe) => tube.name.toLowerCase());
  },

  async findActiveByRecordIds(tubeIds: $TSFixMe, locale: $TSFixMe) {
    const tubeDatas = await tubeDatasource.findByRecordIds(tubeIds);
    const activeTubes = await _findActive(tubeDatas);
    const tubes = _.map(activeTubes, (tubeData: $TSFixMe) => _toDomain({ tubeData, locale }));
    return _.orderBy(tubes, (tube: $TSFixMe) => tube.name.toLowerCase());
  },
};
