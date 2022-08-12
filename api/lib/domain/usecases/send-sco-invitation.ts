// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationNotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationWithoutEmailError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ManyOrgani... Remove this comment to see the full error message
  ManyOrganizationsFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationArchivedError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationInvitationService = require('../../domain/services/organization-invitation-service');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function sendScoInvitation({
  uai,
  firstName,
  lastName,
  locale,
  organizationRepository,
  organizationInvitationRepository
}: $TSFixMe) {
  const organizationWithGivenUAI = await _getOrganizationWithGivenUAI({ uai, organizationRepository });
  _ensureOrganizationHasAnEmail({ email: organizationWithGivenUAI.email, uai });
  _ensureOrganizationIsNotArchived(organizationWithGivenUAI);

  return await organizationInvitationService.createScoOrganizationInvitation({
    organizationId: organizationWithGivenUAI.id,
    email: organizationWithGivenUAI.email,
    firstName,
    lastName,
    locale,
    organizationRepository,
    organizationInvitationRepository,
  });
};

async function _getOrganizationWithGivenUAI({
  uai,
  organizationRepository
}: $TSFixMe) {
  const organizationsFound = await organizationRepository.findScoOrganizationsByUai({ uai: uai.trim() });
  _ensureThereIsNoMoreThanOneOrganization({ organizationCount: organizationsFound.length, uai });
  _ensureThereIsAtLeastOneOrganization({ organizationCount: organizationsFound.length, uai });
  return organizationsFound[0];
}

function _ensureThereIsAtLeastOneOrganization({
  organizationCount,
  uai
}: $TSFixMe) {
  if (organizationCount === 0) {
    const errorMessage = `L'UAI/RNE ${uai} de l'établissement n’est pas reconnu.`;
    throw new OrganizationNotFoundError(errorMessage);
  }
}

function _ensureThereIsNoMoreThanOneOrganization({
  organizationCount,
  uai
}: $TSFixMe) {
  if (organizationCount > 1) {
    const errorMessage = `Plusieurs établissements de type SCO ont été retrouvés pour L'UAI/RNE ${uai}.`;
    throw new ManyOrganizationsFoundError(errorMessage);
  }
}

function _ensureOrganizationHasAnEmail({
  email,
  uai
}: $TSFixMe) {
  if (_.isEmpty(email)) {
    const errorMessage = `Nous n’avons pas d’adresse e-mail de contact associée à l'établissement concernant l'UAI/RNE ${uai}.`;
    throw new OrganizationWithoutEmailError(errorMessage);
  }
}

function _ensureOrganizationIsNotArchived(organization: $TSFixMe) {
  if (organization.isArchived) {
    throw new OrganizationArchivedError();
  }
}
