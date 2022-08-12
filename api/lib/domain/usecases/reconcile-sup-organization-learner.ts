// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function reconcileSupOrganizationLearner({
  campaignCode,
  reconciliationInfo: { userId, studentNumber, firstName, lastName, birthdate },
  campaignRepository,
  supOrganizationLearnerRepository,
  organizationLearnerRepository,
  userReconciliationService
}: $TSFixMe) {
  const campaign = await campaignRepository.getByCode(campaignCode);
  if (!campaign) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
    throw new NotFoundError();
  }

  const matchedOrganizationLearner =
    await userReconciliationService.findMatchingSupOrganizationLearnerIdForGivenOrganizationIdAndUser({
      organizationId: campaign.organizationId,
      reconciliationInfo: { studentNumber, firstName, lastName, birthdate },
      supOrganizationLearnerRepository,
    });

  return organizationLearnerRepository.reconcileUserToOrganizationLearner({
    userId,
    organizationLearnerId: matchedOrganizationLearner.id,
  });
};
