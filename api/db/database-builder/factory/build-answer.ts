// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildAsses... Remove this comment to see the full error message
const buildAssessment = require('./build-assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildAnswer({
  id = databaseBuffer.getNextId(),
  value = 'Some value for answer',
  result = 'Some result for answer',
  assessmentId,
  challengeId = 'rec123ABC',
  createdAt = new Date('2020-01-01'),
  updatedAt = new Date('2020-01-02'),
  timeout = null,
  resultDetails = 'Some result details for answer.',
  timeSpent = 30
}: $TSFixMe = {}) {
  assessmentId = _.isUndefined(assessmentId) ? buildAssessment().id : assessmentId;

  const values = {
    id,
    value,
    result,
    assessmentId,
    challengeId,
    createdAt,
    updatedAt,
    timeout,
    resultDetails,
    timeSpent,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'answers',
    values,
  });
};
