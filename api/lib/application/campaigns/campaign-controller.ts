// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PassThroug... Remove this comment to see the full error message
const { PassThrough } = require('stream');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MissingQue... Remove this comment to see the full error message
const { MissingQueryParamError } = require('../http-errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('../../../lib/domain/services/token-service');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignTo... Remove this comment to see the full error message
const campaignToJoinSerializer = require('../../infrastructure/serializers/jsonapi/campaign-to-join-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignAn... Remove this comment to see the full error message
const campaignAnalysisSerializer = require('../../infrastructure/serializers/jsonapi/campaign-analysis-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignRe... Remove this comment to see the full error message
const campaignReportSerializer = require('../../infrastructure/serializers/jsonapi/campaign-report-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignCo... Remove this comment to see the full error message
const campaignCollectiveResultSerializer = require('../../infrastructure/serializers/jsonapi/campaign-collective-result-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const campaignProfilesCollectionParticipationSummarySerializer = require('../../infrastructure/serializers/jsonapi/campaign-profiles-collection-participation-summary-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignPa... Remove this comment to see the full error message
const campaignParticipantsActivitySerializer = require('../../infrastructure/serializers/jsonapi/campaign-participant-activity-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'divisionSe... Remove this comment to see the full error message
const divisionSerializer = require('../../infrastructure/serializers/jsonapi/division-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'groupSeria... Remove this comment to see the full error message
const groupSerializer = require('../../infrastructure/serializers/jsonapi/group-serializer');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'queryParam... Remove this comment to see the full error message
const queryParamsUtils = require('../../infrastructure/utils/query-params-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'requestRes... Remove this comment to see the full error message
const requestResponseUtils = require('../../infrastructure/utils/request-response-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'extractLoc... Remove this comment to see the full error message
const { extractLocaleFromRequest } = require('../../infrastructure/utils/request-response-utils');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async save(request: $TSFixMe, h: $TSFixMe) {
    const { userId: creatorId } = request.auth.credentials;
    const {
      name,
      type,
      title,
      'multiple-sendings': multipleSendings,
      'id-pix-label': idPixLabel,
      'custom-landing-page-text': customLandingPageText,
      'owner-id': ownerId,
    } = request.payload.data.attributes;
    // eslint-disable-next-line no-restricted-syntax
    const targetProfileId = parseInt(_.get(request, 'payload.data.relationships.target-profile.data.id')) || null;
    // eslint-disable-next-line no-restricted-syntax
    const organizationId = parseInt(_.get(request, 'payload.data.relationships.organization.data.id')) || null;

    const campaign = {
      name,
      type,
      title,
      idPixLabel,
      customLandingPageText,
      creatorId,
      ownerId: _getOwnerId(ownerId, creatorId),
      organizationId,
      targetProfileId,
      multipleSendings,
    };

    const createdCampaign = await usecases.createCampaign({ campaign });
    return h.response(campaignReportSerializer.serialize(createdCampaign)).created();
  },

  async getByCode(request: $TSFixMe) {
    const filters = queryParamsUtils.extractParameters(request.query).filter;
    await _validateFilters(filters);

    const campaignToJoin = await usecases.getCampaignByCode({ code: filters.code });
    return campaignToJoinSerializer.serialize(campaignToJoin);
  },

  async getById(request: $TSFixMe) {
    const { userId } = request.auth.credentials;
    const campaignId = request.params.id;

    const tokenForCampaignResults = tokenService.createTokenForCampaignResults(userId);

    const campaign = await usecases.getCampaign({ campaignId, userId });
    return campaignReportSerializer.serialize(campaign, {}, { tokenForCampaignResults });
  },

  async getCsvAssessmentResults(request: $TSFixMe) {
    const token = request.query.accessToken;
    const userId = tokenService.extractUserIdForCampaignResults(token);
    const campaignId = request.params.id;

    const writableStream = new PassThrough();

    const { fileName } = await usecases.startWritingCampaignAssessmentResultsToStream({
      userId,
      campaignId,
      writableStream,
      i18n: request.i18n,
    });
    const escapedFileName = requestResponseUtils.escapeFileName(fileName);

    writableStream.headers = {
      'content-type': 'text/csv;charset=utf-8',
      'content-disposition': `attachment; filename="${escapedFileName}"`,

      // WHY: to avoid compression because when compressing, the server buffers
      // for too long causing a response timeout.
      'content-encoding': 'identity',
    };

    return writableStream;
  },

  async getCsvProfilesCollectionResults(request: $TSFixMe) {
    const token = request.query.accessToken;
    const userId = tokenService.extractUserIdForCampaignResults(token);
    const campaignId = request.params.id;

    const writableStream = new PassThrough();

    const { fileName } = await usecases.startWritingCampaignProfilesCollectionResultsToStream({
      userId,
      campaignId,
      writableStream,
      i18n: request.i18n,
    });
    const escapedFileName = requestResponseUtils.escapeFileName(fileName);

    writableStream.headers = {
      'content-type': 'text/csv;charset=utf-8',
      'content-disposition': `attachment; filename="${escapedFileName}"`,

      // WHY: to avoid compression because when compressing, the server buffers
      // for too long causing a response timeout.
      'content-encoding': 'identity',
    };

    return writableStream;
  },

  update(request: $TSFixMe) {
    const { userId } = request.auth.credentials;
    const campaignId = request.params.id;

    return usecases
      .updateCampaign({ userId, campaignId, ...request.deserializedPayload })
      .then(campaignReportSerializer.serialize);
  },

  archiveCampaign(request: $TSFixMe) {
    const { userId } = request.auth.credentials;
    const campaignId = request.params.id;

    return usecases.archiveCampaign({ userId, campaignId }).then(campaignReportSerializer.serialize);
  },

  unarchiveCampaign(request: $TSFixMe) {
    const { userId } = request.auth.credentials;
    const campaignId = request.params.id;

    return usecases.unarchiveCampaign({ userId, campaignId }).then(campaignReportSerializer.serialize);
  },

  async getCollectiveResult(request: $TSFixMe) {
    const { userId } = request.auth.credentials;
    const campaignId = request.params.id;
    const locale = extractLocaleFromRequest(request);

    const campaignCollectiveResult = await usecases.computeCampaignCollectiveResult({ userId, campaignId, locale });
    return campaignCollectiveResultSerializer.serialize(campaignCollectiveResult);
  },

  async getAnalysis(request: $TSFixMe) {
    const { userId } = request.auth.credentials;
    const campaignId = request.params.id;
    const locale = extractLocaleFromRequest(request);

    const campaignAnalysis = await usecases.computeCampaignAnalysis({ userId, campaignId, locale });
    return campaignAnalysisSerializer.serialize(campaignAnalysis);
  },

  async findProfilesCollectionParticipations(request: $TSFixMe) {
    const { userId } = request.auth.credentials;
    const campaignId = request.params.id;
    const { page, filter: filters } = queryParamsUtils.extractParameters(request.query);
    if (filters.divisions && !Array.isArray(filters.divisions)) {
      filters.divisions = [filters.divisions];
    }
    if (filters.groups && !Array.isArray(filters.groups)) {
      filters.groups = [filters.groups];
    }
    const results = await usecases.findCampaignProfilesCollectionParticipationSummaries({
      userId,
      campaignId,
      page,
      filters,
    });
    return campaignProfilesCollectionParticipationSummarySerializer.serialize(results);
  },

  async findParticipantsActivity(request: $TSFixMe) {
    const campaignId = request.params.id;

    const { page, filter: filters } = queryParamsUtils.extractParameters(request.query);
    if (filters.divisions && !Array.isArray(filters.divisions)) {
      filters.divisions = [filters.divisions];
    }
    if (filters.groups && !Array.isArray(filters.groups)) {
      filters.groups = [filters.groups];
    }

    const { userId } = request.auth.credentials;
    const paginatedParticipations = await usecases.findPaginatedCampaignParticipantsActivities({
      userId,
      campaignId,
      page,
      filters,
    });

    return campaignParticipantsActivitySerializer.serialize(paginatedParticipations);
  },

  async division(request: $TSFixMe) {
    const { userId } = request.auth.credentials;
    const campaignId = request.params.id;

    const divisions = await usecases.getParticipantsDivision({ userId, campaignId });
    return divisionSerializer.serialize(divisions);
  },

  async getGroups(request: $TSFixMe) {
    const { userId } = request.auth.credentials;
    const campaignId = request.params.id;

    const groups = await usecases.getParticipantsGroup({ userId, campaignId });
    return groupSerializer.serialize(groups);
  },
};

function _validateFilters(filters: $TSFixMe) {
  if (typeof filters.code === 'undefined') {
    throw new MissingQueryParamError('filter.code');
  }
}

function _getOwnerId(ownerId: $TSFixMe, defaultOwnerId: $TSFixMe) {
  return ownerId ? ownerId : defaultOwnerId;
}
