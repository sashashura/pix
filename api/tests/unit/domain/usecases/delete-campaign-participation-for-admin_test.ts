// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'deleteCamp... Remove this comment to see the full error message
const { deleteCampaignParticipationForAdmin } = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipation = require('../../../../lib/domain/models/CampaignParticipation');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | delete-campaign-participation-for-admin', function () {
  //given
  let clock: $TSFixMe;
  const now = new Date('2021-09-25');

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    clock = sinon.useFakeTimers(now.getTime());
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    clock.restore();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should call repository method to delete a campaign participation', async function () {
    const campaignRepository = {
      getCampaignIdByCampaignParticipationId: sinon.stub(),
    };
    const campaignParticipationRepository = {
      getAllCampaignParticipationsInCampaignForASameLearner: sinon.stub(),
      delete: sinon.stub(),
    };
    const campaignParticipationId = 1234;
    const domainTransaction = Symbol('domainTransaction');
    const campaignId = domainBuilder.buildCampaign().id;
    const ownerId = domainBuilder.buildUser().id;
    const organizationLearnerId = domainBuilder.buildOrganizationLearner().id;

    const campaignParticipation1 = new CampaignParticipation({
      id: campaignParticipationId,
      organizationLearnerId,
      deletedAt: null,
      deletedBy: null,
      campaignId,
    });

    const campaignParticipation2 = new CampaignParticipation({
      id: 1235,
      deletedAt: null,
      deletedBy: null,
    });

    const campaignParticipations = [campaignParticipation1, campaignParticipation2];

    campaignRepository.getCampaignIdByCampaignParticipationId.withArgs(campaignParticipationId).resolves(campaignId);
    campaignParticipationRepository.getAllCampaignParticipationsInCampaignForASameLearner
      .withArgs({
        campaignId,
        campaignParticipationId,
        domainTransaction,
      })
      .resolves(campaignParticipations);

    //when
    await deleteCampaignParticipationForAdmin({
      userId: ownerId,
      campaignParticipationId,
      domainTransaction,
      campaignRepository,
      campaignParticipationRepository,
    });

    //then
    expect(campaignParticipationRepository.delete).to.have.been.calledTwice;
    campaignParticipations.forEach((campaignParticipation) => {
      const deletedCampaignParticipation = new CampaignParticipation({
        ...campaignParticipation,
        deletedAt: now,
        deletedBy: ownerId,
      });
      expect(campaignParticipationRepository.delete).to.have.been.calledWithExactly({
        id: deletedCampaignParticipation.id,
        deletedAt: deletedCampaignParticipation.deletedAt,
        deletedBy: deletedCampaignParticipation.deletedBy,
        domainTransaction,
      });
    });
  });
});
