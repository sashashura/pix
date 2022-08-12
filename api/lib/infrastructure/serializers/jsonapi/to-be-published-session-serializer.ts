// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(finalizedSessions: $TSFixMe) {
    return new Serializer('to-be-published-session', {
      transform(finalizedSession: $TSFixMe) {
        return { ...finalizedSession, id: finalizedSession.sessionId };
      },
      attributes: ['sessionId', 'sessionDate', 'sessionTime', 'finalizedAt', 'certificationCenterName'],
    }).serialize(finalizedSessions);
  },
};
