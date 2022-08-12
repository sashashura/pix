// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'LearningCo... Remove this comment to see the full error message
const LearningContentResourceNotFound = require('../datasources/learning-content/LearningContentResourceNotFound');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Area'.
const Area = require('../../domain/models/Area');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'areaDataso... Remove this comment to see the full error message
const areaDatasource = require('../datasources/learning-content/area-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const Competence = require('../../domain/models/Competence');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceDatasource = require('../datasources/learning-content/competence-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FRENCH_FRA... Remove this comment to see the full error message
const { FRENCH_FRANCE } = require('../../domain/constants').LOCALE;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_ORIGIN... Remove this comment to see the full error message
const { PIX_ORIGIN } = require('../../domain/constants');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getTransla... Remove this comment to see the full error message
const { getTranslatedText } = require('../../domain/services/get-translated-text');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain({
  competenceData,
  areaDatas,
  locale
}: $TSFixMe) {
  const areaData = competenceData.areaId && _.find(areaDatas, { id: competenceData.areaId });
  const translatedCompetenceName = getTranslatedText(locale, {
    frenchText: competenceData.nameFrFr,
    englishText: competenceData.nameEnUs,
  });
  const translatedCompetenceDescription = getTranslatedText(locale, {
    frenchText: competenceData.descriptionFrFr,
    englishText: competenceData.descriptionEnUs,
  });
  const translatedAreaTitle = areaData
    ? getTranslatedText(locale, { frenchText: areaData.titleFrFr, englishText: areaData.titleEnUs })
    : '';

  return new Competence({
    id: competenceData.id,
    name: translatedCompetenceName,
    index: competenceData.index,
    description: translatedCompetenceDescription,
    origin: competenceData.origin,
    skillIds: competenceData.skillIds,
    thematicIds: competenceData.thematicIds,
    area:
      areaData &&
      new Area({
        id: areaData.id,
        code: areaData.code,
        title: translatedAreaTitle,
        name: areaData.name,
        color: areaData.color,
        frameworkId: areaData.frameworkId,
      }),
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  list({ locale } = { locale: FRENCH_FRANCE }) {
    return _list({ locale: locale || FRENCH_FRANCE });
  },

  listPixCompetencesOnly({ locale } = { locale: FRENCH_FRANCE }) {
    return _list({ locale }).then((competences) =>
      competences.filter((competence: $TSFixMe) => competence.origin === PIX_ORIGIN)
    );
  },

  async get({
    id,
    locale
  }: $TSFixMe) {
    try {
      const [competenceData, areaDatas] = await Promise.all([competenceDatasource.get(id), areaDatasource.list()]);
      return _toDomain({ competenceData, areaDatas, locale });
    } catch (err) {
      if (err instanceof LearningContentResourceNotFound) {
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
        throw new NotFoundError('La compétence demandée n’existe pas');
      }
      throw err;
    }
  },

  async getCompetenceName({
    id,
    locale
  }: $TSFixMe) {
    try {
      const competence = await competenceDatasource.get(id);
      return getTranslatedText(locale, { frenchText: competence.nameFrFr, englishText: competence.nameEnUs });
    } catch (err) {
      if (err instanceof LearningContentResourceNotFound) {
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
        throw new NotFoundError('La compétence demandée n’existe pas');
      }
      throw err;
    }
  },

  async findByRecordIds({
    competenceIds,
    locale
  }: $TSFixMe) {
    const [competenceDatas, areaDatas] = await Promise.all([competenceDatasource.list(), areaDatasource.list()]);
    return competenceDatas
      .filter(({
      id
    }: $TSFixMe) => competenceIds.includes(id))
      .map((competenceData: $TSFixMe) => _toDomain({ competenceData, areaDatas, locale }));
  },
};

function _list({
  locale
}: $TSFixMe) {
  return Promise.all([competenceDatasource.list(), areaDatasource.list()]).then(([competenceDatas, areaDatas]) => {
    return _.sortBy(
      competenceDatas.map((competenceData: $TSFixMe) => _toDomain({ competenceData, areaDatas, locale })),
      'index'
    );
  });
}
