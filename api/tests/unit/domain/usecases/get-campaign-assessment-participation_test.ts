// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getCampaignAssessmentParticipation = require('../../../../lib/domain/usecases/get-campaign-assessment-participation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignAs... Remove this comment to see the full error message
const CampaignAssessmentParticipation = require('../../../../lib/domain/read-models/CampaignAssessmentParticipation');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-campaign-assessment-participation', function () {
  let campaignRepository: $TSFixMe, campaignAssessmentParticipationRepository: $TSFixMe, badgeAcquisitionRepository: $TSFixMe;
  let userId: $TSFixMe, campaignId: $TSFixMe, campaignParticipationId: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    campaignRepository = {
      checkIfUserOrganizationHasAccessToCampaign: sinon.stub(),
    };
    campaignAssessmentParticipationRepository = {
      getByCampaignIdAndCampaignParticipationId: sinon.stub(),
    };
    badgeAcquisitionRepository = {
      getAcquiredBadgesByCampaignParticipations: sinon.stub(),
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
    it('should get the campaignAssessmentParticipation', async function () {
      // given
      const participantId = domainBuilder.buildUser().id;
      const campaignAssessmentParticipation = new CampaignAssessmentParticipation({ userId: participantId });
      campaignAssessmentParticipationRepository.getByCampaignIdAndCampaignParticipationId
        .withArgs({ campaignId, campaignParticipationId })
        .resolves(campaignAssessmentParticipation);
      badgeAcquisitionRepository.getAcquiredBadgesByCampaignParticipations
        .withArgs({ campaignParticipationsIds: [campaignParticipationId] })
        .resolves({});

      // when
      const result = await getCampaignAssessmentParticipation({
        userId,
        campaignId,
        campaignParticipationId,
        campaignRepository,
        campaignAssessmentParticipationRepository,
        badgeAcquisitionRepository,
      });

      // then
      expect(result).to.equal(campaignAssessmentParticipation);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should set badges', async function () {
      // given
      const badges = Symbol('badges');
      const campaignAssessmentParticipation = new CampaignAssessmentParticipation({ campaignParticipationId });
      campaignAssessmentParticipationRepository.getByCampaignIdAndCampaignParticipationId
        .withArgs({ campaignId, campaignParticipationId })
        .resolves(campaignAssessmentParticipation);
      badgeAcquisitionRepository.getAcquiredBadgesByCampaignParticipations
        .withArgs({ campaignParticipationsIds: [campaignParticipationId] })
        .resolves({ [campaignParticipationId]: badges });

      // when
      const result = await getCampaignAssessmentParticipation({
        userId,
        campaignId,
        campaignParticipationId,
        campaignRepository,
        campaignAssessmentParticipationRepository,
        badgeAcquisitionRepository,
      });

      // then
      expect(result.badges).to.equal(badges);
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
      const result = await catchErr(getCampaignAssessmentParticipation)({
        userId,
        campaignId,
        campaignParticipationId,
        campaignRepository,
        campaignAssessmentParticipationRepository,
        badgeAcquisitionRepository,
      });

      // then
      expect(result).to.be.instanceOf(UserNotAuthorizedToAccessEntityError);
    });
  });
});
