// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(targetProfiles: $TSFixMe) {
    return new Serializer('target-profile', {
      attributes: [
        'name',
        'outdated',
        'isPublic',
        'createdAt',
        'ownerOrganizationId',
        'description',
        'comment',
        'badges',
        'stages',
        'skills',
        'tubes',
        'competences',
        'areas',
        'imageUrl',
        'category',
        'isSimplifiedAccess',
        'tubesSelection',
        'tubesSelectionAreas',
      ],
      typeForAttribute(attribute: $TSFixMe) {
        if (attribute === 'tubesSelectionAreas') return 'areas';
        return undefined;
      },
      tubesSelectionAreas: {
        ref: 'id',
        included: true,
        attributes: ['title', 'color', 'code', 'competences'],
        competences: {
          ref: 'id',
          included: true,
          attributes: ['name', 'index', 'thematics'],
          thematics: {
            ref: 'id',
            included: true,
            attributes: ['name', 'index', 'tubes'],
            tubes: {
              ref: 'id',
              included: true,
              attributes: ['practicalTitle', 'practicalDescription', 'level', 'mobile', 'tablet'],
            },
          },
        },
      },
      skills: {
        ref: 'id',
        included: true,
        attributes: ['name', 'tubeId', 'difficulty'],
      },
      tubes: {
        ref: 'id',
        included: true,
        attributes: ['practicalTitle', 'competenceId'],
      },
      competences: {
        ref: 'id',
        included: true,
        attributes: ['name', 'areaId', 'index'],
      },
      areas: {
        ref: 'id',
        included: true,
        attributes: ['title', 'color', 'frameworkId'],
      },
      badges: {
        ref: 'id',
        ignoreRelationshipData: true,
        nullIfMissing: true,
        relationshipLinks: {
          related(record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
            return `/api/admin/target-profiles/${parent.id}/badges`;
          },
        },
      },
      stages: {
        ref: 'id',
        ignoreRelationshipData: true,
        nullIfMissing: true,
        relationshipLinks: {
          related(record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
            return `/api/admin/target-profiles/${parent.id}/stages`;
          },
        },
      },
    }).serialize(targetProfiles);
  },
};
