const _ = require('lodash');
const { NoOrganizationToAttach } = require('../errors');

module.exports = async function attachOrganizationsFromExistingTargetProfile({
  targetProfileId,
  existingTargetProfileId,
  targetProfileRepository,
}) {
  const organizationIds = await targetProfileRepository.findOrganizationIds(existingTargetProfileId);
  if (_.isEmpty(organizationIds)) {
    throw new NoOrganizationToAttach(`Le profil cible ${existingTargetProfileId} n'a aucune organisation rattachée.`);
  }

  const targetProfile = await targetProfileRepository.get(targetProfileId);
  targetProfile.addOrganizations(organizationIds);

  await targetProfileRepository.attachOrganizations(targetProfile);
};
