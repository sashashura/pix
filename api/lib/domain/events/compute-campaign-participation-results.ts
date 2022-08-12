// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const CampaignParticipationResultShared = require('./CampaignParticipationResultsShared');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function computeCampaignParticipationResults({
  event,
  participantResultsSharedRepository,
  campaignParticipationRepository
}: $TSFixMe) {
  const { campaignParticipationId } = event;
  const participantResultsShared = await participantResultsSharedRepository.get(campaignParticipationId);
  await campaignParticipationRepository.update(participantResultsShared);
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports.eventTypes = [CampaignParticipationResultShared];
