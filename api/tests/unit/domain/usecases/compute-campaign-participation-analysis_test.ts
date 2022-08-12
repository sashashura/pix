// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { computeCampaignParticipationAnalysis } = require('../../../../lib/domain/usecases');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
  UserNotAuthorizedToAccessEntityError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
  CampaignParticipationDeletedError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../lib/domain/models/CampaignParticipationStatuses');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FRENCH_SPO... Remove this comment to see the full error message
const { FRENCH_SPOKEN } = require('../../../../lib/domain/constants').LOCALE;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TO_SHARE'.
const { TO_SHARE } = CampaignParticipationStatuses;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | compute-campaign-participation-analysis', function () {
  let campaignRepository: $TSFixMe;
  let campaignAnalysisRepository: $TSFixMe;
  let campaignParticipationRepository: $TSFixMe;
  let targetProfileWithLearningContentRepository: $TSFixMe;
  let tutorialRepository: $TSFixMe;

  const userId = 1;
  const campaignId = 'someCampaignId';
  const campaignParticipationId = 'campaignParticipationId';
  let campaignParticipation: $TSFixMe;
  const locale = FRENCH_SPOKEN;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    campaignRepository = { checkIfUserOrganizationHasAccessToCampaign: sinon.stub() };
    campaignParticipationRepository = { get: sinon.stub() };
    campaignAnalysisRepository = { getCampaignParticipationAnalysis: sinon.stub() };
    targetProfileWithLearningContentRepository = { getByCampaignId: sinon.stub() };
    tutorialRepository = { list: sinon.stub() };

    const campaign = domainBuilder.buildCampaign({ id: campaignId });
    campaignParticipation = domainBuilder.buildCampaignParticipation({ campaign });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('User has access to this result', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Participant has shared its results', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should returns two CampaignTubeRecommendations but with two skills in the same tube', async function () {
        // given
        const targetProfile = Symbol('targetProfile');
        const tutorials = Symbol('tutorials');
        const campaignParticipationAnalysis = Symbol('analysis');
        campaignParticipation.userId = userId;
        campaignParticipationRepository.get.withArgs(campaignParticipationId).resolves(campaignParticipation);
        campaignRepository.checkIfUserOrganizationHasAccessToCampaign.withArgs(campaignId, userId).resolves(true);
        targetProfileWithLearningContentRepository.getByCampaignId
          .withArgs({ campaignId, locale })
          .resolves(targetProfile);
        tutorialRepository.list.withArgs({ locale }).resolves(tutorials);
        campaignAnalysisRepository.getCampaignParticipationAnalysis
          .withArgs(campaignId, campaignParticipation, targetProfile, tutorials)
          .resolves(campaignParticipationAnalysis);

        // when
        const actualCampaignParticipationAnalysis = await computeCampaignParticipationAnalysis({
          userId,
          campaignParticipationId,
          campaignRepository,
          campaignAnalysisRepository,
          campaignParticipationRepository,
          targetProfileWithLearningContentRepository,
          tutorialRepository,
          locale,
        });

        // then
        expect(actualCampaignParticipationAnalysis).to.deep.equal(campaignParticipationAnalysis);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Participation is deleted', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a CampaignParticipationDeletedError', async function () {
        // given
        const campaign = domainBuilder.buildCampaign({ id: campaignId });
        campaignParticipation = domainBuilder.buildCampaignParticipation({
          campaign,
          deletedAt: new Date('2022-01-01'),
          userId,
        });

        campaignParticipationRepository.get.withArgs(campaignParticipationId).resolves(campaignParticipation);
        campaignRepository.checkIfUserOrganizationHasAccessToCampaign.withArgs(campaignId, userId).resolves(true);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(computeCampaignParticipationAnalysis)({
          userId,
          campaignParticipationId,
          campaignRepository,
          campaignAnalysisRepository,
          campaignParticipationRepository,
          targetProfileWithLearningContentRepository,
          tutorialRepository,
          locale,
        });

        // then
        expect(error).to.be.instanceOf(CampaignParticipationDeletedError);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Participant has not shared its results', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should returns null', async function () {
        // given
        campaignParticipation.userId = userId;
        campaignParticipation.status = TO_SHARE;
        campaignParticipationRepository.get.withArgs(campaignParticipationId).resolves(campaignParticipation);
        campaignRepository.checkIfUserOrganizationHasAccessToCampaign.withArgs(campaignId, userId).resolves(true);

        // when
        const actualCampaignParticipationAnalysis = await computeCampaignParticipationAnalysis({
          userId,
          campaignParticipationId,
          campaignRepository,
          campaignAnalysisRepository,
          campaignParticipationRepository,
          targetProfileWithLearningContentRepository,
          tutorialRepository,
          locale,
        });

        // then
        expect(actualCampaignParticipationAnalysis).to.be.null;
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('User does not have access to this result', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      campaignParticipationRepository.get.withArgs(campaignParticipationId).resolves(campaignParticipation);
      campaignRepository.checkIfUserOrganizationHasAccessToCampaign.withArgs(campaignId, userId).resolves(false);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an UserNotAuthorizedToAccessEntityError error', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(computeCampaignParticipationAnalysis)({
        userId,
        campaignParticipationId,
        campaignRepository,
        campaignParticipationRepository,
        campaignAnalysisRepository,
        targetProfileWithLearningContentRepository,
        tutorialRepository,
        locale,
      });

      // then
      expect(result).to.be.instanceOf(UserNotAuthorizedToAccessEntityError);
    });
  });
});
