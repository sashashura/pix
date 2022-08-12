// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'randomStri... Remove this comment to see the full error message
const randomString = require('randomstring');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../models/Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mailServic... Remove this comment to see the full error message
const mailService = require('../../domain/services/mail-service');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_generateC... Remove this comment to see the full error message
const _generateCode = () => {
  return randomString.generate({ length: 10, capitalization: 'uppercase' });
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createOrga... Remove this comment to see the full error message
const createOrganizationInvitation = async ({
  organizationRepository,
  organizationInvitationRepository,
  organizationId,
  email,
  locale,
  tags,
  role
}: $TSFixMe) => {
  let organizationInvitation = await organizationInvitationRepository.findOnePendingByOrganizationIdAndEmail({
    organizationId,
    email,
  });

  if (!organizationInvitation) {
    const code = _generateCode();
    organizationInvitation = await organizationInvitationRepository.create({
      organizationId,
      email,
      code,
      role,
    });
  }

  const organization = await organizationRepository.get(organizationId);

  await mailService.sendOrganizationInvitationEmail({
    email,
    organizationName: organization.name,
    organizationInvitationId: organizationInvitation.id,
    code: organizationInvitation.code,
    locale,
    tags,
  });

  return await organizationInvitationRepository.updateModificationDate(organizationInvitation.id);
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createProO... Remove this comment to see the full error message
const createProOrganizationInvitation = async ({
  organizationInvitationRepository,
  organizationId,
  email,
  role,
  locale,
  tags,
  name
}: $TSFixMe) => {
  let organizationInvitation = await organizationInvitationRepository.findOnePendingByOrganizationIdAndEmail({
    organizationId,
    email,
  });

  if (!organizationInvitation) {
    const code = _generateCode();
    organizationInvitation = await organizationInvitationRepository.create({ organizationId, email, role, code });
  }

  await mailService.sendOrganizationInvitationEmail({
    email,
    name,
    organizationInvitationId: organizationInvitation.id,
    code: organizationInvitation.code,
    locale,
    tags,
  });

  await organizationInvitationRepository.updateModificationDate(organizationInvitation.id);

  return organizationInvitation;
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createScoO... Remove this comment to see the full error message
const createScoOrganizationInvitation = async ({
  organizationRepository,
  organizationInvitationRepository,
  organizationId,
  firstName,
  lastName,
  email,
  locale,
  tags
}: $TSFixMe) => {
  let organizationInvitation = await organizationInvitationRepository.findOnePendingByOrganizationIdAndEmail({
    organizationId,
    email,
  });

  if (!organizationInvitation) {
    const code = _generateCode();
    const role = Membership.roles.ADMIN;
    organizationInvitation = await organizationInvitationRepository.create({ organizationId, email, code, role });
  }

  const organization = await organizationRepository.get(organizationId);

  await mailService.sendScoOrganizationInvitationEmail({
    email,
    organizationName: organization.name,
    firstName,
    lastName,
    organizationInvitationId: organizationInvitation.id,
    code: organizationInvitation.code,
    locale,
    tags,
  });

  await organizationInvitationRepository.updateModificationDate(organizationInvitation.id);

  return organizationInvitation;
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  createOrganizationInvitation,
  createScoOrganizationInvitation,
  createProOrganizationInvitation,
};
