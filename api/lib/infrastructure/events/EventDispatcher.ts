// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EventDispa... Remove this comment to see the full error message
class EventDispatcher {
  _logger: $TSFixMe;
  _subscriptions: $TSFixMe;
  constructor(logger: $TSFixMe) {
    this._subscriptions = [];
    this._logger = logger;
  }

  subscribe(event: $TSFixMe, eventHandler: $TSFixMe) {
    this._preventDuplicateSubscription(event, eventHandler);
    this._subscriptions.push({ event: event.prototype.constructor, eventHandler: eventHandler });
  }

  _preventDuplicateSubscription(event: $TSFixMe, eventHandler: $TSFixMe) {
    const foundDuplicateSubscription = _.some(this._subscriptions, _.matches({ event, eventHandler }));
    if (foundDuplicateSubscription) {
      throw new Error('Cannot subscribe twice to a given event with the same handler');
    }
  }

  async dispatch(dispatchedEvent: $TSFixMe, domainTransaction: $TSFixMe) {
    const eventQueue = new EventQueue();
    eventQueue.push(dispatchedEvent);

    while (!eventQueue.isEmpty()) {
      const eventToDispatch = eventQueue.shift();
      const eventHandlers = this._findEventHandlersByEventType(eventToDispatch);

      for (const eventHandler of eventHandlers) {
        try {
          const context = this._logger.onEventDispatchStarted(eventToDispatch, eventHandler.handlerName);
          const resultingEventOrEvents = await eventHandler({ domainTransaction, event: eventToDispatch });
          this._logger.onEventDispatchSuccess(eventToDispatch, eventHandler.handlerName, context);

          eventQueue.push(resultingEventOrEvents);
        } catch (error) {
          this._logger.onEventDispatchFailure(eventToDispatch, eventHandler.handlerName, error);
          throw error;
        }
      }
    }
  }

  _findEventHandlersByEventType(eventToDispatch: $TSFixMe) {
    return this._subscriptions
      // @ts-expect-error TS(7031): Binding element 'subscribedEvent' implicitly has a... Remove this comment to see the full error message
      .filter(({ event: subscribedEvent }) => eventToDispatch instanceof subscribedEvent)
      .map((subscription: $TSFixMe) => subscription.eventHandler);
  }
}

class EventQueue {
  events: $TSFixMe;
  constructor() {
    this.events = [];
  }

  push(eventOrEvents: $TSFixMe) {
    if (eventOrEvents) {
      if (!Array.isArray(eventOrEvents)) {
        this.events.push(eventOrEvents);
      } else {
        this.events.push(...eventOrEvents);
      }
    }
  }

  shift() {
    return this.events.shift();
  }

  isEmpty() {
    return this.events.length <= 0;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = EventDispatcher;
