// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findCampaignParticipationTrainings = require('../../../../lib/domain/usecases/find-campaign-participation-trainings.js');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToFindTrainings } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | find-campaign-participation-trainings', function () {
  let campaignRepository: $TSFixMe;
  let campaignParticipationRepository: $TSFixMe;
  let trainingRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    campaignRepository = { get: sinon.stub() };
    campaignParticipationRepository = { get: sinon.stub() };
    trainingRepository = { findByTargetProfileIdAndLocale: sinon.stub() };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when authenticated user is not the campaign participation owner', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw UserNotAuthorizedToFindTrainings error', async function () {
      // given
      const userId = 1234;
      const campaignWithoutTargetProfileId = domainBuilder.buildCampaign({ targetProfile: null });
      const campaignParticipation = domainBuilder.buildCampaignParticipation({
        campaign: campaignWithoutTargetProfileId,
        userId: 5678,
      });
      campaignParticipationRepository.get.resolves(campaignParticipation);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(findCampaignParticipationTrainings)({
        userId,
        campaignParticipationId: campaignParticipation.id,
        campaignParticipationRepository,
      });

      // then
      expect(error).to.be.instanceOf(UserNotAuthorizedToFindTrainings);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when related campaign is not associated to targetProfile', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return empty array', async function () {
      // given
      const userId = 123;
      const campaignWithoutTargetProfileId = domainBuilder.buildCampaign({ targetProfile: null });
      const campaignParticipation = domainBuilder.buildCampaignParticipation({
        userId,
        campaign: campaignWithoutTargetProfileId,
      });
      campaignRepository.get.resolves(campaignParticipation.campaign);
      campaignParticipationRepository.get.resolves(campaignParticipation);

      // when
      const result = await findCampaignParticipationTrainings({
        userId,
        campaignParticipationId: campaignParticipation.id,
        campaignRepository,
        campaignParticipationRepository,
      });

      // then
      expect(result).to.deep.equal([]);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when related campaign is associated with a targetProfile', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return array of trainings', async function () {
      // given
      const userId = 123;
      const campaignParticipation = domainBuilder.buildCampaignParticipation({ userId });
      campaignRepository.get.resolves(campaignParticipation.campaign);
      campaignParticipationRepository.get.resolves(campaignParticipation);

      const trainings = Symbol('trainings');

      trainingRepository.findByTargetProfileIdAndLocale.resolves(trainings);

      // when
      const result = await findCampaignParticipationTrainings({
        userId,
        campaignParticipationId: campaignParticipation.id,
        locale: 'fr-fr',
        campaignRepository,
        campaignParticipationRepository,
        trainingRepository,
      });

      // then
      expect(result).to.deep.equal(trainings);
    });
  });
});
