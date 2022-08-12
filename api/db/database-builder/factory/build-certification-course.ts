// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildSessi... Remove this comment to see the full error message
const buildSession = require('./build-session');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildUser'... Remove this comment to see the full error message
const buildUser = require('./build-user');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCertificationCourse({
  id = databaseBuffer.getNextId(),
  lastName = 'last-name',
  firstName = 'first-name',
  birthdate = '2001-05-21',
  birthplace = 'Paris',
  sex = 'F',
  birthPostalCode = null,
  birthINSEECode = '75101',
  birthCountry = 'FRANCE',
  externalId = 'externalId',
  hasSeenEndTestScreen = false,
  createdAt = new Date('2020-01-01'),
  updatedAt = new Date('2020-02-01'),
  completedAt = new Date('2020-03-01'),
  isPublished = true,
  verificationCode = `P-AB789TTY${id}`,
  isV2Certification = true,
  userId,
  sessionId,
  maxReachableLevelOnCertificationDate = 5,
  isCancelled = false,
  abortReason = null
}: $TSFixMe = {}) {
  userId = _.isUndefined(userId) ? buildUser().id : userId;
  sessionId = _.isUndefined(sessionId) ? buildSession().id : sessionId;
  const values = {
    id,
    firstName,
    lastName,
    birthdate,
    birthplace,
    birthPostalCode,
    birthINSEECode,
    birthCountry,
    sex,
    externalId,
    hasSeenEndTestScreen,
    createdAt,
    updatedAt,
    completedAt,
    isPublished,
    verificationCode,
    isV2Certification,
    userId,
    sessionId,
    maxReachableLevelOnCertificationDate,
    isCancelled,
    abortReason,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'certification-courses',
    values,
  });
};
