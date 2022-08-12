// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SupOrganiz... Remove this comment to see the full error message
const SupOrganizationLearner = require('../../../../lib/domain/models/SupOrganizationLearner');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildOrganization = require('./build-organization');

function buildSupOrganizationLearner({
  organization = buildOrganization({ isManagingStudents: true }),
  lastName = 'Hanin',
  preferredLastName = 'ninin',
  firstName = 'Roger',
  middleName = 'Huguette',
  thirdName = 'Tom',
  birthdate = '1985-01-01',
  studentNumber = 'ABC123',
  email = 'roger.hanin@example.net',
  educationalTeam = 'team',
  department = 'dpt',
  group = 'grp12',
  diploma = 'licence',
  studyScheme = 'sch23',
} = {}) {
  return new SupOrganizationLearner({
    firstName,
    middleName,
    thirdName,
    lastName,
    preferredLastName,
    studentNumber,
    email,
    birthdate,
    diploma,
    department,
    educationalTeam,
    group,
    studyScheme,
    organizationId: organization.id,
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildSupOrganizationLearner;
