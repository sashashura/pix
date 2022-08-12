// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userOrgaSe... Remove this comment to see the full error message
const userOrgaSettingsSerializer = require('../../infrastructure/serializers/jsonapi/user-orga-settings-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToCreateResourceError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async createOrUpdate(request: $TSFixMe) {
    const authenticatedUserId = request.auth.credentials.userId;
    const userId = request.params.id;
    const organizationId = request.payload.data.relationships.organization.data.id;

    if (userId !== authenticatedUserId) {
      throw new UserNotAuthorizedToCreateResourceError();
    }

    const result = await usecases.createOrUpdateUserOrgaSettings({ userId, organizationId });

    return userOrgaSettingsSerializer.serialize(result);
  },
};
