// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/user-orga-settings-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserOrgaSe... Remove this comment to see the full error message
const UserOrgaSettings = require('../../../../../lib/domain/models/UserOrgaSettings');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | user-orga-settings-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a UserOrgaSettings model object into JSON API data', function () {
      // given
      const userOrgaSettings = new UserOrgaSettings({
        id: 5,
        currentOrganization: {
          id: 10293,
          name: 'The name of the organization',
          type: 'SUP',
          code: 'WASABI666',
          externalId: 'EXTID',
        },
        user: {
          id: 123,
          firstName: 'firstName',
          lastName: 'lastName',
          email: 'email',
        },
      });

      const expectedSerializedUserOrgaSettings = {
        data: {
          type: 'user-orga-settings',
          id: '5',
          attributes: {},
          relationships: {
            organization: {
              data: {
                type: 'organizations',
                id: '10293',
              },
            },
            user: {
              data: {
                id: '123',
                type: 'users',
              },
            },
          },
        },
        included: [
          {
            type: 'organizations',
            id: '10293',
            attributes: {
              name: 'The name of the organization',
              type: 'SUP',
              code: 'WASABI666',
              'external-id': 'EXTID',
            },
            relationships: {
              campaigns: {
                links: {
                  related: '/api/organizations/10293/campaigns',
                },
              },
              'target-profiles': {
                links: {
                  related: '/api/organizations/10293/target-profiles',
                },
              },
              memberships: {
                links: {
                  related: '/api/organizations/10293/memberships',
                },
              },
              students: {
                links: {
                  related: '/api/organizations/10293/students',
                },
              },
              'organization-invitations': {
                links: {
                  related: '/api/organizations/10293/invitations',
                },
              },
            },
          },
          {
            id: '123',
            type: 'users',
            attributes: {
              'first-name': 'firstName',
              'last-name': 'lastName',
              email: 'email',
            },
          },
        ],
      };

      // when
      const json = serializer.serialize(userOrgaSettings);

      // then
      expect(json).to.deep.equal(expectedSerializedUserOrgaSettings);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should include "organization"', function () {
      // given
      const userOrgaSettings = domainBuilder.buildUserOrgaSettings();

      // when
      const json = serializer.serialize(userOrgaSettings);

      // then
      expect(json.data.relationships.organization.data.type).to.equal('organizations');
      expect(json.data.relationships.organization.data.id).to.equal(`${userOrgaSettings.organization.id}`);
      expect(json.included[0].type).to.equal('organizations');
      expect(json.included[0].attributes).to.deep.equal({
        name: 'ACME',
        type: 'PRO',
        'external-id': 'EXTID',
        'is-managing-students': false,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should include "user"', function () {
      // given
      const userOrgaSettings = domainBuilder.buildUserOrgaSettings();

      // when
      const json = serializer.serialize(userOrgaSettings);

      // then
      expect(json.data.relationships.user.data.type).to.equal('users');
      expect(json.data.relationships.user.data.id).to.equal(`${userOrgaSettings.user.id}`);
      expect(json.included[1].type).to.equal('users');
      expect(json.included[1].attributes).to.deep.equal({
        'first-name': 'Jean',
        'last-name': 'Dupont',
        email: 'jean.dupont@example.net',
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not force the add of campaigns and target profiles relation links if the UserOrgaSettings does not contain organization data', function () {
      // given
      const userOrgaSettings = domainBuilder.buildUserOrgaSettings();
      userOrgaSettings.currentOrganization = null;

      // when
      const json = serializer.serialize(userOrgaSettings);

      // then
      expect(json.data.relationships.organization.data).to.be.null;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not force the add of user relation link if user is undefined', function () {
      // given
      const userOrgaSettings = domainBuilder.buildUserOrgaSettings();
      userOrgaSettings.user = undefined;

      // when
      const json = serializer.serialize(userOrgaSettings);

      // then
      expect(json.data.relationships.user).to.be.undefined;
      expect(json.included.length).to.equal(1);
      expect(json.included[0].type).to.not.equal('users');
    });
  });
});
