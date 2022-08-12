// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(certificationPointOfContact: $TSFixMe) {
    return new Serializer('certification-point-of-contact', {
      attributes: [
        'firstName',
        'lastName',
        'email',
        'pixCertifTermsOfServiceAccepted',
        'allowedCertificationCenterAccesses',
      ],
      allowedCertificationCenterAccesses: {
        ref: 'id',
        included: true,
        attributes: [
          'name',
          'externalId',
          'type',
          'isRelatedToManagingStudentsOrganization',
          'isAccessBlockedCollege',
          'isAccessBlockedLycee',
          'isAccessBlockedAEFE',
          'isAccessBlockedAgri',
          'relatedOrganizationTags',
          'habilitations',
          'isEndTestScreenRemovalEnabled',
          'pixCertifScoBlockedAccessDateLycee',
          'pixCertifScoBlockedAccessDateCollege',
        ],
      },
      typeForAttribute: function (attribute: $TSFixMe) {
        if (attribute === 'allowedCertificationCenterAccesses') {
          return 'allowed-certification-center-access';
        }
        return attribute;
      },
      transform(certificationPointOfContact: $TSFixMe) {
        const transformedCertificationPointOfContact = _.clone(certificationPointOfContact);
        transformedCertificationPointOfContact.allowedCertificationCenterAccesses = _.map(
          certificationPointOfContact.allowedCertificationCenterAccesses,
          (access: $TSFixMe) => {
            return {
              ...access,
              habilitations: access.habilitations,
              isAccessBlockedCollege: access.isAccessBlockedCollege(),
              isAccessBlockedLycee: access.isAccessBlockedLycee(),
              isAccessBlockedAEFE: access.isAccessBlockedAEFE(),
              isAccessBlockedAgri: access.isAccessBlockedAgri(),
              isEndTestScreenRemovalEnabled: access.isEndTestScreenRemovalEnabled(),
              pixCertifScoBlockedAccessDateCollege: access.pixCertifScoBlockedAccessDateCollege,
              pixCertifScoBlockedAccessDateLycee: access.pixCertifScoBlockedAccessDateLycee,
            };
          }
        );

        return transformedCertificationPointOfContact;
      },
    }).serialize(certificationPointOfContact);
  },
};
