// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCenter = require('../../../domain/models/CertificationCenter');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(certificationCenters: $TSFixMe, meta: $TSFixMe) {
    return new Serializer('certification-center', {
      attributes: [
        'name',
        'type',
        'externalId',
        'createdAt',
        'certificationCenterMemberships',
        'isSupervisorAccessEnabled',
        'habilitations',
      ],
      certificationCenterMemberships: {
        ref: 'id',
        ignoreRelationshipData: true,
        nullIfMissing: true,
        relationshipLinks: {
          related(record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
            return `/api/certification-centers/${parent.id}/certification-center-memberships`;
          },
        },
      },
      habilitations: {
        include: true,
        ref: 'id',
        attributes: ['key', 'label'],
      },
      meta,
    }).serialize(certificationCenters);
  },

  deserialize(jsonAPI: $TSFixMe) {
    return new CertificationCenter({
      id: jsonAPI.data.id,
      name: jsonAPI.data.attributes.name,
      type: jsonAPI.data.attributes.type,
      externalId: jsonAPI.data.attributes['external-id'],
      isSupervisorAccessEnabled: jsonAPI.data.attributes['is-supervisor-access-enabled'],
      createdAt: null,
      habilitations: [],
    });
  },
};
