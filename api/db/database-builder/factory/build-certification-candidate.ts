// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildSessi... Remove this comment to see the full error message
const buildSession = require('./build-session');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildUser'... Remove this comment to see the full error message
const buildUser = require('./build-user');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCertificationCandidate({
  id = databaseBuffer.getNextId(),
  firstName = 'first-name',
  lastName = 'last-name',
  sex = 'M',
  birthPostalCode = null,
  birthINSEECode = '75101',
  birthCity = 'PARIS 1',
  birthProvinceCode = null,
  birthCountry = 'France',
  email = 'somemail@example.net',
  birthdate = '2000-01-04',
  resultRecipientEmail = 'somerecipientmail@example.net',
  sessionId,
  externalId = 'externalId',
  createdAt = new Date('2020-01-01'),
  extraTimePercentage = 0.3,
  userId,
  organizationLearnerId,
  authorizedToStart = false,
  billingMode = null,
  prepaymentCode = null
}: $TSFixMe = {}) {
  sessionId = _.isUndefined(sessionId) ? buildSession().id : sessionId;
  userId = _.isUndefined(userId) ? buildUser().id : userId;

  const values = {
    id,
    firstName,
    lastName,
    sex,
    birthPostalCode,
    birthINSEECode,
    birthCity,
    birthProvinceCode,
    birthCountry,
    email,
    resultRecipientEmail,
    birthdate,
    sessionId,
    externalId,
    extraTimePercentage,
    createdAt,
    userId,
    organizationLearnerId,
    authorizedToStart,
    billingMode,
    prepaymentCode,
  };

  databaseBuffer.pushInsertable({
    tableName: 'certification-candidates',
    values,
  });

  return {
    id,
    firstName,
    lastName,
    sex,
    birthPostalCode,
    birthINSEECode,
    birthCity,
    birthProvinceCode,
    birthCountry,
    email,
    resultRecipientEmail,
    birthdate,
    sessionId,
    externalId,
    extraTimePercentage,
    createdAt,
    userId,
    organizationLearnerId,
    authorizedToStart,
    billingMode,
    prepaymentCode,
  };
};
