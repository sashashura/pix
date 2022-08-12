// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer, Deserializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(invitations: $TSFixMe) {
    return new Serializer('organization-invitations', {
      attributes: ['organizationId', 'organizationName', 'email', 'status', 'updatedAt', 'role'],
    }).serialize(invitations);
  },

  deserializeForCreateOrganizationInvitationAndSendEmail(payload: $TSFixMe) {
    return new Deserializer().deserialize(payload).then((record: $TSFixMe) => {
      return {
        role: record.role,
        lang: record.lang,
        email: record.email?.trim().toLowerCase(),
      };
    });
  },
};
