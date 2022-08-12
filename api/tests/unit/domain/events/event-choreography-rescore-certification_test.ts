// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildEvent... Remove this comment to see the full error message
const buildEventDispatcherAndHandlersForTest = require('../../../tooling/events/event-dispatcher-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ChallengeN... Remove this comment to see the full error message
const ChallengeNeutralized = require('../../../../lib/domain/events/ChallengeNeutralized');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ChallengeD... Remove this comment to see the full error message
const ChallengeDeneutralized = require('../../../../lib/domain/events/ChallengeDeneutralized');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Event Choreography | Rescore Certification', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Should trigger Certification Rescoring handler on ChallengeNeutralized event', async function () {
    // given
    const { handlerStubs, eventDispatcher } = buildEventDispatcherAndHandlersForTest();
    const event = new ChallengeNeutralized({ certificationCourseId: 1, juryId: 7 });

    // when
    await eventDispatcher.dispatch(event);

    // then
expect((handlerStubs as $TSFixMe).handleCertificationRescoring).to.have.been.calledWith({ domainTransaction: undefined, event });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Should trigger Certification Rescoring handler on ChallengeDeneutralized event', async function () {
    // given
    const { handlerStubs, eventDispatcher } = buildEventDispatcherAndHandlersForTest();
    const event = new ChallengeDeneutralized({ certificationCourseId: 1, juryId: 7 });

    // when
    await eventDispatcher.dispatch(event);

    // then
expect((handlerStubs as $TSFixMe).handleCertificationRescoring).to.have.been.calledWith({ domainTransaction: undefined, event });
  });
});
