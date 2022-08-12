// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EventBus'.
const EventBus = require('./EventBus');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'dependenci... Remove this comment to see the full error message
const dependenciesBuilder = require('./DependenciesBuilder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'LogEvent'.
const LogEvent = require('./subscribers/LogEvent');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SchedulePa... Remove this comment to see the full error message
const ScheduleParticipationResultCalculationJob = require('./subscribers/ScheduleParticipationResultCalculationJob');

const subscribers = [LogEvent, ScheduleParticipationResultCalculationJob];

function build() {
  const eventBus = new EventBus(dependenciesBuilder);

  subscribers.forEach((subscriberClass) => {
    eventBus.subscribe(subscriberClass.event, subscriberClass);
  });

  return eventBus;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  build,
};
