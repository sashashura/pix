// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildAnswe... Remove this comment to see the full error message
const buildAnswer = require('./build-answer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildFlashAssessmentResult({
  id = databaseBuffer.getNextId(),
  answerId,
  assessmentId,
  estimatedLevel = 2.64,
  errorRate = 0.391
}: $TSFixMe = {}) {
  if (!answerId && !assessmentId) throw new Error('either `answerId` or `assessmentId` must be defined');
  if (!answerId) answerId = buildAnswer({ assessmentId }).id;
  return databaseBuffer.pushInsertable({
    tableName: 'flash-assessment-results',
    values: {
      id,
      answerId,
      estimatedLevel,
      errorRate,
    },
  });
};
