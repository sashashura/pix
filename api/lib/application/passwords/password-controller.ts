// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'passwordRe... Remove this comment to see the full error message
const passwordResetSerializer = require('../../infrastructure/serializers/jsonapi/password-reset-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userSerial... Remove this comment to see the full error message
const userSerializer = require('../../infrastructure/serializers/jsonapi/user-serializer');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'extractLoc... Remove this comment to see the full error message
const { extractLocaleFromRequest } = require('../../infrastructure/utils/request-response-utils');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async createResetDemand(request: $TSFixMe, h: $TSFixMe) {
    const { email } = request.payload.data.attributes;
    const locale = extractLocaleFromRequest(request);

    const passwordResetDemand = await usecases.createPasswordResetDemand({
      email,
      locale,
    });
    const serializedPayload = passwordResetSerializer.serialize(passwordResetDemand.attributes);

    return h.response(serializedPayload).created();
  },

  async checkResetDemand(request: $TSFixMe) {
    const temporaryKey = request.params.temporaryKey;
    const user = await usecases.getUserByResetPasswordDemand({ temporaryKey });
    return userSerializer.serialize(user);
  },

  async updateExpiredPassword(request: $TSFixMe, h: $TSFixMe) {
    const passwordResetToken = request.payload.data.attributes['password-reset-token'];
    const newPassword = request.payload.data.attributes['new-password'];
    const login = await usecases.updateExpiredPassword({ passwordResetToken, newPassword });

    return h
      .response({
        data: {
          type: 'reset-expired-password-demands',
          attributes: {
            login,
          },
        },
      })
      .created();
  },
};
