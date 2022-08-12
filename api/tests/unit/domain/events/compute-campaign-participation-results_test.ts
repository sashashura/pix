// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const sinon = require('sinon');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildEvent... Remove this comment to see the full error message
const buildEventDispatcherAndHandlersForTest = require('../../../tooling/events/event-dispatcher-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationResultsShared = require('../../../../lib/domain/events/CampaignParticipationResultsShared');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const computeCampaignParticipationResults = require('../../../../lib/domain/events/compute-campaign-participation-results');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Events | compute-campaign-participation-results', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Should trigger ComputeCampaignParticipationResults on CampaignParticipationResultsShared event', async function () {
    // given
    const { handlerStubs, eventDispatcher } = buildEventDispatcherAndHandlersForTest();
    const event = new CampaignParticipationResultsShared();
    const domainTransaction = Symbol('a transaction');

    // when
    await eventDispatcher.dispatch(event, domainTransaction);

    // then
expect((handlerStubs as $TSFixMe).computeCampaignParticipationResults).to.have.been.calledWith({ event, domainTransaction });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should compute and save results on the campaign participation', async function () {
    // given
    const participationResultsShared = Symbol('participation results shared');
    const event = new CampaignParticipationResultsShared({ campaignParticipationId: 1 });
    const participantResultsSharedRepository = { get: sinon.stub() };
    participantResultsSharedRepository.get.withArgs(1).resolves(participationResultsShared);
    const campaignParticipationRepository = { update: sinon.stub() };

    // when
    await computeCampaignParticipationResults({
      event,
      participantResultsSharedRepository,
      campaignParticipationRepository,
    });

    // then
    expect(campaignParticipationRepository.update).to.have.been.calledWith(participationResultsShared);
  });
});
