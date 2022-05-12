const usecases = require('../../domain/usescases');
const UserSettingsSerializer = require('../../infrastructure/serializers/jsonapi/user-settings-serializer');

async function updateUserColor(request, h) {
  const { userId } = request.auth.credentials;
  const { color } = UserSettingsSerializer.deserialize(request.payload);
  const updatedUserSettings = await usecases.updateUserColor({ userId, color });
  return h.response(UserSettingsSerializer.serialize(updatedUserSettings)).created();
}

module.exports = { updateUserColor };
