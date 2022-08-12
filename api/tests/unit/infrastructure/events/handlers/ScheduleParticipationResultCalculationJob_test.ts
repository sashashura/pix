// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Event'.
const Event = require('../../../../../lib/domain/events/Event');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SchedulePa... Remove this comment to see the full error message
const ScheduleParticipationResultCalculationJob = require('../../../../../lib/infrastructure/events/subscribers/ScheduleParticipationResultCalculationJob');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | Events | Handler | ParticipationResultCalculation', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#handle', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('schedules the result calculation', async function () {
      const job = {
        schedule: sinon.stub(),
      };

      const event = new Event();
      const handler = new ScheduleParticipationResultCalculationJob({ participationResultCalculationJob: job });
      await handler.handle(event);

      expect(job.schedule).to.have.been.called;
    });
  });
});
