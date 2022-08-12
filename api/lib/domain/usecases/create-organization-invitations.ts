// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationInvitationService = require('../../domain/services/organization-invitation-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const { OrganizationArchivedError } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createOrganizationInvitations({
  organizationId,
  emails,
  locale,
  organizationRepository,
  organizationInvitationRepository
}: $TSFixMe) {
  const organization = await organizationRepository.get(organizationId);

  if (organization.archivedAt) {
    throw new OrganizationArchivedError();
  }

  const trimmedEmails = emails.map((email: $TSFixMe) => email.trim());
  const uniqueEmails = [...new Set(trimmedEmails)];

  return bluebird.mapSeries(uniqueEmails, (email: $TSFixMe) => {
    return organizationInvitationService.createOrganizationInvitation({
      organizationRepository,
      organizationInvitationRepository,
      organizationId,
      email,
      locale,
    });
  });
};
