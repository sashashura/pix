const prescriberSerializer = require('../../infrastructure/serializers/jsonapi/prescriber-serializer');

const usecases = require('../../domain/usecases');

module.exports = {
  get(request) {
    const authenticatedUserId = request.auth.credentials?.accessToken?.content?.pixUserId;

    return usecases
      .getPrescriber({ userId: authenticatedUserId })
      .then((prescriber) => prescriberSerializer.serialize(prescriber));
  },
};
