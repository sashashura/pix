// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError, UserNotAuthorizedToAccessEntityError } = require('../../domain/errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getCampaign({
  campaignId,
  userId,
  badgeRepository,
  campaignRepository,
  campaignReportRepository,
  stageRepository
}: $TSFixMe) {
  const integerCampaignId = parseInt(campaignId);
  if (!Number.isFinite(integerCampaignId)) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError(`Campaign not found for ID ${campaignId}`);
  }

  const userHasAccessToCampaign = await campaignRepository.checkIfUserOrganizationHasAccessToCampaign(
    campaignId,
    userId
  );
  if (!userHasAccessToCampaign) {
    throw new UserNotAuthorizedToAccessEntityError('User does not belong to the organization that owns the campaign');
  }

  const [campaignReport, badges, stages, masteryRates] = await Promise.all([
    campaignReportRepository.get(integerCampaignId),
    badgeRepository.findByCampaignId(integerCampaignId),
    stageRepository.findByCampaignId(integerCampaignId),
    campaignReportRepository.findMasteryRates(integerCampaignId),
  ]);

  campaignReport.badges = badges;
  campaignReport.stages = stages;
  if (campaignReport.isAssessment) {
    campaignReport.computeAverageResult(masteryRates);
  }
  return campaignReport;
};
