// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'prescriber... Remove this comment to see the full error message
const prescriberRoleRepository = require('../../infrastructure/repositories/prescriber-role-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignAu... Remove this comment to see the full error message
const CampaignAuthorization = require('../preHandlers/models/CampaignAuthorization');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async execute({
    userId,
    campaignId
  }: $TSFixMe) {
    const prescriberRole = await prescriberRoleRepository.getForCampaign({ userId, campaignId });
    return CampaignAuthorization.isAllowedToManage({ prescriberRole });
  },
};
