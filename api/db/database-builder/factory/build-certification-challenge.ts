// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCerti... Remove this comment to see the full error message
const buildCertificationCourse = require('./build-certification-course');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCertificationChallenge({
  id = databaseBuffer.getNextId(),
  associatedSkillName = '@twi8',
  associatedSkillId = 'recSKIL123',
  challengeId = 'recCHAL456',
  competenceId = 'recCOMP789',
  courseId,
  createdAt = new Date('2020-01-01'),
  updatedAt = new Date('2020-01-02'),
  isNeutralized = false,
  hasBeenSkippedAutomatically = false,
  certifiableBadgeKey = null
}: $TSFixMe = {}) {
  courseId = _.isUndefined(courseId) ? buildCertificationCourse().id : courseId;

  const values = {
    id,
    associatedSkillName,
    associatedSkillId,
    challengeId,
    competenceId,
    courseId,
    createdAt,
    updatedAt,
    isNeutralized,
    hasBeenSkippedAutomatically,
    certifiableBadgeKey,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'certification-challenges',
    values,
  });
};
