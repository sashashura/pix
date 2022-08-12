// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Event'.
class Event {
  get attributes() {
    return {
      event: this.constructor.name,
      attributes: { ...this },
    };
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Event;
