const { expect, domainBuilder } = require('../../../../test-helper');
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/user-details-for-admin-serializer');

describe('Unit | Serializer | JSONAPI | user-details-for-admin-serializer', function () {
  describe('#serialize', function () {
    it('should serialize user details for Pix Admin', function () {
      // given
      const now = new Date();
      const userDetailsForAdmin = domainBuilder.buildUserDetailsForAdmin({
        createdAt: now,
        lang: 'fr',
        lastTermsOfServiceValidatedAt: now,
        lastPixOrgaTermsOfServiceValidatedAt: now,
        lastPixCertifTermsOfServiceValidatedAt: now,
        lastLoggedAt: now,
        emailConfirmedAt: now,
        schoolingRegistrations: [domainBuilder.buildOrganizationLearnerForAdmin()],
        authenticationMethods: [{ id: 1, identityProvider: 'PIX' }],
      });

      // when
      const json = serializer.serialize(userDetailsForAdmin);

      // then
      expect(json).to.be.deep.equal({
        data: {
          attributes: {
            'first-name': userDetailsForAdmin.firstName,
            'last-name': userDetailsForAdmin.lastName,
            email: userDetailsForAdmin.email,
            username: userDetailsForAdmin.username,
            'created-at': userDetailsForAdmin.createdAt,
            cgu: userDetailsForAdmin.cgu,
            'pix-orga-terms-of-service-accepted': userDetailsForAdmin.pixOrgaTermsOfServiceAccepted,
            'pix-certif-terms-of-service-accepted': userDetailsForAdmin.pixCertifTermsOfServiceAccepted,
            lang: 'fr',
            'last-terms-of-service-validated-at': now,
            'last-pix-orga-terms-of-service-validated-at': now,
            'last-pix-certif-terms-of-service-validated-at': now,
            'last-logged-at': now,
            'email-confirmed-at': now,
          },
          relationships: {
            'schooling-registrations': {
              data: [
                {
                  id: `${userDetailsForAdmin.schoolingRegistrations[0].id}`,
                  type: 'schoolingRegistrations',
                },
              ],
            },
            'authentication-methods': {
              data: [
                {
                  id: `${userDetailsForAdmin.authenticationMethods[0].id}`,
                  type: 'authenticationMethods',
                },
              ],
            },
          },
          id: `${userDetailsForAdmin.id}`,
          type: 'users',
        },
        included: [
          {
            attributes: {
              'first-name': userDetailsForAdmin.schoolingRegistrations[0].firstName,
              'last-name': userDetailsForAdmin.schoolingRegistrations[0].lastName,
              birthdate: userDetailsForAdmin.schoolingRegistrations[0].birthdate,
              division: userDetailsForAdmin.schoolingRegistrations[0].division,
              group: userDetailsForAdmin.schoolingRegistrations[0].group,
              'organization-id': userDetailsForAdmin.schoolingRegistrations[0].organizationId,
              'organization-name': userDetailsForAdmin.schoolingRegistrations[0].organizationName,
              'created-at': userDetailsForAdmin.schoolingRegistrations[0].createdAt,
              'updated-at': userDetailsForAdmin.schoolingRegistrations[0].updatedAt,
              'is-disabled': userDetailsForAdmin.schoolingRegistrations[0].isDisabled,
              'can-be-dissociated': userDetailsForAdmin.schoolingRegistrations[0].canBeDissociated,
            },
            id: `${userDetailsForAdmin.schoolingRegistrations[0].id}`,
            type: 'schoolingRegistrations',
          },
          {
            attributes: {
              'identity-provider': userDetailsForAdmin.authenticationMethods[0].identityProvider,
            },
            id: `${userDetailsForAdmin.authenticationMethods[0].id}`,
            type: 'authenticationMethods',
          },
        ],
      });
    });
  });

  describe('#serializeForUpdate', function () {
    it('should serialize user details for Pix Admin', function () {
      // given
      const modelObject = domainBuilder.buildUserDetailsForAdmin({
        schoolingRegistrations: [domainBuilder.buildOrganizationLearnerForAdmin()],
        authenticationMethods: [{ id: 1, identityProvider: 'PIX' }],
      });

      // when
      const json = serializer.serializeForUpdate(modelObject);

      // then
      expect(json).to.be.deep.equal({
        data: {
          attributes: {
            'first-name': modelObject.firstName,
            'last-name': modelObject.lastName,
            email: modelObject.email,
            username: modelObject.username,
            cgu: modelObject.cgu,
            'pix-orga-terms-of-service-accepted': modelObject.pixOrgaTermsOfServiceAccepted,
            'pix-certif-terms-of-service-accepted': modelObject.pixCertifTermsOfServiceAccepted,
          },
          relationships: {
            'schooling-registrations': {
              data: [
                {
                  id: `${modelObject.schoolingRegistrations[0].id}`,
                  type: 'schoolingRegistrations',
                },
              ],
            },
            'authentication-methods': {
              data: [
                {
                  id: `${modelObject.authenticationMethods[0].id}`,
                  type: 'authenticationMethods',
                },
              ],
            },
          },
          id: `${modelObject.id}`,
          type: 'users',
        },
        included: [
          {
            attributes: {
              'first-name': modelObject.schoolingRegistrations[0].firstName,
              'last-name': modelObject.schoolingRegistrations[0].lastName,
              birthdate: modelObject.schoolingRegistrations[0].birthdate,
              division: modelObject.schoolingRegistrations[0].division,
              group: modelObject.schoolingRegistrations[0].group,
              'organization-id': modelObject.schoolingRegistrations[0].organizationId,
              'organization-name': modelObject.schoolingRegistrations[0].organizationName,
              'created-at': modelObject.schoolingRegistrations[0].createdAt,
              'updated-at': modelObject.schoolingRegistrations[0].updatedAt,
              'is-disabled': modelObject.schoolingRegistrations[0].isDisabled,
              'can-be-dissociated': modelObject.schoolingRegistrations[0].canBeDissociated,
            },
            id: `${modelObject.schoolingRegistrations[0].id}`,
            type: 'schoolingRegistrations',
          },
          {
            attributes: {
              'identity-provider': modelObject.authenticationMethods[0].identityProvider,
            },
            id: `${modelObject.authenticationMethods[0].id}`,
            type: 'authenticationMethods',
          },
        ],
      });
    });
  });

  describe('#deserialize', function () {
    let jsonUser;

    beforeEach(function () {
      jsonUser = {
        data: {
          type: 'user',
          attributes: {
            'first-name': 'Luke',
            'last-name': 'Skywalker',
            email: 'lskywalker@deathstar.empire',
            username: 'luke.skywalker1212',
          },
        },
      };
    });

    it('should convert JSON API data into a map object that contain attribute to patch', function () {
      // when
      const user = serializer.deserialize(jsonUser);

      // then
      expect(user.firstName).to.equal('Luke');
      expect(user.lastName).to.equal('Skywalker');
      expect(user.email).to.equal('lskywalker@deathstar.empire');
      expect(user.username).to.equal('luke.skywalker1212');
    });
  });
});
