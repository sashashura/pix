// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserDetail... Remove this comment to see the full error message
const UserDetailsForAdmin = require('../../../domain/models/UserDetailsForAdmin');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(usersDetailsForAdmin: $TSFixMe) {
    return new Serializer('user', {
      transform(record: $TSFixMe) {
        record.schoolingRegistrations = record.organizationLearners;
        record.profile = null;
        record.participations = null;
        return record;
      },
      attributes: [
        'firstName',
        'lastName',
        'email',
        'username',
        'cgu',
        'pixOrgaTermsOfServiceAccepted',
        'pixCertifTermsOfServiceAccepted',
        'createdAt',
        'lang',
        'lastTermsOfServiceValidatedAt',
        'lastPixOrgaTermsOfServiceValidatedAt',
        'lastPixCertifTermsOfServiceValidatedAt',
        'lastLoggedAt',
        'emailConfirmedAt',
        'schoolingRegistrations',
        'organizationLearners',
        'authenticationMethods',
        'profile',
        'participations',
      ],
      schoolingRegistrations: {
        ref: 'id',
        includes: true,
        attributes: [
          'firstName',
          'lastName',
          'birthdate',
          'division',
          'group',
          'organizationId',
          'organizationName',
          'createdAt',
          'updatedAt',
          'isDisabled',
          'canBeDissociated',
        ],
      },
      organizationLearners: {
        ref: 'id',
        includes: true,
        attributes: [
          'firstName',
          'lastName',
          'birthdate',
          'division',
          'group',
          'organizationId',
          'organizationName',
          'createdAt',
          'updatedAt',
          'isDisabled',
          'canBeDissociated',
        ],
      },
      authenticationMethods: {
        ref: 'id',
        includes: true,
        attributes: ['identityProvider'],
      },
      profile: {
        ref: 'id',
        ignoreRelationshipData: true,
        relationshipLinks: {
          related: function (record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
            return `/api/admin/users/${parent.id}/profile`;
          },
        },
      },
      participations: {
        ref: 'id',
        ignoreRelationshipData: true,
        relationshipLinks: {
          related: function (record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
            return `/api/admin/users/${parent.id}/participations`;
          },
        },
      },
    }).serialize(usersDetailsForAdmin);
  },

  serializeForUpdate(usersDetailsForAdmin: $TSFixMe) {
    return new Serializer('user', {
      transform(record: $TSFixMe) {
        record.schoolingRegistrations = record.organizationLearners;
        return record;
      },
      attributes: [
        'firstName',
        'lastName',
        'email',
        'username',
        'cgu',
        'pixOrgaTermsOfServiceAccepted',
        'pixCertifTermsOfServiceAccepted',
        'schoolingRegistrations',
        'organizationLearners',
        'authenticationMethods',
      ],
      schoolingRegistrations: {
        ref: 'id',
        includes: true,
        attributes: [
          'firstName',
          'lastName',
          'birthdate',
          'division',
          'group',
          'organizationId',
          'organizationName',
          'createdAt',
          'updatedAt',
          'isDisabled',
          'canBeDissociated',
        ],
      },
      organizationLearners: {
        ref: 'id',
        includes: true,
        attributes: [
          'firstName',
          'lastName',
          'birthdate',
          'division',
          'group',
          'organizationId',
          'organizationName',
          'createdAt',
          'updatedAt',
          'isDisabled',
          'canBeDissociated',
        ],
      },
      authenticationMethods: {
        ref: 'id',
        includes: true,
        attributes: ['identityProvider'],
      },
    }).serialize(usersDetailsForAdmin);
  },

  deserialize(json: $TSFixMe) {
    return new UserDetailsForAdmin({
      id: json.data.id,
      firstName: json.data.attributes['first-name'],
      lastName: json.data.attributes['last-name'],
      email: json.data.attributes.email,
      username: json.data.attributes.username,
    });
  },
};
