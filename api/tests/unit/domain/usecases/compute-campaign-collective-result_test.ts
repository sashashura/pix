// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { computeCampaignCollectiveResult } = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | compute-campaign-collective-result', function () {
  const userId = 1;
  const campaignId = 'someCampaignId';
  let campaignRepository: $TSFixMe;
  let campaignCollectiveResultRepository: $TSFixMe;
  let targetProfileWithLearningContentRepository: $TSFixMe;
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const targetProfileWithLearningContent = Symbol('targetProfileWithLearningContent');
  const locale = 'fr';

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    campaignCollectiveResultRepository = { getCampaignCollectiveResult: sinon.stub() };
    campaignRepository = { checkIfUserOrganizationHasAccessToCampaign: sinon.stub() };
    targetProfileWithLearningContentRepository = { getByCampaignId: sinon.stub() };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('User has access to this result', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      campaignRepository.checkIfUserOrganizationHasAccessToCampaign.withArgs(campaignId, userId).resolves(true);
      targetProfileWithLearningContentRepository.getByCampaignId
        .withArgs({ campaignId, locale })
        .resolves(targetProfileWithLearningContent);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should resolve a CampaignCollectiveResult', async function () {
      // given
      const expectedCampaignCollectiveResult = Symbol('campaignCollectiveResult');
      campaignCollectiveResultRepository.getCampaignCollectiveResult
        .withArgs(campaignId, targetProfileWithLearningContent)
        .resolves(expectedCampaignCollectiveResult);

      // when
      const actualCampaignCollectiveResult = await computeCampaignCollectiveResult({
        userId,
        campaignId,
        campaignRepository,
        campaignCollectiveResultRepository,
        targetProfileWithLearningContentRepository,
        locale,
      });

      // then
      expect(targetProfileWithLearningContentRepository.getByCampaignId).to.have.been.calledOnce;
      expect(actualCampaignCollectiveResult).to.equal(expectedCampaignCollectiveResult);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('User does not belong to the organization', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      campaignRepository.checkIfUserOrganizationHasAccessToCampaign.withArgs(campaignId, userId).resolves(false);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an UserNotAuthorizedToAccessEntityError error', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(computeCampaignCollectiveResult)({
        userId,
        campaignId,
        campaignRepository,
        campaignCollectiveResultRepository,
        targetProfileWithLearningContentRepository,
        locale,
      });

      // then
      expect(result).to.be.instanceOf(UserNotAuthorizedToAccessEntityError);
    });
  });
});
