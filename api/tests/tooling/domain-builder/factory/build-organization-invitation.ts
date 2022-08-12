// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationInvitation = require('../../../../lib/domain/models/OrganizationInvitation');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildOrganizationInvitation({
  id = 123,
  organizationId = 456,
  organizationName = 'orgaName',
  email = 'coucou@example.net',
  status = OrganizationInvitation.StatusType.PENDING,
  code = 'ABCDE12345',
  role,
  createdAt = new Date('2020-01-01'),
  updatedAt = new Date('2020-01-02')
}: $TSFixMe = {}) {
  return new OrganizationInvitation({
    id,
    organizationId,
    organizationName,
    email,
    status,
    code,
    role,
    createdAt,
    updatedAt,
  });
};
