// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Event'.
const Event = require('../../../domain/events/CampaignParticipationResultsShared');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'LogEvent'.
class LogEvent {
  static event = Event;

  monitoringTools: $TSFixMe;

  constructor({
    monitoringTools
  }: $TSFixMe) {
    this.monitoringTools = monitoringTools;
  }

  async handle(event: $TSFixMe) {
    this.monitoringTools.logInfoWithCorrelationIds({ message: event.attributes });
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = LogEvent;
