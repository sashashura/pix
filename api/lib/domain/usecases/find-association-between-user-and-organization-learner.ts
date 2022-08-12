const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignCo... Remove this comment to see the full error message
  CampaignCodeError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
  UserNotAuthorizedToAccessEntityError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationLearnerDisabledError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function findAssociationBetweenUserAndOrganizationLearner({
  authenticatedUserId,
  requestedUserId,
  campaignCode,
  campaignRepository,
  organizationLearnerRepository
}: $TSFixMe) {
  if (authenticatedUserId !== requestedUserId) {
    throw new UserNotAuthorizedToAccessEntityError();
  }

  const campaign = await campaignRepository.getByCode(campaignCode);
  if (!campaign) {
    throw new CampaignCodeError();
  }

  const organizationLearner = await organizationLearnerRepository.findOneByUserIdAndOrganizationId({
    userId: authenticatedUserId,
    organizationId: campaign.organizationId,
  });

  if (organizationLearner && organizationLearner.isDisabled) {
    throw new OrganizationLearnerDisabledError();
  }

  return organizationLearner;
};
