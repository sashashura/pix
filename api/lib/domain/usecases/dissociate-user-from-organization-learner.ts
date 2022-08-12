// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const { OrganizationLearnerCannotBeDissociatedError } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function dissociateUserFromOrganizationLearner({
  organizationLearnerId,
  organizationLearnerRepository
}: $TSFixMe) {
  const organizationLearnerForAdmin = await organizationLearnerRepository.getOrganizationLearnerForAdmin(
    organizationLearnerId
  );
  if (!organizationLearnerForAdmin.canBeDissociated) {
    throw new OrganizationLearnerCannotBeDissociatedError();
  }

  await organizationLearnerRepository.dissociateUserFromOrganizationLearner(organizationLearnerId);
};
