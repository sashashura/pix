// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceMark = require('../../../../lib/domain/models/CompetenceMark');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCompetenceMark({
  id,
  level = 2,
  score = 13,
  area_code = '1',
  competence_code = '1.1',
  competenceId = 'recSomeCompetence',
  assessmentResultId
}: $TSFixMe = {}) {
  return new CompetenceMark({
    id,
    level,
    score,
    area_code,
    competence_code,
    competenceId,
    assessmentResultId,
  });
};
