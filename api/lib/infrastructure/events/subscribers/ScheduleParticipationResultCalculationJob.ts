// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Event'.
const Event = require('../../../domain/events/CampaignParticipationResultsShared');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SchedulePa... Remove this comment to see the full error message
class ScheduleParticipationResultCalculationJob {
  static event = Event;

  participationResultCalculationJob: $TSFixMe;

  constructor({
    participationResultCalculationJob
  }: $TSFixMe) {
    this.participationResultCalculationJob = participationResultCalculationJob;
  }

  async handle(event: $TSFixMe) {
    await this.participationResultCalculationJob.schedule(event);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ScheduleParticipationResultCalculationJob;
