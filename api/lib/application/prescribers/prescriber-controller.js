const prescriberSerializer = require('../../infrastructure/serializers/jsonapi/prescriber-serializer');

const usecases = require('../../domain/usecases');

module.exports = {

  get(request) {
    const authenticatedUserId = request.auth.credentials.userId;

    return usecases.getPrescriber({ userId: authenticatedUserId })
      .then((prescriber) => console.log(JSON.stringify(prescriberSerializer.serialize(prescriber).memberships, undefined, 2)) || prescriberSerializer.serialize(prescriber));
  }
};
