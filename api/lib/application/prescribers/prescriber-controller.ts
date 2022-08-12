// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'prescriber... Remove this comment to see the full error message
const prescriberSerializer = require('../../infrastructure/serializers/jsonapi/prescriber-serializer');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  get(request: $TSFixMe) {
    const authenticatedUserId = request.auth.credentials.userId;

    return usecases
      .getPrescriber({ userId: authenticatedUserId })
      .then((prescriber: $TSFixMe) => prescriberSerializer.serialize(prescriber));
  },
};
