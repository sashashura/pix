// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
const { AlreadyExistingMembershipError } = require('../../domain/errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function acceptOrganizationInvitation({
  organizationInvitationId,
  code,
  email,
  organizationInvitationRepository,
  organizationInvitedUserRepository
}: $TSFixMe) {
  const organizationInvitedUser = await organizationInvitedUserRepository.get({ organizationInvitationId, email });

  try {
    organizationInvitedUser.acceptInvitation({ code });
  } catch (error) {
    if (error instanceof AlreadyExistingMembershipError) {
      await organizationInvitationRepository.markAsAccepted(organizationInvitationId);
    }
    throw error;
  }

  await organizationInvitedUserRepository.save({ organizationInvitedUser });
  return { id: organizationInvitedUser.currentMembershipId, isAdmin: organizationInvitedUser.currentRole === 'ADMIN' };
};
