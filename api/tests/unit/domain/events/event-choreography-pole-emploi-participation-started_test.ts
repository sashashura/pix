// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildEvent... Remove this comment to see the full error message
const buildEventDispatcherAndHandlersForTest = require('../../../tooling/events/event-dispatcher-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStarted = require('../../../../lib/domain/events/CampaignParticipationStarted');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Event Choreography | Pole Emploi Participation Started', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Should trigger Pole Emploi participation started handler on CampaignParticipationStarted event', async function () {
    // given
    const { handlerStubs, eventDispatcher } = buildEventDispatcherAndHandlersForTest();
    const event = new CampaignParticipationStarted();
    const domainTransaction = Symbol('a transaction');

    // when
    await eventDispatcher.dispatch(event, domainTransaction);

    // then
expect((handlerStubs as $TSFixMe).handlePoleEmploiParticipationStarted).to.have.been.calledWith({ event, domainTransaction });
  });
});
