// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EventDispa... Remove this comment to see the full error message
class EventDispatcherLogger {
  _monitoringTools: $TSFixMe;
  _performance: $TSFixMe;
  _settings: $TSFixMe;
  constructor(monitoringTools: $TSFixMe, settings: $TSFixMe, performance: $TSFixMe) {
    this._monitoringTools = monitoringTools;
    this._settings = settings;
    this._performance = performance;
  }

  onEventDispatchStarted(event: $TSFixMe, eventHandlerName: $TSFixMe) {
    if (this._settings?.logging?.enableLogStartingEventDispatch) {
      this._monitoringTools.logInfoWithCorrelationIds({
        ...buildLogBody({ event, eventHandlerName }),
        message: 'EventDispatcher : Event dispatch started',
      });
    }
    return {
      startedAt: this._performance.now(),
    };
  }

  onEventDispatchSuccess(event: $TSFixMe, eventHandlerName: $TSFixMe, loggingContext: $TSFixMe) {
    if (this._settings?.logging?.enableLogEndingEventDispatch) {
      this._monitoringTools.logInfoWithCorrelationIds({
        ...buildLogBody({ event, eventHandlerName, duration: this._duration(loggingContext) }),
        message: 'EventDispatcher : Event dispatched successfully',
      });
    }
  }

  onEventDispatchFailure(event: $TSFixMe, eventHandlerName: $TSFixMe, error: $TSFixMe) {
    if (this._settings?.logging?.enableLogEndingEventDispatch) {
      this._monitoringTools.logInfoWithCorrelationIds({
        ...buildLogBody({ event, eventHandlerName, error }),
        message: 'EventDispatcher : An error occurred while dispatching the event',
      });
    }
  }

  _duration(context: $TSFixMe) {
    return context?.startedAt ? this._performance.now() - context.startedAt : undefined;
  }
}

function buildLogBody({
  event,
  eventHandlerName,
  error,
  duration
}: $TSFixMe) {
  return {
    metrics: {
      event_name: event.constructor.name,
      event_content: event,
      event_handler_name: eventHandlerName,
      event_error: error?.message ? error.message + ' (see dedicated log for more information)' : undefined,
      event_handling_duration: duration,
    },
  };
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = EventDispatcherLogger;
