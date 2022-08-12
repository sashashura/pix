// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EventDispa... Remove this comment to see the full error message
const EventDispatcher = require('../../../lib/infrastructure/events/EventDispatcher');

function getEventHandlerMock() {
  return sinon.stub();
}

// @ts-expect-error TS(2300): Duplicate identifier 'TestEvent'.
class TestEvent {}

class AnotherTestEvent {}

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | EventHandler', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('dispatches event to subscriber', async function () {
    // given
    const logger = _buildLoggerMock();
    const eventDispatcher = new EventDispatcher(logger);
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    const event = new TestEvent();
    const domainTransaction = Symbol('domain transaction');
    const eventHandler = getEventHandlerMock();
    eventDispatcher.subscribe(TestEvent, eventHandler);

    // when
    await eventDispatcher.dispatch(event, domainTransaction);

    // then
    expect(eventHandler).to.have.been.calledWith({ domainTransaction, event });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws when duplicate subscription', async function () {
    // given
    const logger = _buildLoggerMock();
    const eventDispatcher = new EventDispatcher(logger);
    const eventHandler = getEventHandlerMock();

    // when / then
    expect(() => {
      eventDispatcher.subscribe(TestEvent, eventHandler);
      eventDispatcher.subscribe(AnotherTestEvent, eventHandler);
      eventDispatcher.subscribe(TestEvent, eventHandler);
    }).to.throw();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('dispatches event to several eventHandlers', async function () {
    // given
    const logger = _buildLoggerMock();
    const eventDispatcher = new EventDispatcher(logger);
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    const event = new TestEvent();
    const domainTransaction = Symbol('domain transaction');
    const eventHandler_1 = getEventHandlerMock();
    const eventHandler_2 = getEventHandlerMock();

    eventDispatcher.subscribe(TestEvent, eventHandler_1);
    eventDispatcher.subscribe(TestEvent, eventHandler_2);

    // when
    await eventDispatcher.dispatch(event, domainTransaction);

    // then
    expect(eventHandler_1).to.have.been.calledWith({ domainTransaction, event });
    expect(eventHandler_2).to.have.been.calledWith({ domainTransaction, event });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('calls handler only for subscribed events', async function () {
    // given
    const logger = _buildLoggerMock();
    const eventDispatcher = new EventDispatcher(logger);
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    const event = new TestEvent();
    const domainTransaction = Symbol('domain transaction');
    const eventHandler = getEventHandlerMock();
    const otherEvent = new AnotherTestEvent();

    eventDispatcher.subscribe(TestEvent, eventHandler);

    // when
    await eventDispatcher.dispatch(event, domainTransaction);
    await eventDispatcher.dispatch(otherEvent, domainTransaction);

    // then
    expect(eventHandler).to.have.been.calledWith({ domainTransaction, event });
    expect(eventHandler).not.to.have.been.calledWith({ domainTransaction, otherEvent });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('dispatches event returned by eventHandlers', async function () {
    // given
    const logger = _buildLoggerMock();
    const eventDispatcher = new EventDispatcher(logger);
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    const event = new TestEvent();
    const domainTransaction = Symbol('domain transaction');
    const returnedEvent = new AnotherTestEvent();
    const originEventEmitter = () => returnedEvent;
    const eventHandler = getEventHandlerMock();
    eventDispatcher.subscribe(TestEvent, originEventEmitter);
    eventDispatcher.subscribe(AnotherTestEvent, eventHandler);

    // when
    await eventDispatcher.dispatch(event, domainTransaction);

    // then
    expect(eventHandler).to.have.been.calledWith({ domainTransaction, event: returnedEvent });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('dispatches events returned by eventHandlers', async function () {
    // given
    const logger = _buildLoggerMock();
    const eventDispatcher = new EventDispatcher(logger);
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    const event = new TestEvent();
    const domainTransaction = Symbol('domain transaction');
    const returnedEvent1 = new AnotherTestEvent();
    const returnedEvent2 = new AnotherTestEvent();
    const originEventEmitter = () => [returnedEvent1, returnedEvent2];
    const eventHandler = getEventHandlerMock();
    eventDispatcher.subscribe(TestEvent, originEventEmitter);
    eventDispatcher.subscribe(AnotherTestEvent, eventHandler);

    // when
    await eventDispatcher.dispatch(event, domainTransaction);

    // then
    expect(eventHandler).to.have.been.calledWith({ domainTransaction, event: returnedEvent1 });
    expect(eventHandler).to.have.been.calledWith({ domainTransaction, event: returnedEvent2 });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('logs when dispatch starts', async function () {
    // given
    const logger = _buildLoggerMock();
    const eventDispatcher = new EventDispatcher(logger);
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    const event = new TestEvent();
    const domainTransaction = Symbol('domain transaction');
    const eventHandler = getEventHandlerMock();
    eventHandler.handlerName = 'handler 1';
    eventDispatcher.subscribe(TestEvent, eventHandler);

    // when
    await eventDispatcher.dispatch(event, domainTransaction);

    // then
    expect(logger.onEventDispatchStarted).to.have.been.calledWith(event, 'handler 1');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('logs when a dispatch is successful', async function () {
    // given
    const logger = _buildLoggerMock();
    const eventDispatcher = new EventDispatcher(logger);
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    const event = new TestEvent();
    const domainTransaction = Symbol('domain transaction');
    const eventHandler = getEventHandlerMock();
    eventHandler.handlerName = 'handler 1';
    eventDispatcher.subscribe(TestEvent, eventHandler);

    // when
    await eventDispatcher.dispatch(event, domainTransaction);

    // then
    expect(logger.onEventDispatchSuccess).to.have.been.calledWith(event, 'handler 1');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('logs and rethrow when a dispatch fails', async function () {
    // given
    const logger = _buildLoggerMock();
    const eventDispatcher = new EventDispatcher(logger);
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    const event = new TestEvent();
    const domainTransaction = Symbol('domain transaction');
    const eventHandler = getEventHandlerMock();
    eventHandler.handlerName = 'handler 1';
    const anError = new Error('an error');
    eventHandler.rejects(anError);
    eventDispatcher.subscribe(TestEvent, eventHandler);

    // when
    let error;
    try {
      await eventDispatcher.dispatch(event, domainTransaction);
    } catch (e) {
      error = e;
    }
    expect(error).to.equal(anError);
    expect(logger.onEventDispatchFailure).to.have.been.calledWith(event, 'handler 1', anError);
  });
});

function _buildLoggerMock() {
  return {
    onEventDispatchStarted: sinon.stub(),
    onEventDispatchSuccess: sinon.stub(),
    onEventDispatchFailure: sinon.stub(),
  };
}
