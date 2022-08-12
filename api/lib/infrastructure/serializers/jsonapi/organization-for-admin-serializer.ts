// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(organizations: $TSFixMe, meta: $TSFixMe) {
    return new Serializer('organizations', {
      attributes: [
        'name',
        'type',
        'logoUrl',
        'externalId',
        'provinceCode',
        'isManagingStudents',
        'credit',
        'email',
        'documentationUrl',
        'createdBy',
        'showNPS',
        'formNPSUrl',
        'showSkills',
        'archivedAt',
        'archivistFullName',
        'creatorFullName',
        'tags',
        'memberships',
        'students',
        'targetProfiles',
      ],
      memberships: {
        ref: 'id',
        ignoreRelationshipData: true,
        nullIfMissing: true,
        relationshipLinks: {
          related(record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
            return `/api/organizations/${parent.id}/memberships`;
          },
        },
      },
      students: {
        ref: 'id',
        ignoreRelationshipData: true,
        nullIfMissing: true,
        relationshipLinks: {
          related(record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
            return `/api/organizations/${parent.id}/students`;
          },
        },
      },
      targetProfiles: {
        ref: 'id',
        ignoreRelationshipData: true,
        nullIfMissing: true,
        relationshipLinks: {
          related(record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
            return `/api/organizations/${parent.id}/target-profiles`;
          },
        },
      },
      tags: {
        ref: 'id',
        included: true,
        attributes: ['id', 'name'],
      },
      meta,
    }).serialize(organizations);
  },
};
