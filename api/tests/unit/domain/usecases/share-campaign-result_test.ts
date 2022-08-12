// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationResultsShared = require('../../../../lib/domain/events/CampaignParticipationResultsShared');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const shareCampaignResult = require('../../../../lib/domain/usecases/share-campaign-result');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | share-campaign-result', function () {
  let campaignParticipationRepository: $TSFixMe;
  let userId: $TSFixMe;
  let campaignParticipationId: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    campaignParticipationRepository = {
      get: sinon.stub(),
      updateWithSnapshot: sinon.stub(),
    };
    userId = 123;
    campaignParticipationId = 456;
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user is not the owner of the campaign participation', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws a UserNotAuthorizedToAccessEntityError error ', async function () {
      // given
      const domainTransaction = Symbol('transaction');
      campaignParticipationRepository.get.resolves({ userId: userId + 1 });

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(shareCampaignResult)({
        userId,
        campaignParticipationId,
        campaignParticipationRepository,
        domainTransaction,
      });

      // then
      expect(error).to.be.instanceOf(UserNotAuthorizedToAccessEntityError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user is the owner of the campaign participation', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates the campaign participation', async function () {
      // given
      const domainTransaction = Symbol('transaction');
      const campaignParticipation = domainBuilder.buildCampaignParticipation({ id: campaignParticipationId, userId });
      sinon.stub(campaignParticipation, 'share');
      campaignParticipationRepository.get
        .withArgs(campaignParticipationId, domainTransaction)
        .resolves(campaignParticipation);

      // when
      await shareCampaignResult({
        userId,
        campaignParticipationId,
        campaignParticipationRepository,
        domainTransaction,
      });

      // then
      expect(campaignParticipation.share).to.have.been.called;
      expect(campaignParticipationRepository.updateWithSnapshot).to.have.been.calledWithExactly(
        campaignParticipation,
        domainTransaction
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the CampaignParticipationResultsShared event', async function () {
      // given
      const domainTransaction = Symbol('transaction');
      const campaignParticipation = domainBuilder.buildCampaignParticipation({ id: campaignParticipationId, userId });
      sinon.stub(campaignParticipation, 'share');

      campaignParticipationRepository.get.resolves(campaignParticipation);

      // when
      const actualEvent = await shareCampaignResult({
        userId,
        campaignParticipationId,
        campaignParticipationRepository,
        domainTransaction,
      });

      // then
      expect(actualEvent).to.deep.equal({ campaignParticipationId });
      expect(actualEvent).to.be.instanceOf(CampaignParticipationResultsShared);
    });
  });
});
