const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
  AlreadyExistingOrganizationInvitationError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CancelledO... Remove this comment to see the full error message
  CancelledOrganizationInvitationError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../domain/errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getOrganizationInvitation({
  organizationInvitationId,
  organizationInvitationCode,
  organizationRepository,
  organizationInvitationRepository
}: $TSFixMe) {
  const foundOrganizationInvitation = await organizationInvitationRepository.getByIdAndCode({
    id: organizationInvitationId,
    code: organizationInvitationCode,
  });

  if (foundOrganizationInvitation.isCancelled) {
    throw new CancelledOrganizationInvitationError(`Invitation was cancelled`);
  }

  if (foundOrganizationInvitation.isAccepted) {
    throw new AlreadyExistingOrganizationInvitationError(
      `Invitation already accepted with the id ${organizationInvitationId}`
    );
  }

  const { name: organizationName } = await organizationRepository.get(foundOrganizationInvitation.organizationId);
  foundOrganizationInvitation.organizationName = organizationName;

  return foundOrganizationInvitation;
};
