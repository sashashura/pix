const { expect, sinon, domainBuilder } = require('../../../test-helper');
const { deleteCampaignParticipation } = require('../../../../lib/domain/usecases');

describe('Unit | UseCase | delete-campaign-participation', function () {
  //given
  let clock;
  const now = new Date('2021-09-25');

  beforeEach(function () {
    clock = sinon.useFakeTimers(now.getTime());
  });

  afterEach(function () {
    clock.restore();
  });

  it('should call repository method to delete a campaign participation', async function () {
    const campaignParticipationRepository = {
      getOrganizationLearnerIdFromCampaignParticipation: sinon.stub(),
    };
    const campaignParticipantRepository = {
      delete: sinon.stub(),
    };
    const campaignParticipationId = 1234;
    const domainTransaction = Symbol('domainTransaction');
    const campaignId = domainBuilder.buildCampaign().id;
    const ownerId = domainBuilder.buildUser().id;
    const organizationLearnerId = domainBuilder.buildOrganizationLearner().id;

    await campaignParticipationRepository.getOrganizationLearnerIdFromCampaignParticipation
      .withArgs({
        campaignId,
        campaignParticipationId,
        domainTransaction,
      })
      .resolves(organizationLearnerId);

    //when
    await deleteCampaignParticipation({
      userId: ownerId,
      campaignId,
      campaignParticipationId,
      campaignParticipationRepository,
      campaignParticipantRepository,
      domainTransaction,
    });

    //then
    expect(campaignParticipantRepository.delete).to.have.been.calledWith({
      userId: ownerId,
      campaignId,
      organizationLearnerId,
      domainTransaction,
    });
  });
});
