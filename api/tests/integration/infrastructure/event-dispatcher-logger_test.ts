// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EventDispa... Remove this comment to see the full error message
const EventDispatcherLogger = require('../../../lib/infrastructure/events/EventDispatcherLogger');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | EventHandlerLogger', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when logging on event dispatch start is enabled', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('logs an event dispatch started as info', function () {
      // given
      const event = new TestEvent('the content');
      const eventHandlerName = "the event handler's name";
      const monitoringTools = _getMonitoringToolsMock();
      const settings = _getSettingsMock();
      const performance = _getPerformanceMock();
      settings.logging.enableLogStartingEventDispatch = true;
      const eventDispatcherLogger = new EventDispatcherLogger(monitoringTools, settings, performance);

      // when
      eventDispatcherLogger.onEventDispatchStarted(event, eventHandlerName);

      // then
      expect(monitoringTools.logInfoWithCorrelationIds).to.have.been.calledWith({
        metrics: {
          event_name: 'TestEvent',
          event_content: event,
          event_handler_name: "the event handler's name",
          event_error: undefined,
          event_handling_duration: undefined,
        },
        message: 'EventDispatcher : Event dispatch started',
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when logging on event dispatch start is disabled', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('logs an event dispatch started as info', function () {
      // given
      const event = new TestEvent('the content');
      const eventHandlerName = "the event handler's name";
      const monitoringTools = _getMonitoringToolsMock();
      const settings = _getSettingsMock();
      const performance = _getPerformanceMock();
      settings.logging.enableLogStartingEventDispatch = false;
      const eventDispatcherLogger = new EventDispatcherLogger(monitoringTools, settings, performance);

      // when
      eventDispatcherLogger.onEventDispatchStarted(event, eventHandlerName);

      // then
      expect(monitoringTools.logInfoWithCorrelationIds).not.to.be.called;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when logging on event dispatch end is enabled', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('logs an event dispatch success as info', function () {
      // given
      const event = new TestEvent('the content');
      const eventHandlerName = "the event handler's name";
      const monitoringTools = _getMonitoringToolsMock();
      const settings = _getSettingsMock();
      const performance = _getPerformanceMock();
      settings.logging.enableLogEndingEventDispatch = true;
      const eventDispatcherLogger = new EventDispatcherLogger(monitoringTools, settings, performance);

      // when
      eventDispatcherLogger.onEventDispatchSuccess(event, eventHandlerName);

      // then
      expect(monitoringTools.logInfoWithCorrelationIds).to.have.been.calledWith({
        metrics: {
          event_name: 'TestEvent',
          event_content: event,
          event_handler_name: "the event handler's name",
          event_error: undefined,
          event_handling_duration: undefined,
        },
        message: 'EventDispatcher : Event dispatched successfully',
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('logs an event dispatch failure as info', function () {
      // given
      const event = new TestEvent('the content');
      const eventHandlerName = "the event handler's name";
      const monitoringTools = _getMonitoringToolsMock();
      const settings = _getSettingsMock();
      settings.logging.enableLogEndingEventDispatch = true;
      const performance = _getPerformanceMock();
      const eventDispatcherLogger = new EventDispatcherLogger(monitoringTools, settings, performance);
      const anError = new Error('an error');

      // when
      eventDispatcherLogger.onEventDispatchFailure(event, eventHandlerName, anError);

      // then
      expect(monitoringTools.logInfoWithCorrelationIds).to.have.been.calledWith({
        metrics: {
          event_name: 'TestEvent',
          event_content: event,
          event_handler_name: "the event handler's name",
          event_error: 'an error (see dedicated log for more information)',
          event_handling_duration: undefined,
        },
        message: 'EventDispatcher : An error occurred while dispatching the event',
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when logging on event dispatch end is disabled', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('logs an event dispatch success as info', function () {
      // given
      const event = new TestEvent('the content');
      const eventHandlerName = "the event handler's name";
      const monitoringTools = _getMonitoringToolsMock();
      const settings = _getSettingsMock();
      const performance = _getPerformanceMock();
      settings.logging.enableLogEndingEventDispatch = false;
      const eventDispatcherLogger = new EventDispatcherLogger(monitoringTools, settings, performance);

      // when
      eventDispatcherLogger.onEventDispatchSuccess(event, eventHandlerName);

      // then
      expect(monitoringTools.logInfoWithCorrelationIds).to.not.have.been.called;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('logs an event dispatch failure as info', function () {
      // given
      const event = new TestEvent('the content');
      const eventHandlerName = "the event handler's name";
      const monitoringTools = _getMonitoringToolsMock();
      const settings = _getSettingsMock();
      const performance = _getPerformanceMock();
      settings.logging.enableLogEndingEventDispatch = false;
      const eventDispatcherLogger = new EventDispatcherLogger(monitoringTools, settings, performance);
      const anError = new Error('an error');

      // when
      eventDispatcherLogger.onEventDispatchFailure(event, eventHandlerName, anError);

      // then
      expect(monitoringTools.logInfoWithCorrelationIds).to.not.have.been.called;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when logging both event start and end', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('computes event handling duration', function () {
      // given
      const event = new TestEvent('the content');
      const eventHandlerName = "the event handler's name";
      const monitoringTools = _getMonitoringToolsMock();
      const settings = _getSettingsMock();
      const performance = _getPerformanceMock();
      settings.logging.enableLogEndingEventDispatch = true;
      const eventDispatcherLogger = new EventDispatcherLogger(monitoringTools, settings, performance);
      performance.now.onCall(0).returns(1);
      performance.now.onCall(1).returns(5);

      // when
      const context = eventDispatcherLogger.onEventDispatchStarted(event, eventHandlerName);
      eventDispatcherLogger.onEventDispatchSuccess(event, eventHandlerName, context);

      // then
      expect(monitoringTools.logInfoWithCorrelationIds).to.have.been.calledWith({
        metrics: {
          event_name: 'TestEvent',
          event_content: event,
          event_handler_name: "the event handler's name",
          event_error: undefined,
          event_handling_duration: 4,
        },
        message: 'EventDispatcher : Event dispatched successfully',
      });
    });
  });
});

// @ts-expect-error TS(2300): Duplicate identifier 'TestEvent'.
class TestEvent {
  content: $TSFixMe;
  constructor(content: $TSFixMe) {
    this.content = content;
  }
}

function _getMonitoringToolsMock() {
  return {
    logInfoWithCorrelationIds: sinon.stub(),
  };
}

function _getSettingsMock() {
  return {
    logging: {
      enableLogStartingEventDispatch: false,
      enableLogEndingEventDispatch: false,
    },
  };
}

function _getPerformanceMock() {
  return {
    now: sinon.stub(),
  };
}
