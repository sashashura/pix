// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  checkEventTypes(receivedEvent: $TSFixMe, acceptedEventTypes: $TSFixMe) {
    if (
      !_.some(acceptedEventTypes, (acceptedEventType: $TSFixMe) => {
        return receivedEvent instanceof acceptedEventType;
      })
    ) {
      const acceptedEventNames = acceptedEventTypes.map((acceptedEventType: $TSFixMe) => acceptedEventType.name);
      throw new Error(`event must be one of types ${acceptedEventNames.join(', ')}`);
    }
  },
};
