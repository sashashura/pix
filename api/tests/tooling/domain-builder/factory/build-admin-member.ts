// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AdminMembe... Remove this comment to see the full error message
const AdminMember = require('../../../../lib/domain/models/AdminMember');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ROLES'.
const { ROLES } = require('../../../../lib/domain/constants').PIX_ADMIN;

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildAdminMember({
  id = 1,
  userId = 1,
  firstName = 'Dimitri',
  lastName = 'Kramatorsk',
  email = 'dimitri.k@pix.fr',
  role = ROLES.SUPER_ADMIN,
  createdAt = new Date(2022, 4, 11),
  updatedAt,
  disabledAt
}: $TSFixMe = {}) {
  return new AdminMember({ id, userId, firstName, lastName, email, role, createdAt, updatedAt, disabledAt });
};
