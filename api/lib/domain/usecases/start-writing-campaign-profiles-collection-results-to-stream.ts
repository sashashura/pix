// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToGetCampaignResultsError } = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPr... Remove this comment to see the full error message
const CampaignProfilesCollectionExport = require('../../infrastructure/serializers/csv/campaign-profiles-collection-export');

async function _checkCreatorHasAccessToCampaignOrganization(userId: $TSFixMe, organizationId: $TSFixMe, userRepository: $TSFixMe) {
  const user = await userRepository.getWithMemberships(userId);

  if (!user.hasAccessToOrganization(organizationId)) {
    throw new UserNotAuthorizedToGetCampaignResultsError(
      `User does not have an access to the organization ${organizationId}`
    );
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function startWritingCampaignProfilesCollectionResultsToStream({
  userId,
  campaignId,
  writableStream,
  i18n,
  campaignRepository,
  userRepository,
  competenceRepository,
  campaignParticipationRepository,
  organizationRepository,
  placementProfileService
}: $TSFixMe) {
  const campaign = await campaignRepository.get(campaignId);
  const translate = i18n.__;

  await _checkCreatorHasAccessToCampaignOrganization(userId, campaign.organizationId, userRepository);

  const [allPixCompetences, organization, campaignParticipationResultDatas] = await Promise.all([
    competenceRepository.listPixCompetencesOnly({ locale: i18n.getLocale() }),
    organizationRepository.get(campaign.organizationId),
    campaignParticipationRepository.findProfilesCollectionResultDataByCampaignId(campaign.id),
  ]);

  const campaignProfilesCollectionExport = new CampaignProfilesCollectionExport(
    writableStream,
    organization,
    campaign,
    allPixCompetences,
    translate
  );

  // No return/await here, we need the writing to continue in the background
  // after this function's returned promise resolves. If we await the map
  // function, node will keep all the data in memory until the end of the
  // complete operation.
  campaignProfilesCollectionExport
    .export(campaignParticipationResultDatas, placementProfileService)
    .then(() => {
      writableStream.end();
    })
    .catch((error: $TSFixMe) => {
      writableStream.emit('error', error);
      throw error;
    });

  const fileName = translate('campaign-export.common.file-name', {
    name: campaign.name,
    id: campaign.id,
    date: moment.utc().format('YYYY-MM-DD-hhmm'),
  });

  return { fileName };
};
