// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationLearner = require('../../../../lib/domain/models/OrganizationLearner');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildOrgan... Remove this comment to see the full error message
const buildOrganization = require('./build-organization');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildOrgan... Remove this comment to see the full error message
function buildOrganizationLearner({
  id = 123,
  organization = buildOrganization({ isManagingStudents: true }),
  lastName = 'India',
  preferredLastName = 'China',
  firstName = 'Korea',
  middleName = 'Japan',
  thirdName = 'Thailand',
  sex = 'F',
  birthdate = '2005-10-02',
  birthCity = 'Perpignan',
  birthCityCode = '1023',
  birthCountryCode = '100',
  birthProvinceCode = '66',
  MEFCode = 'SUPERMEF123',
  status = 'ST',
  nationalStudentId = null,
  division = 'B1',
  userId,
  isDisabled = false,
  updatedAt = new Date('2020-01-01')
}: $TSFixMe = {}) {
  return new OrganizationLearner({
    id,
    lastName,
    preferredLastName,
    firstName,
    middleName,
    thirdName,
    sex,
    birthdate,
    birthCity,
    birthCityCode,
    birthCountryCode,
    birthProvinceCode,
    MEFCode,
    status,
    nationalStudentId,
    division,
    updatedAt,
    userId,
    isDisabled,
    organizationId: organization.id,
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildOrganizationLearner;
