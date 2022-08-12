// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const startCampaignParticipation = require('../../../../lib/domain/usecases/start-campaign-participation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStarted = require('../../../../lib/domain/events/CampaignParticipationStarted');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipant = require('../../../../lib/domain/models/CampaignParticipant');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | start-campaign-participation', function () {
  const userId = 19837482;
  let campaignParticipantRepository: $TSFixMe;
  let campaignParticipationRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    campaignParticipantRepository = {
      get: sinon.stub(),
      save: sinon.stub(),
    };
    campaignParticipationRepository = {
      get: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return CampaignParticipationStarted event', async function () {
    // given
    const domainTransaction = Symbol('transaction');
    const campaignToStartParticipation = domainBuilder.buildCampaignToStartParticipation();
    const campaignParticipant = new CampaignParticipant({
      campaignToStartParticipation,
      organizationLearner: { id: null, hasParticipated: false },
      userIdentity: { id: userId },
    });
    const campaignParticipationAttributes = { campaignId: 12, participantExternalId: 'YvoLoL' };
    const expectedCampaignParticipation = domainBuilder.buildCampaignParticipation({ id: 12 });

    const campaignParticipationStartedEvent = new CampaignParticipationStarted({
      campaignParticipationId: expectedCampaignParticipation.id,
    });

    campaignParticipantRepository.get
      .withArgs({ userId, campaignId: campaignParticipationAttributes.campaignId, domainTransaction })
      .resolves(campaignParticipant);

    sinon.stub(campaignParticipant, 'start');

    campaignParticipantRepository.save.withArgs(sinon.match(campaignParticipant), domainTransaction).resolves(12);

    campaignParticipationRepository.get.withArgs(12, domainTransaction).resolves(expectedCampaignParticipation);

    // when
    const { event, campaignParticipation } = await startCampaignParticipation({
      campaignParticipation: campaignParticipationAttributes,
      userId,
      campaignParticipantRepository,
      campaignParticipationRepository,
      domainTransaction,
    });

    // then
    expect(campaignParticipant.start).to.have.been.calledWith({ participantExternalId: 'YvoLoL' });
    expect(event).to.deep.equal(campaignParticipationStartedEvent);
    expect(campaignParticipation).to.deep.equal(expectedCampaignParticipation);
  });
});
