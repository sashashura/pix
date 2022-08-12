// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const { OrganizationsToAttachToTargetProfile } = require('../models');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function attachOrganizationsFromExistingTargetProfile({
  targetProfileId,
  existingTargetProfileId,
  organizationsToAttachToTargetProfileRepository,
  targetProfileRepository
}: $TSFixMe) {
  const targetProfileOrganizations = new OrganizationsToAttachToTargetProfile({ id: targetProfileId });
  const organizationIds = await targetProfileRepository.findOrganizationIds(existingTargetProfileId);

  targetProfileOrganizations.attach(organizationIds);

  await organizationsToAttachToTargetProfileRepository.attachOrganizations(targetProfileOrganizations);
};
