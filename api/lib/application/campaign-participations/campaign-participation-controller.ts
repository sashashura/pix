// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'monitoring... Remove this comment to see the full error message
const monitoringTools = require('../../infrastructure/monitoring-tools');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'events'.
const events = require('../../domain/events');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'queryParam... Remove this comment to see the full error message
const queryParamsUtils = require('../../infrastructure/utils/query-params-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignPa... Remove this comment to see the full error message
const campaignParticipationSerializer = require('../../infrastructure/serializers/jsonapi/campaign-participation-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignAn... Remove this comment to see the full error message
const campaignAnalysisSerializer = require('../../infrastructure/serializers/jsonapi/campaign-analysis-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const campaignAssessmentParticipationSerializer = require('../../infrastructure/serializers/jsonapi/campaign-assessment-participation-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignAs... Remove this comment to see the full error message
const campaignAssessmentParticipationResultSerializer = require('../../infrastructure/serializers/jsonapi/campaign-assessment-participation-result-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignPr... Remove this comment to see the full error message
const campaignProfileSerializer = require('../../infrastructure/serializers/jsonapi/campaign-profile-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const campaignAssessmentResultMinimalSerializer = require('../../infrastructure/serializers/jsonapi/campaign-assessment-result-minimal-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'trainingSe... Remove this comment to see the full error message
const trainingSerializer = require('../../infrastructure/serializers/jsonapi/training-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'requestRes... Remove this comment to see the full error message
const requestResponseUtils = require('../../infrastructure/utils/request-response-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../infrastructure/DomainTransaction');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'extractLoc... Remove this comment to see the full error message
const { extractLocaleFromRequest } = require('../../infrastructure/utils/request-response-utils');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async save(request: $TSFixMe, h: $TSFixMe) {
    const userId = request.auth.credentials.userId;
    const campaignParticipation = await campaignParticipationSerializer.deserialize(request.payload);

    const { event, campaignParticipation: campaignParticipationCreated } = await DomainTransaction.execute(
      (domainTransaction: $TSFixMe) => {
        return usecases.startCampaignParticipation({ campaignParticipation, userId, domainTransaction });
      }
    );

    events.eventDispatcher
      .dispatch(event)
      .catch((error: $TSFixMe) => monitoringTools.logErrorWithCorrelationIds({ message: error }));

    return h.response(campaignParticipationSerializer.serialize(campaignParticipationCreated)).created();
  },

  async shareCampaignResult(request: $TSFixMe) {
    const userId = request.auth.credentials.userId;
    const campaignParticipationId = request.params.id;

    const event = await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
      const event = await usecases.shareCampaignResult({
        userId,
        campaignParticipationId,
        domainTransaction,
      });
      await events.eventBus.publish(event, domainTransaction);
      return event;
    });
    events.eventDispatcher
      .dispatch(event)
      .catch((error: $TSFixMe) => monitoringTools.logErrorWithCorrelationIds({ message: error }));
    return null;
  },

  async beginImprovement(request: $TSFixMe) {
    const userId = request.auth.credentials.userId;
    const campaignParticipationId = request.params.id;

    return DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
      await usecases.beginCampaignParticipationImprovement({
        campaignParticipationId,
        userId,
        domainTransaction,
      });
      return null;
    });
  },

  async getAnalysis(request: $TSFixMe) {
    const { userId } = request.auth.credentials;
    const campaignParticipationId = request.params.id;
    const locale = extractLocaleFromRequest(request);

    const campaignAnalysis = await usecases.computeCampaignParticipationAnalysis({
      userId,
      campaignParticipationId,
      locale,
    });
    return campaignAnalysisSerializer.serialize(campaignAnalysis);
  },

  async getCampaignProfile(request: $TSFixMe) {
    const { userId } = request.auth.credentials;
    const { campaignId, campaignParticipationId } = request.params;
    const locale = extractLocaleFromRequest(request);

    const campaignProfile = await usecases.getCampaignProfile({ userId, campaignId, campaignParticipationId, locale });
    return campaignProfileSerializer.serialize(campaignProfile);
  },

  async getCampaignAssessmentParticipation(request: $TSFixMe) {
    const { userId } = request.auth.credentials;
    const { campaignId, campaignParticipationId } = request.params;

    const campaignAssessmentParticipation = await usecases.getCampaignAssessmentParticipation({
      userId,
      campaignId,
      campaignParticipationId,
    });
    return campaignAssessmentParticipationSerializer.serialize(campaignAssessmentParticipation);
  },

  async deleteParticipation(request: $TSFixMe, h: $TSFixMe) {
    const { userId } = request.auth.credentials;
    const { id, campaignParticipationId } = request.params;
    await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
      await usecases.deleteCampaignParticipation({
        userId,
        campaignId: id,
        campaignParticipationId,
        domainTransaction,
      });
    });
    return h.response({}).code(204);
  },

  async getCampaignAssessmentParticipationResult(request: $TSFixMe) {
    const { userId } = request.auth.credentials;
    const { campaignId, campaignParticipationId } = request.params;
    const locale = extractLocaleFromRequest(request);

    const campaignAssessmentParticipationResult = await usecases.getCampaignAssessmentParticipationResult({
      userId,
      campaignId,
      campaignParticipationId,
      locale,
    });
    return campaignAssessmentParticipationResultSerializer.serialize(campaignAssessmentParticipationResult);
  },

  async findAssessmentParticipationResults(request: $TSFixMe) {
    const campaignId = request.params.id;
    const { page, filter: filters } = queryParamsUtils.extractParameters(request.query);
    if (filters.divisions && !Array.isArray(filters.divisions)) {
      filters.divisions = [filters.divisions];
    }
    if (filters.groups && !Array.isArray(filters.groups)) {
      filters.groups = [filters.groups];
    }
    if (filters.badges && !Array.isArray(filters.badges)) {
      filters.badges = [filters.badges];
    }
    if (filters.stages && !Array.isArray(filters.stages)) {
      filters.stages = [filters.stages];
    }
    const currentUserId = requestResponseUtils.extractUserIdFromRequest(request);
    const paginatedParticipations = await usecases.findAssessmentParticipationResultList({
      userId: currentUserId,
      campaignId,
      page,
      filters,
    });
    return campaignAssessmentResultMinimalSerializer.serialize(paginatedParticipations);
  },

  async updateParticipantExternalId(request: $TSFixMe, h: $TSFixMe) {
    const campaignParticipationId = request.params.id;
    const participantExternalId = request.payload.data.attributes['participant-external-id'];

    await usecases.updateParticipantExternalId({ campaignParticipationId, participantExternalId });
    return h.response({}).code(204);
  },

  async deleteCampaignParticipationForAdmin(request: $TSFixMe, h: $TSFixMe) {
    const { userId } = request.auth.credentials;
    const { id: campaignParticipationId } = request.params;
    await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
      await usecases.deleteCampaignParticipationForAdmin({
        userId,
        campaignParticipationId,
        domainTransaction,
      });
    });
    return h.response({}).code(204);
  },

  async findTrainings(request: $TSFixMe) {
    const { userId } = request.auth.credentials;
    const { id: campaignParticipationId } = request.params;
    const locale = extractLocaleFromRequest(request);

    const trainings = await usecases.findCampaignParticipationTrainings({ userId, campaignParticipationId, locale });
    return trainingSerializer.serialize(trainings);
  },
};
