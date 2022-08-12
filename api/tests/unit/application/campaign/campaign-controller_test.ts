// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, domainBuilder, hFake, catchErr } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignCo... Remove this comment to see the full error message
const campaignController = require('../../../../lib/application/campaigns/campaign-controller');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignAn... Remove this comment to see the full error message
const campaignAnalysisSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/campaign-analysis-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignRe... Remove this comment to see the full error message
const campaignReportSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/campaign-report-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignCo... Remove this comment to see the full error message
const campaignCollectiveResultSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/campaign-collective-result-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignPa... Remove this comment to see the full error message
const campaignParticipantsActivitySerializer = require('../../../../lib/infrastructure/serializers/jsonapi/campaign-participant-activity-serializer');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('../../../../lib/domain/services/token-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'queryParam... Remove this comment to see the full error message
const queryParamsUtils = require('../../../../lib/infrastructure/utils/query-params-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FRENCH_SPO... Remove this comment to see the full error message
const { FRENCH_SPOKEN } = require('../../../../lib/domain/constants').LOCALE;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Controller | Campaign', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#save', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'createCampaign');
      sinon.stub(campaignReportSerializer, 'serialize');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a serialized campaign when the campaign has been successfully created', async function () {
      // given
      const connectedUserId = 1;
      const ownerId = 4;
      const request = {
        auth: { credentials: { userId: connectedUserId } },
        payload: {
          data: {
            attributes: {
              name: 'name',
              type: 'ASSESSMENT',
              title: 'title',
              'id-pix-label': 'idPixLabel',
              'custom-landing-page-text': 'customLandingPageText',
              'multiple-sendings': true,
              'owner-id': ownerId,
            },
            relationships: {
              'target-profile': { data: { id: '123' } },
              organization: { data: { id: '456' } },
            },
          },
        },
        i18n: {
          __: sinon.stub(),
        },
      };
      const campaign = {
        name: 'name',
        type: 'ASSESSMENT',
        title: 'title',
        idPixLabel: 'idPixLabel',
        customLandingPageText: 'customLandingPageText',
        organizationId: 456,
        targetProfileId: 123,
        creatorId: 1,
        ownerId: 4,
        multipleSendings: true,
      };

      const expectedResult = Symbol('result');
      const createdCampaign = Symbol('created campaign');
      usecases.createCampaign.withArgs({ campaign }).resolves(createdCampaign);
      campaignReportSerializer.serialize.withArgs(createdCampaign).returns(expectedResult);

      // when
      const response = await campaignController.save(request, hFake);

      // then
      expect(response.source).to.equal(expectedResult);
      expect(response.statusCode).to.equal(201);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should set the creator as the owner when no owner is provided', async function () {
      // given
      const connectedUserId = 1;
      const request = {
        auth: { credentials: { userId: connectedUserId } },
        payload: {
          data: {
            attributes: {
              name: 'name',
              type: 'ASSESSMENT',
              title: 'title',
              'id-pix-label': 'idPixLabel',
              'custom-landing-page-text': 'customLandingPageText',
              'multiple-sendings': true,
            },
            relationships: {
              'target-profile': { data: { id: '123' } },
              organization: { data: { id: '456' } },
            },
          },
        },
        i18n: {
          __: sinon.stub(),
        },
      };
      const campaign = {
        name: 'name',
        type: 'ASSESSMENT',
        title: 'title',
        idPixLabel: 'idPixLabel',
        customLandingPageText: 'customLandingPageText',
        organizationId: 456,
        targetProfileId: 123,
        creatorId: 1,
        ownerId: 1,
        multipleSendings: true,
      };

      const expectedResult = Symbol('result');
      const createdCampaign = Symbol('created campaign');
      usecases.createCampaign.withArgs({ campaign }).resolves(createdCampaign);
      campaignReportSerializer.serialize.withArgs(createdCampaign).returns(expectedResult);

      // when
      const response = await campaignController.save(request, hFake);

      // then
      expect(response.source).to.equal(expectedResult);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getCsvAssessmentResults', function () {
    const userId = 1;
    const campaignId = 2;
    const request = {
      query: {
        accessToken: 'token',
      },
      params: {
        id: campaignId,
      },
      i18n: {
        // TODO: Fix this the next time the file is edited.
        // eslint-disable-next-line mocha/no-setup-in-describe
        __: sinon.stub(),
      },
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'startWritingCampaignAssessmentResultsToStream');
      sinon.stub(tokenService, 'extractUserIdForCampaignResults').resolves(userId);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call the use case to get result campaign in csv', async function () {
      // given
      usecases.startWritingCampaignAssessmentResultsToStream.resolves({ fileName: 'any file name' });

      // when
      await campaignController.getCsvAssessmentResults(request);

      // then
      expect(usecases.startWritingCampaignAssessmentResultsToStream).to.have.been.calledOnce;
      const getResultsCampaignArgs = usecases.startWritingCampaignAssessmentResultsToStream.firstCall.args[0];
      expect(getResultsCampaignArgs).to.have.property('userId');
      expect(getResultsCampaignArgs).to.have.property('campaignId');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a response with correct headers', async function () {
      // given
      usecases.startWritingCampaignAssessmentResultsToStream.resolves({ fileName: 'expected file name' });

      // when
      const response = await campaignController.getCsvAssessmentResults(request);

      // then
      expect(response.headers['content-type']).to.equal('text/csv;charset=utf-8');
      expect(response.headers['content-disposition']).to.equal('attachment; filename="expected file name"');
      expect(response.headers['content-encoding']).to.equal('identity');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should fix invalid header chars in filename', async function () {
      // given
      usecases.startWritingCampaignAssessmentResultsToStream.resolves({
        fileName: 'file-name with invalid_chars •’<>:"/\\|?*"\n.csv',
      });

      // when
      const response = await campaignController.getCsvAssessmentResults(request);

      // then
      expect(response.headers['content-disposition']).to.equal(
        'attachment; filename="file-name with invalid_chars _____________.csv"'
      );
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getCsvProfilesCollectionResult', function () {
    const userId = 1;
    const campaignId = 2;
    const request = {
      query: {
        accessToken: 'token',
      },
      params: {
        id: campaignId,
      },
      i18n: {
        // TODO: Fix this the next time the file is edited.
        // eslint-disable-next-line mocha/no-setup-in-describe
        __: sinon.stub(),
      },
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'startWritingCampaignProfilesCollectionResultsToStream');
      sinon.stub(tokenService, 'extractUserIdForCampaignResults').resolves(userId);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call the use case to get result campaign in csv', async function () {
      // given
      usecases.startWritingCampaignProfilesCollectionResultsToStream.resolves({ fileName: 'any file name' });

      // when
      await campaignController.getCsvProfilesCollectionResults(request);

      // then
      expect(usecases.startWritingCampaignProfilesCollectionResultsToStream).to.have.been.calledOnce;
      const getResultsCampaignArgs = usecases.startWritingCampaignProfilesCollectionResultsToStream.firstCall.args[0];
      expect(getResultsCampaignArgs).to.have.property('userId');
      expect(getResultsCampaignArgs).to.have.property('campaignId');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a response with correct headers', async function () {
      // given
      usecases.startWritingCampaignProfilesCollectionResultsToStream.resolves({ fileName: 'expected file name' });

      // when
      const response = await campaignController.getCsvProfilesCollectionResults(request);

      // then
      expect(response.headers['content-type']).to.equal('text/csv;charset=utf-8');
      expect(response.headers['content-disposition']).to.equal('attachment; filename="expected file name"');
      expect(response.headers['content-encoding']).to.equal('identity');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should fix invalid header chars in filename', async function () {
      // given
      usecases.startWritingCampaignProfilesCollectionResultsToStream.resolves({
        fileName: 'file-name with invalid_chars •’<>:"/\\|?*"\n.csv',
      });

      // when
      const response = await campaignController.getCsvProfilesCollectionResults(request);

      // then
      expect(response.headers['content-disposition']).to.equal(
        'attachment; filename="file-name with invalid_chars _____________.csv"'
      );
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getByCode', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the serialized campaign', async function () {
      // given
      const code = 'AZERTY123';
      const campaignToJoin = domainBuilder.buildCampaignToJoin({ code, identityProvider: 'SUPER_IDP' });
      const request = {
        query: { 'filter[code]': code },
      };
      sinon.stub(usecases, 'getCampaignByCode').withArgs({ code }).resolves(campaignToJoin);

      // when
      const response = await campaignController.getByCode(request, hFake);

      // then
      expect(response.data).to.deep.equal({
        type: 'campaigns',
        id: campaignToJoin.id.toString(),
        attributes: {
          code: campaignToJoin.code,
          title: campaignToJoin.title,
          type: campaignToJoin.type,
          'id-pix-label': campaignToJoin.idPixLabel,
          'custom-landing-page-text': campaignToJoin.customLandingPageText,
          'external-id-help-image-url': campaignToJoin.externalIdHelpImageUrl,
          'alternative-text-to-external-id-help-image': campaignToJoin.alternativeTextToExternalIdHelpImage,
          'is-archived': campaignToJoin.isArchived,
          'is-restricted': campaignToJoin.isRestricted,
          'is-simplified-access': campaignToJoin.isSimplifiedAccess,
          'is-for-absolute-novice': campaignToJoin.isForAbsoluteNovice,
          'identity-provider': campaignToJoin.identityProvider,
          'organization-name': campaignToJoin.organizationName,
          'organization-type': campaignToJoin.organizationType,
          'organization-logo-url': campaignToJoin.organizationLogoUrl,
          'organization-show-nps': campaignToJoin.organizationShowNPS,
          'organization-form-nps-url': campaignToJoin.organizationFormNPSUrl,
          'target-profile-name': campaignToJoin.targetProfileName,
          'target-profile-image-url': campaignToJoin.targetProfileImageUrl,
          'custom-result-page-text': campaignToJoin.customResultPageText,
          'custom-result-page-button-text': campaignToJoin.customResultPageButtonText,
          'custom-result-page-button-url': campaignToJoin.customResultPageButtonUrl,
          'multiple-sendings': campaignToJoin.multipleSendings,
          'is-flash': campaignToJoin.isFlash,
        },
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getById', function () {
    const campaignId = 1;
    const userId = 1;

    let request: $TSFixMe, campaign: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      campaign = {
        id: 1,
        name: 'My campaign',
      };
      request = {
        params: {
          id: campaign.id,
        },
        auth: {
          credentials: {
            userId: 1,
          },
        },
        query: {},
      };

      sinon.stub(usecases, 'getCampaign');
      sinon.stub(campaignReportSerializer, 'serialize');
      sinon.stub(queryParamsUtils, 'extractParameters');
      sinon.stub(tokenService, 'createTokenForCampaignResults');

      queryParamsUtils.extractParameters.withArgs({}).returns({});
      tokenService.createTokenForCampaignResults.withArgs(request.auth.credentials.userId).returns('token');
      usecases.getCampaign.resolves(campaign);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the campaign', async function () {
      // given
      const expectedResult = Symbol('ok');
      const tokenForCampaignResults = 'token';
      campaignReportSerializer.serialize.withArgs(campaign, {}, { tokenForCampaignResults }).returns(expectedResult);

      // when
      const response = await campaignController.getById(request, hFake);

      // then
      expect(usecases.getCampaign).calledWith({ campaignId, userId });
      expect(response).to.deep.equal(expectedResult);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#update', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the updated campaign', async function () {
      // given
      const request = {
        auth: { credentials: { userId: 1 } },
        params: { id: 1 },
        deserializedPayload: {
          name: 'New name',
          title: 'New title',
          customLandingPageText: 'New text',
          ownerId: 5,
        },
      };

      const updatedCampaign = Symbol('campaign');
      const updatedCampaignSerialized = Symbol('campaign serialized');

      sinon
        .stub(usecases, 'updateCampaign')
        .withArgs({ userId: 1, campaignId: 1, ...request.deserializedPayload })
        .resolves(updatedCampaign);
      sinon.stub(campaignReportSerializer, 'serialize').withArgs(updatedCampaign).returns(updatedCampaignSerialized);

      // when
      const response = await campaignController.update(request, hFake);

      // then
      expect(response).to.deep.equal(updatedCampaignSerialized);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getCollectiveResult', function () {
    const campaignId = 1;
    const userId = 1;
    const locale = FRENCH_SPOKEN;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'computeCampaignCollectiveResult');
      sinon.stub(campaignCollectiveResultSerializer, 'serialize');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return expected results', async function () {
      // given
      const campaignCollectiveResult = Symbol('campaignCollectiveResults');
      const expectedResults = Symbol('results');
      usecases.computeCampaignCollectiveResult
        .withArgs({ userId, campaignId, locale })
        .resolves(campaignCollectiveResult);
      campaignCollectiveResultSerializer.serialize.withArgs(campaignCollectiveResult).returns(expectedResults);

      const request = {
        auth: { credentials: { userId } },
        params: { id: campaignId },
        headers: { 'accept-language': locale },
      };

      // when
      const response = await campaignController.getCollectiveResult(request);

      // then
      expect(response).to.equal(expectedResults);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an unauthorized error', async function () {
      // given
      const error = new UserNotAuthorizedToAccessEntityError(
        'User does not have access to this campaign participation'
      );
      const request = {
        params: { id: campaignId },
        auth: {
          credentials: { userId },
        },
      };
      usecases.computeCampaignCollectiveResult.rejects(error);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const errorCatched = await catchErr(campaignController.getCollectiveResult)(request);

      // then
      expect(errorCatched).to.be.instanceof(UserNotAuthorizedToAccessEntityError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getAnalysis', function () {
    const campaignId = 1;
    const userId = 1;
    const locale = FRENCH_SPOKEN;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'computeCampaignAnalysis');
      sinon.stub(campaignAnalysisSerializer, 'serialize');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return expected results', async function () {
      // given
      const campaignAnalysis = Symbol('campaignAnalysis');
      const expectedResults = Symbol('results');
      usecases.computeCampaignAnalysis.withArgs({ userId, campaignId, locale }).resolves(campaignAnalysis);
      campaignAnalysisSerializer.serialize.withArgs(campaignAnalysis).returns(expectedResults);

      const request = {
        auth: { credentials: { userId } },
        params: { id: campaignId },
        headers: { 'accept-language': locale },
      };

      // when
      const response = await campaignController.getAnalysis(request);

      // then
      expect(response).to.equal(expectedResults);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an unauthorized error', async function () {
      // given
      const error = new UserNotAuthorizedToAccessEntityError('User does not have access to this campaign');
      const request = {
        params: { id: campaignId },
        auth: {
          credentials: { userId },
        },
      };
      usecases.computeCampaignAnalysis.rejects(error);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const errorCatched = await catchErr(campaignController.getAnalysis)(request);

      // then
      expect(errorCatched).to.be.instanceof(UserNotAuthorizedToAccessEntityError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#archiveCampaign', function () {
    let updatedCampaign: $TSFixMe;
    let serializedCampaign: $TSFixMe;

    const campaignId = 1;
    const userId = 1;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'archiveCampaign');
      sinon.stub(campaignReportSerializer, 'serialize').withArgs(updatedCampaign).resolves(serializedCampaign);
      updatedCampaign = Symbol('updated campaign');
      serializedCampaign = Symbol('serialized campaign');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the updated campaign properly serialized', async function () {
      // given
      usecases.archiveCampaign.withArgs({ userId, campaignId }).resolves(updatedCampaign);
      campaignReportSerializer.serialize.withArgs(updatedCampaign).returns(serializedCampaign);

      // when
      const response = await campaignController.archiveCampaign({
        params: { id: campaignId },
        auth: {
          credentials: { userId },
        },
      });

      // then
      expect(response).to.be.equal(serializedCampaign);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#unarchiveCampaign', function () {
    let updatedCampaign: $TSFixMe;
    let serializedCampaign: $TSFixMe;

    const campaignId = 1;
    const userId = 1;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'unarchiveCampaign');
      sinon.stub(campaignReportSerializer, 'serialize').withArgs(updatedCampaign).resolves(serializedCampaign);
      updatedCampaign = Symbol('updated campaign');
      serializedCampaign = Symbol('serialized campaign');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the updated campaign properly serialized', async function () {
      // given
      usecases.unarchiveCampaign.withArgs({ userId, campaignId }).resolves(updatedCampaign);
      campaignReportSerializer.serialize.withArgs(updatedCampaign).returns(serializedCampaign);

      // when
      const response = await campaignController.unarchiveCampaign({
        params: { id: campaignId },
        auth: {
          credentials: { userId },
        },
      });

      // then
      expect(response).to.be.equal(serializedCampaign);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findParticipantsActivity', function () {
    let serializedParticipantsActivities: $TSFixMe;
    let participantsActivities: $TSFixMe;
    const filters = { status: 'SHARED', groups: ['L1'], search: 'Choupette' };

    const campaignId = 1;
    const userId = 1;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      participantsActivities = Symbol('participants activities');
      serializedParticipantsActivities = Symbol('serialized participants activities');
      sinon.stub(usecases, 'findPaginatedCampaignParticipantsActivities');
      sinon
        .stub(campaignParticipantsActivitySerializer, 'serialize')
        .withArgs({ participantsActivities })
        .resolves(serializedParticipantsActivities);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the participants activities properly serialized', async function () {
      // given
      usecases.findPaginatedCampaignParticipantsActivities
        .withArgs({ campaignId, userId, page: { number: 3 }, filters })
        .resolves(participantsActivities);
      campaignParticipantsActivitySerializer.serialize
        .withArgs(participantsActivities)
        .returns(serializedParticipantsActivities);

      // when
      const response = await campaignController.findParticipantsActivity({
        params: { id: campaignId },
        auth: {
          credentials: { userId },
        },

        query: {
          'page[number]': 3,
          'filter[groups][]': ['L1'],
          'filter[status]': 'SHARED',
          'filter[search]': 'Choupette',
        },
      });

      // then
      expect(response).to.be.equal(serializedParticipantsActivities);
    });
  });
});
