// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../../../domain/models/Organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tag'.
const Tag = require('../../../domain/models/Tag');

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
        'memberships',
        'students',
        'targetProfiles',
        'tags',
        'createdBy',
        'documentationUrl',
        'showNPS',
        'formNPSUrl',
        'showSkills',
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
          related: function (record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
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

  deserialize(json: $TSFixMe) {
    const attributes = json.data.attributes;
    const relationships = json.data.relationships;

    let tags = [];
    if (relationships && relationships.tags) {
      tags = relationships.tags.data.map((tag: $TSFixMe) => new Tag({ id: parseInt(tag.id) }));
    }

    const organization = new Organization({
      id: parseInt(json.data.id),
      name: attributes.name,
      type: attributes.type,
      email: attributes.email,
      credit: attributes.credit,
      logoUrl: attributes['logo-url'],
      externalId: attributes['external-id'],
      provinceCode: attributes['province-code'],
      isManagingStudents: attributes['is-managing-students'],
      createdBy: attributes['created-by'],
      documentationUrl: attributes['documentation-url'],
      showSkills: attributes['show-skills'],
      tags,
    });

    return organization;
  },
};
