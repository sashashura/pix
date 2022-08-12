// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { computeCampaignAnalysis } = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FRENCH_SPO... Remove this comment to see the full error message
const { FRENCH_SPOKEN } = require('../../../../lib/domain/constants').LOCALE;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | compute-campaign-analysis', function () {
  let campaignRepository: $TSFixMe;
  let campaignAnalysisRepository: $TSFixMe;
  let targetProfileWithLearningContentRepository: $TSFixMe;
  let tutorialRepository: $TSFixMe;

  const userId = 1;
  const campaignId = 'someCampaignId';
  const locale = FRENCH_SPOKEN;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    campaignRepository = { checkIfUserOrganizationHasAccessToCampaign: sinon.stub() };
    campaignAnalysisRepository = { getCampaignAnalysis: sinon.stub() };
    targetProfileWithLearningContentRepository = { getByCampaignId: sinon.stub() };
    tutorialRepository = { list: sinon.stub() };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('User has access to this result', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the campaign analysis', async function () {
      // given
      const targetProfile = Symbol('targetProfile');
      const tutorials = Symbol('tutorials');
      const campaignAnalysis = Symbol('analysis');
      campaignRepository.checkIfUserOrganizationHasAccessToCampaign.withArgs(campaignId, userId).resolves(true);
      targetProfileWithLearningContentRepository.getByCampaignId
        .withArgs({ campaignId, locale })
        .resolves(targetProfile);
      tutorialRepository.list.withArgs({ locale }).resolves(tutorials);
      campaignAnalysisRepository.getCampaignAnalysis
        .withArgs(campaignId, targetProfile, tutorials)
        .resolves(campaignAnalysis);

      // when
      const actualCampaignAnalysis = await computeCampaignAnalysis({
        userId,
        campaignId,
        campaignRepository,
        campaignAnalysisRepository,
        targetProfileWithLearningContentRepository,
        tutorialRepository,
        locale,
      });

      // then
      expect(actualCampaignAnalysis).to.deep.equal(campaignAnalysis);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('User has not access to this result', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      campaignRepository.checkIfUserOrganizationHasAccessToCampaign.withArgs(campaignId, userId).resolves(false);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an UserNotAuthorizedToAccessEntityError error', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(computeCampaignAnalysis)({
        userId,
        campaignId,
        campaignRepository,
        campaignAnalysisRepository,
        targetProfileWithLearningContentRepository,
        locale,
      });

      // then
      expect(result).to.be.instanceOf(UserNotAuthorizedToAccessEntityError);
    });
  });
});
