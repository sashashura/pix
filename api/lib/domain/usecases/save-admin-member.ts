// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
const { AlreadyExistingAdminMemberError } = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AdminMembe... Remove this comment to see the full error message
const AdminMember = require('../models/AdminMember');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function saveAdminMember({
  email,
  role,
  userRepository,
  adminMemberRepository
}: $TSFixMe) {
  const { id: userId, firstName, lastName } = await userRepository.getByEmail(email);

  const adminMember = await adminMemberRepository.get({ userId });

  if (!adminMember) {
    const savedAdminMember = await adminMemberRepository.save({ userId, role });
    return new AdminMember({ ...savedAdminMember, email, firstName, lastName });
  }

  if (adminMember.disabledAt) {
    const updatedAdminMember = await adminMemberRepository.update({
      id: adminMember.id,
      attributesToUpdate: { role, disabledAt: null },
    });
    return new AdminMember({ ...updatedAdminMember, email, firstName, lastName });
  }

  throw new AlreadyExistingAdminMemberError();
};
