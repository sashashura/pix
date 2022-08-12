// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildAsses... Remove this comment to see the full error message
const buildAssessment = require('./build-assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildUser'... Remove this comment to see the full error message
const buildUser = require('./build-user');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentResult = require('../../../lib/domain/models/AssessmentResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildAssessmentResult({
  id = databaseBuffer.getNextId(),
  pixScore = 456,
  reproducibilityRate = null,
  level = null,
  status = AssessmentResult.status.VALIDATED,
  emitter = 'PIX-ALGO',
  commentForJury = 'Some comment for jury',
  commentForCandidate = 'Some comment for candidate',
  commentForOrganization = 'Some comment for organization',
  juryId,
  assessmentId,
  createdAt = new Date('2020-01-01')
}: $TSFixMe = {}) {
  assessmentId = _.isUndefined(assessmentId) ? buildAssessment().id : assessmentId;
  juryId = _.isUndefined(juryId) ? buildUser().id : juryId;

  const values = {
    id,
    pixScore,
    reproducibilityRate,
    level,
    status,
    emitter,
    commentForJury,
    commentForCandidate,
    commentForOrganization,
    juryId,
    assessmentId,
    createdAt,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'assessment-results',
    values,
  });
};
