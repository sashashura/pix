// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'csvSeriali... Remove this comment to see the full error message
const csvSerializer = require('../../infrastructure/serializers/csv/csv-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SupOrganiz... Remove this comment to see the full error message
const SupOrganizationLearnerColumns = require('../../infrastructure/serializers/csv/sup-organization-learner-columns');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getOrganizationLearnersCsvTemplate({
  userId,
  organizationId,
  i18n,
  membershipRepository
}: $TSFixMe) {
  const [membership] = await membershipRepository.findByUserIdAndOrganizationId({
    userId,
    organizationId,
    includeOrganization: true,
  });

  if (!_isAdminOrganizationManagingStudent(membership)) {
    throw new UserNotAuthorizedToAccessEntityError('User is not allowed to download csv template.');
  }

  const header = _getCsvColumns(new SupOrganizationLearnerColumns(i18n).columns);

  return _createHeaderOfCSV(header);
};

function _getCsvColumns(columns: $TSFixMe) {
  return columns.map((column: $TSFixMe) => column.label);
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _createHeaderOfCSV(header: $TSFixMe) {
  // WHY: add \uFEFF the UTF-8 BOM at the start of the text, see:
  // - https://en.wikipedia.org/wiki/Byte_order_mark
  // - https://stackoverflow.com/a/38192870
  return '\uFEFF' + csvSerializer.serializeLine(header);
}

function _isAdminOrganizationManagingStudent(membership: $TSFixMe) {
  return (
    membership && membership.isAdmin && membership.organization.isManagingStudents && membership.organization.isSup
  );
}
