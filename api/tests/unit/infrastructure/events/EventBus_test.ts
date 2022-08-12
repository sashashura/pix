// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Event'.
const Event = require('../../../../lib/domain/events/Event');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EventBus'.
const EventBus = require('../../../../lib/infrastructure/events/EventBus');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | Events | EventBus', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#publish', function () {
    let dependenciesBuilder: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      dependenciesBuilder = {
        build: (handler: $TSFixMe) => handler,
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is one subscriber', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('calls the subscriber', async function () {
        const subscriber = {
          handle: sinon.stub(),
        };
        const event = new Event();
        const eventBus = new EventBus(dependenciesBuilder);

        eventBus.subscribe(Event, subscriber);
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        await eventBus.publish(event);

        expect(subscriber.handle).to.have.been.calledWithMatch(event);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('does not call the subscriber associated to another Event', async function () {
        const subscriber = { handle: sinon.stub() };
        const eventBus = new EventBus(dependenciesBuilder);
        class EventA {}
        class EventB {}

        eventBus.subscribe(EventA, subscriber);
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        await eventBus.publish(new EventB());

        expect(subscriber.handle).not.to.have.been.called;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is several subscribers', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('calls all subscriber for the given event', async function () {
        const subscriber1 = {
          handle: sinon.stub(),
        };
        const subscriber2 = {
          handle: sinon.stub(),
        };
        const eventBus = new EventBus(dependenciesBuilder);

        eventBus.subscribe(Event, subscriber1);
        eventBus.subscribe(Event, subscriber2);
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        await eventBus.publish(new Event());

        expect(subscriber1.handle).to.have.been.called;
        expect(subscriber2.handle).to.have.been.called;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is an exception', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('does not call the other handlers', async function () {
        const error = new Error();
        const subscriber1 = {
          handle: () => {
            throw error;
          },
        };
        const subscriber2 = {
          handle: sinon.stub(),
        };

        const eventBus = new EventBus(dependenciesBuilder);

        eventBus.subscribe(Event, subscriber1);
        eventBus.subscribe(Event, subscriber2);
        try {
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          await eventBus.publish(new Event());
          // eslint-disable-next-line no-empty
        } catch (error) {}

        expect(subscriber2.handle).to.not.have.been.called;
      });
    });
  });
});
