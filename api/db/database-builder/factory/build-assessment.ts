// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCerti... Remove this comment to see the full error message
const buildCertificationCourse = require('./build-certification-course');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildUser'... Remove this comment to see the full error message
const buildUser = require('./build-user');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildAssessment({
  id = databaseBuffer.getNextId(),
  courseId = 'recDefaultCourseId',
  certificationCourseId,
  userId,
  type = Assessment.types.COMPETENCE_EVALUATION,
  state = Assessment.states.COMPLETED,
  isImproving = false,
  lastQuestionDate = new Date(),
  lastChallengeId = null,
  lastQuestionState = Assessment.statesOfLastQuestion.ASKED,
  competenceId = 'recCompetenceId',
  campaignParticipationId = null,
  createdAt = new Date('2020-01-01'),
  updatedAt = new Date('2020-01-02'),
  method
}: $TSFixMe = {}) {
  if (type !== Assessment.types.DEMO) {
    userId = _.isUndefined(userId) ? buildUser().id : userId;
  }

  if (type === Assessment.types.CERTIFICATION) {
    certificationCourseId = _.isUndefined(certificationCourseId)
      ? buildCertificationCourse({ userId }).id
      : certificationCourseId;
  }

  const values = {
    id,
    courseId,
    certificationCourseId,
    userId,
    type,
    isImproving,
    state,
    lastQuestionDate,
    lastChallengeId,
    lastQuestionState,
    createdAt,
    updatedAt,
    competenceId,
    campaignParticipationId,
    method,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'assessments',
    values,
  });
};
