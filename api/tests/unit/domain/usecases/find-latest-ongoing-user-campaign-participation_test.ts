// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findCampaignParticipationsRelatedToUser = require('../../../../lib/domain/usecases/find-latest-ongoing-user-campaign-participations');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | find-latest-user-campaign-participations', function () {
  let userId: $TSFixMe;
  const campaignParticipationRepository = { findLatestOngoingByUserId: () => undefined };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(campaignParticipationRepository, 'findLatestOngoingByUserId');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should call findLatestOngoingByUserId to find all campaign-participations', async function () {
    // given
    userId = 1;
    (campaignParticipationRepository.findLatestOngoingByUserId as $TSFixMe).resolves();

    // when
    await findCampaignParticipationsRelatedToUser({
      userId,
      campaignParticipationRepository,
    });

    // then
    expect(campaignParticipationRepository.findLatestOngoingByUserId).to.have.been.calledWith(userId);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return user with his campaign participations', async function () {
    // given
const campaignParticipation1 = (campaignParticipationRepository.findLatestOngoingByUserId as $TSFixMe).resolves(domainBuilder.buildCampaignParticipation({ userId }));
    const campaignParticipation2 = (campaignParticipationRepository.findLatestOngoingByUserId as $TSFixMe).resolves(domainBuilder.buildCampaignParticipation({ userId }));
    (campaignParticipationRepository.findLatestOngoingByUserId as $TSFixMe).resolves([
    campaignParticipation1,
    campaignParticipation2,
]);

    // when
    const foundCampaignParticipations = await findCampaignParticipationsRelatedToUser({
      userId,
      campaignParticipationRepository,
    });

    // then
    expect(foundCampaignParticipations).to.be.an.instanceOf(Array);
    expect(foundCampaignParticipations).to.have.length(2);
    expect(foundCampaignParticipations[0]).to.equal(campaignParticipation1);
    expect(foundCampaignParticipations[1]).to.equal(campaignParticipation2);
  });
});
