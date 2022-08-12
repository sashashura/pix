// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildEvent... Remove this comment to see the full error message
const buildEventDispatcherAndHandlersForTest = require('../../../tooling/events/event-dispatcher-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionFin... Remove this comment to see the full error message
const SessionFinalized = require('../../../../lib/domain/events/SessionFinalized');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AutoJuryDo... Remove this comment to see the full error message
const AutoJuryDone = require('../../../../lib/domain/events/AutoJuryDone');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Event Choreography | Finalized session', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Should trigger the automated jury', async function () {
    // given
    const { handlerStubs, eventDispatcher } = buildEventDispatcherAndHandlersForTest();
    const event = new SessionFinalized({});

    // when
    await eventDispatcher.dispatch(event);

    // then
expect((handlerStubs as $TSFixMe).handleAutoJury).to.have.been.calledWith({ event, domainTransaction: undefined });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Should trigger persisting a finalized session on Auto Jury Done event', async function () {
    // given
    const { handlerStubs, eventDispatcher } = buildEventDispatcherAndHandlersForTest();
    const event = new AutoJuryDone({});

    // when
    await eventDispatcher.dispatch(event);

    // then
expect((handlerStubs as $TSFixMe).handleSessionFinalized).to.have.been.calledWith({ event, domainTransaction: undefined });
  });
});
