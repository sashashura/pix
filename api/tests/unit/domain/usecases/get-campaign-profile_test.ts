// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getCampaignProfile = require('../../../../lib/domain/usecases/get-campaign-profile');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FRENCH_SPO... Remove this comment to see the full error message
const { FRENCH_SPOKEN } = require('../../../../lib/domain/constants').LOCALE;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-campaign-profile', function () {
  let campaignRepository: $TSFixMe, campaignProfileRepository: $TSFixMe;
  let userId: $TSFixMe, campaignId: $TSFixMe, campaignParticipationId: $TSFixMe;
  const locale = FRENCH_SPOKEN;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    campaignRepository = {
      checkIfUserOrganizationHasAccessToCampaign: sinon.stub(),
    };
    campaignProfileRepository = {
      findProfile: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user has access to organization that owns campaign', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      userId = domainBuilder.buildUser().id;
      const campaign = domainBuilder.buildCampaign();
      campaignId = campaign.id;
      campaignParticipationId = domainBuilder.buildCampaignParticipation({ campaign, userId }).id;
      campaignRepository.checkIfUserOrganizationHasAccessToCampaign.withArgs(campaignId, userId).resolves(true);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should get the campaignProfile', async function () {
      // given
      const expectedResult = Symbol('Result');
      campaignProfileRepository.findProfile
        .withArgs({ campaignId, campaignParticipationId, locale })
        .resolves(expectedResult);

      // when
      const result = await getCampaignProfile({
        userId,
        campaignId,
        campaignParticipationId,
        campaignRepository,
        campaignProfileRepository,
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
      const campaign = domainBuilder.buildCampaign();
      campaignId = campaign.id;
      campaignParticipationId = domainBuilder.buildCampaignParticipation({ campaign, userId }).id;
      campaignRepository.checkIfUserOrganizationHasAccessToCampaign.withArgs(campaignId, userId).resolves(false);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw UserNotAuthorizedToAccessEntityError', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(getCampaignProfile)({
        userId,
        campaignId,
        campaignParticipationId,
        campaignRepository,
        campaignProfileRepository,
        locale,
      });

      // then
      expect(result).to.be.instanceOf(UserNotAuthorizedToAccessEntityError);
    });
  });
});
