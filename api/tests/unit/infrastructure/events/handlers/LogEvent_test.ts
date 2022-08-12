// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Event'.
const Event = require('../../../../../lib/domain/events/Event');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'LogEvent'.
const LogEvent = require('../../../../../lib/infrastructure/events/subscribers/LogEvent');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | Events | Handler | LogEvent', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#handle', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('logs the event', async function () {
      const monitoringTools = {
        logInfoWithCorrelationIds: sinon.stub(),
      };

      const event = new Event();
      const handler = new LogEvent({ monitoringTools });
      await handler.handle(event);

      expect(monitoringTools.logInfoWithCorrelationIds).to.have.been.calledWith({ message: event.attributes });
    });
  });
});
