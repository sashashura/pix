// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getCampaignAssessmentParticipationResult = require('../../../../lib/domain/usecases/get-campaign-assessment-participation-result');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-campaign-assessment-participation-result', function () {
  let campaignRepository: $TSFixMe, campaignAssessmentParticipationResultRepository: $TSFixMe;
  let userId: $TSFixMe, campaignId: $TSFixMe, campaign, campaignParticipationId: $TSFixMe;
  const locale = 'fr';

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    campaignRepository = {
      checkIfUserOrganizationHasAccessToCampaign: sinon.stub(),
    };
    campaignAssessmentParticipationResultRepository = {
      getByCampaignIdAndCampaignParticipationId: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user has access to organization that owns campaign', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      userId = domainBuilder.buildUser().id;
      campaign = domainBuilder.buildCampaign();
      campaignId = campaign.id;
      campaignParticipationId = domainBuilder.buildCampaignParticipation({ campaign, userId }).id;
      campaignRepository.checkIfUserOrganizationHasAccessToCampaign.withArgs(campaignId, userId).resolves(true);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should get the campaignAssessmentParticipationResult', async function () {
      // given
      const expectedResult = Symbol('Result');
      campaignAssessmentParticipationResultRepository.getByCampaignIdAndCampaignParticipationId
        .withArgs({ campaignId, campaignParticipationId, locale })
        .resolves(expectedResult);

      // when
      const result = await getCampaignAssessmentParticipationResult({
        userId,
        campaignId,
        campaignParticipationId,
        campaignRepository,
        campaignAssessmentParticipationResultRepository,
        locale,
      });

      // then
      expect(result).to.equal(expectedResult);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user does not have access to organization that owns campaign', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      userId = domainBuilder.buildUser().id;
      campaign = domainBuilder.buildCampaign();
      campaignId = campaign.id;
      campaignParticipationId = domainBuilder.buildCampaignParticipation({ campaign, userId }).id;
      campaignRepository.checkIfUserOrganizationHasAccessToCampaign.withArgs(campaignId, userId).resolves(false);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw UserNotAuthorizedToAccessEntityError', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(getCampaignAssessmentParticipationResult)({
        userId,
        campaignId,
        campaignParticipationId,
        campaignRepository,
        campaignAssessmentParticipationResultRepository,
        locale,
      });

      // then
      expect(result).to.be.instanceOf(UserNotAuthorizedToAccessEntityError);
    });
  });
});
