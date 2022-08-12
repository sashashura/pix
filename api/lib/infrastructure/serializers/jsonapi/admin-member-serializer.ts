// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer, Deserializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(adminMembers: $TSFixMe, meta: $TSFixMe) {
    return new Serializer('admin-member', {
      attributes: [
        'firstName',
        'lastName',
        'email',
        'role',
        'userId',
        'isSuperAdmin',
        'isCertif',
        'isMetier',
        'isSupport',
      ],
      meta,
    }).serialize(adminMembers);
  },

  async deserialize(jsonApiData: $TSFixMe) {
    const deserializer = new Deserializer({ keyForAttribute: 'camelCase' });
    return await deserializer.deserialize(jsonApiData);
  },
};
