// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../domain/models/Membership');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(membership: $TSFixMe, meta: $TSFixMe) {
    return new Serializer('memberships', {
      transform(record: $TSFixMe) {
        if (!record.user) {
          delete record.user;
        }

        if (!record.organization) {
          delete record.organization;
        }
        return record;
      },
      attributes: ['organization', 'organizationRole', 'user'],
      organization: {
        ref: 'id',
        included: true,
        attributes: [
          'code',
          'name',
          'type',
          'isManagingStudents',
          'externalId',
          'campaigns',
          'targetProfiles',
          'memberships',
          'students',
          'organizationInvitations',
        ],
        campaigns: {
          ref: 'id',
          ignoreRelationshipData: true,
          nullIfMissing: true,
          relationshipLinks: {
            related: function (record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
              return `/api/organizations/${parent.id}/campaigns`;
            },
          },
        },
        targetProfiles: {
          ref: 'id',
          ignoreRelationshipData: true,
          nullIfMissing: true,
          relationshipLinks: {
            related: function (record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
              return `/api/organizations/${parent.id}/target-profiles`;
            },
          },
        },
        memberships: {
          ref: 'id',
          ignoreRelationshipData: true,
          nullIfMissing: true,
          relationshipLinks: {
            related: function (record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
              return `/api/organizations/${parent.id}/memberships`;
            },
          },
        },
        students: {
          ref: 'id',
          ignoreRelationshipData: true,
          nullIfMissing: true,
          relationshipLinks: {
            related: function (record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
              return `/api/organizations/${parent.id}/students`;
            },
          },
        },
        organizationInvitations: {
          ref: 'id',
          ignoreRelationshipData: true,
          nullIfMissing: true,
          relationshipLinks: {
            related: function (record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
              return `/api/organizations/${parent.id}/invitations`;
            },
          },
        },
      },
      user: {
        ref: 'id',
        included: true,
        attributes: ['firstName', 'lastName', 'email'],
      },
      meta,
    }).serialize(membership);
  },

  deserialize(json: $TSFixMe) {
    return new Membership({
      id: json.data.id,
      organizationRole: json.data.attributes['organization-role'],
    });
  },
};
