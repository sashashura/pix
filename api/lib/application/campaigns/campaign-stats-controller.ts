// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const participationsByStageSerializer = require('../../infrastructure/serializers/jsonapi/campaign-participations-count-by-stage-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const participationsByStatusSerializer = require('../../infrastructure/serializers/jsonapi/campaign-participations-counts-by-status-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const participationsByDaySerializer = require('../../infrastructure/serializers/jsonapi/campaign-participations-counts-by-day-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const participationsCountByMasteryRateSerializer = require('../../infrastructure/serializers/jsonapi/participations-count-by-mastery-rate');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getParticipationsByStage(request: $TSFixMe) {
    const { userId } = request.auth.credentials;
    const campaignId = request.params.id;

    const participationsByStage = await usecases.getCampaignParticipationsCountByStage({ userId, campaignId });

    return participationsByStageSerializer.serialize({
      campaignId,
      data: participationsByStage,
    });
  },

  async getParticipationsByStatus(request: $TSFixMe) {
    const { userId } = request.auth.credentials;
    const campaignId = request.params.id;

    const participantsCounts = await usecases.getCampaignParticipationsCountsByStatus({ userId, campaignId });

    return participationsByStatusSerializer.serialize({
      campaignId,
      ...participantsCounts,
    });
  },

  async getParticipationsByDay(request: $TSFixMe) {
    const { userId } = request.auth.credentials;
    const campaignId = request.params.id;

    const participantsCounts = await usecases.getCampaignParticipationsActivityByDay({ userId, campaignId });

    return participationsByDaySerializer.serialize({
      campaignId,
      ...participantsCounts,
    });
  },

  async getParticipationsCountByMasteryRate(request: $TSFixMe) {
    const { userId } = request.auth.credentials;
    const campaignId = request.params.id;

    const resultDistribution = await usecases.getParticipationsCountByMasteryRate({ userId, campaignId });

    return participationsCountByMasteryRateSerializer.serialize({
      campaignId,
      resultDistribution,
    });
  },
};
