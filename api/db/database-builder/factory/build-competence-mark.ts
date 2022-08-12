// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildAssessmentResult = require('./build-assessment-result');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCompetenceMark({
  id = databaseBuffer.getNextId(),
  level = 5,
  score = 42,
  area_code = '1',
  competence_code = '1.1',
  competenceId = 'recABC123',
  assessmentResultId,
  createdAt = new Date('2020-01-01')
}: $TSFixMe = {}) {
  assessmentResultId = _.isUndefined(assessmentResultId) ? buildAssessmentResult().id : assessmentResultId;

  const values = {
    id,
    level,
    score,
    area_code,
    competence_code,
    competenceId,
    assessmentResultId,
    createdAt,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'competence-marks',
    values,
  });
};
