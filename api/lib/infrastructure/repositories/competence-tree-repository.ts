// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'areaReposi... Remove this comment to see the full error message
const areaRepository = require('./area-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceTree = require('../../domain/models/CompetenceTree');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get({
    locale
  }: $TSFixMe = {}) {
    const areas = await areaRepository.listWithPixCompetencesOnly({ locale });
    return new CompetenceTree({ areas });
  },
};
