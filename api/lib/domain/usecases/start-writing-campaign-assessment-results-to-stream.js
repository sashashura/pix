const _ = require('lodash');
const moment = require('moment');
const { UserNotAuthorizedToGetCampaignResultsError, CampaignWithoutOrganizationError } = require('../errors');
const CsvCreator = require('../../infrastructure/serializers/csv/csv-creator');

module.exports = async function startWritingCampaignAssessmentResultsToStream(
  {
    userId,
    campaignId,
    writableStream,
    campaignRepository,
    userRepository,
    campaignParticipationInfoRepository,
  }) {

  const campaign = await campaignRepository.get(campaignId);

  await _checkCreatorHasAccessToCampaignOrganization(userId, campaign.organizationId, userRepository);

  const [campaignParticipationInfos] = await Promise.all([
    campaignParticipationInfoRepository.findByCampaignId(campaign.id),
  ]);

  //Create HEADER of CSV
  const csvCreator = new CsvCreator(writableStream, campaignId);
  await csvCreator.fetchData();
  csvCreator.createHeaderOfCSV();

  // No return/await here, we need the writing to continue in the background
  // after this function's returned promise resolves. If we await the map
  // function, node will keep all the data in memory until the end of the
  // complete operation.
  csvCreator.extracted(campaignParticipationInfos);

  const fileName = `Resultats-${campaign.name}-${campaign.id}-${moment.utc().format('YYYY-MM-DD-hhmm')}.csv`;
  return { fileName };
};

async function _checkCreatorHasAccessToCampaignOrganization(userId, organizationId, userRepository) {
  if (_.isNil(organizationId)) {
    throw new CampaignWithoutOrganizationError(`Campaign without organization : ${organizationId}`);
  }

  const user = await userRepository.getWithMemberships(userId);

  if (!user.hasAccessToOrganization(organizationId)) {
    throw new UserNotAuthorizedToGetCampaignResultsError(
      `User does not have an access to the organization ${organizationId}`
    );
  }
}

