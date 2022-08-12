// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(certificationCenterMemberships: $TSFixMe) {
    return new Serializer('certificationCenterMemberships', {
      transform: function (record: $TSFixMe) {
        record.certificationCenter.sessions = [];
        return record;
      },
      attributes: ['createdAt', 'certificationCenter', 'user'],
      certificationCenter: {
        ref: 'id',
        included: true,
        attributes: ['name', 'type', 'sessions'],
        sessions: {
          ref: 'id',
          ignoreRelationshipData: true,
          relationshipLinks: {
            related: function (record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
              return `/api/certification-centers/${parent.id}/sessions`;
            },
          },
        },
      },
      user: {
        ref: 'id',
        included: true,
        attributes: ['firstName', 'lastName', 'email'],
      },
    }).serialize(certificationCenterMemberships);
  },

  serializeMembers(certificationCenterMemberships: $TSFixMe) {
    return new Serializer('members', {
      transform: function (record: $TSFixMe) {
        const { id, firstName, lastName } = record.user;
        return { id, firstName, lastName };
      },
      ref: 'id',
      attributes: ['firstName', 'lastName'],
    }).serialize(certificationCenterMemberships);
  },
};
