// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildOrgan... Remove this comment to see the full error message
const buildOrganization = require('./build-organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildUser'... Remove this comment to see the full error message
const buildUser = require('./build-user');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildOrganizationLearnerWithUser({
  id = databaseBuffer.getNextId(),
  firstName = 'first-name',
  preferredLastName = 'pref-last-name',
  lastName = 'last-name',
  middleName = 'Gontran',
  thirdName = 'Dorothée',
  birthdate = '2005-08-05',
  birthCity = 'Perpignan',
  birthCityCode = 'PERPICODE',
  birthCountryCode = '100',
  birthProvinceCode = '66',
  MEFCode = '45612312345',
  status = 'ST',
  studentNumber = null,
  nationalStudentId = null,
  division = '3eme',
  organizationId,
  user,

  // for BEGINNING_OF_THE_2020_SCHOOL_YEAR, can outdate very fast! ;)
  updatedAt = new Date('2021-01-01'),

  group = 'LB1'
}: $TSFixMe = {}) {
  organizationId = _.isUndefined(organizationId) ? buildOrganization().id : organizationId;
  const { id: userId } = buildUser(user);

  const values = {
    id,
    lastName,
    preferredLastName,
    firstName,
    middleName,
    thirdName,
    birthdate,
    birthCity,
    birthCityCode,
    birthCountryCode,
    birthProvinceCode,
    MEFCode,
    status,
    studentNumber,
    nationalStudentId,
    division,
    organizationId,
    userId,
    updatedAt,
    group,
  };

  return databaseBuffer.pushInsertable({
    tableName: 'organization-learners',
    values,
  });
};
