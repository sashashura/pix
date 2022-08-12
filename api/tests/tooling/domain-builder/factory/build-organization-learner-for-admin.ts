// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationLearnerForAdmin = require('../../../../lib/domain/read-models/OrganizationLearnerForAdmin');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildOrganizationLearnerForAdmin({
  id = 123,
  firstName = 'Super',
  lastName = 'Yvette',
  birthdate = '1959-01-05',
  division = '3eme',
  group = '4B',
  organizationId = 456,
  organizationName = 'name',
  createdAt = new Date('2020-01-01'),
  updatedAt = new Date('2020-01-01'),
  isDisabled = false,
  organizationIsManagingStudents = true,
} = {}) {
  return new OrganizationLearnerForAdmin({
    id,
    firstName,
    lastName,
    birthdate,
    division,
    group,
    organizationId,
    organizationName,
    createdAt,
    updatedAt,
    isDisabled,
    organizationIsManagingStudents,
  });
};
