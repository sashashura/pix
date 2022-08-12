// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignCo... Remove this comment to see the full error message
const { CampaignCodeError, UserCouldNotBeReconciledError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function reconcileScoOrganizationLearnerAutomatically({
  campaignCode,
  userId,
  campaignRepository,
  organizationLearnerRepository
}: $TSFixMe) {
  const campaign = await campaignRepository.getByCode(campaignCode);
  if (!campaign) {
    throw new CampaignCodeError();
  }

  const studentOrganizationLearners = await organizationLearnerRepository.findByUserId({ userId });

  if (_.isEmpty(studentOrganizationLearners)) {
    throw new UserCouldNotBeReconciledError();
  }

  const nationalStudentIdForReconcile = _.orderBy(studentOrganizationLearners, 'updatedAt', 'desc')[0]
    .nationalStudentId;

  return organizationLearnerRepository.reconcileUserByNationalStudentIdAndOrganizationId({
    userId,
    nationalStudentId: nationalStudentIdForReconcile,
    organizationId: campaign.organizationId,
  });
};
