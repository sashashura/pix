// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceResult = require('../../../../lib/domain/models/CompetenceResult');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCompetenceResult({
  id = 1,
  name = 'name',
  index = '1.1',
  areaColor = 'jaffa',
  areaName,
  totalSkillsCount = 10,
  testedSkillsCount = 8,
  validatedSkillsCount = 5
}: $TSFixMe = {}) {
  return new CompetenceResult({
    id,
    name,
    index,
    areaColor,
    areaName,
    totalSkillsCount,
    testedSkillsCount,
    validatedSkillsCount,
  });
};
