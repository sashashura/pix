// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');

class SubscriberList {
  _subscribers: $TSFixMe;
  constructor() {
    this._subscribers = new Map();
  }

  add(eventClass: $TSFixMe, subscriber: $TSFixMe) {
    if (!this._subscribers.has(eventClass)) {
      this._subscribers.set(eventClass, []);
    }
    this._subscribers.get(eventClass).push(subscriber);
  }

  get(event: $TSFixMe) {
    const subscribersToCall: $TSFixMe = [];

    this._subscribers.forEach((subscribers: $TSFixMe, eventClass: $TSFixMe) => {
      if (event instanceof eventClass) {
        subscribersToCall.push(...subscribers);
      }
    });

    return subscribersToCall;
  }
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EventBus'.
class EventBus {
  _dependenciesBuilder: $TSFixMe;
  _subscriptions: $TSFixMe;
  constructor(dependenciesBuilder: $TSFixMe) {
    this._subscriptions = new SubscriberList();
    this._dependenciesBuilder = dependenciesBuilder;
  }

  subscribe(event: $TSFixMe, subscriber: $TSFixMe) {
    this._subscriptions.add(event, subscriber);
  }

  async publish(event: $TSFixMe, domainTransaction: $TSFixMe) {
    const subscribersToCall = this._subscriptions.get(event);
    await bluebird.mapSeries(subscribersToCall, async (subscriberClass: $TSFixMe) => {
      //La transaction knex est injecté dans le subscriber via le constructeur
      //Du coup à chaque requête il faut re-instancier le subscriber pour passer
      //une nouvelle transaction.
      const subscriber = this._dependenciesBuilder.build(subscriberClass, domainTransaction);
      await subscriber.handle(event);
    });
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = EventBus;
