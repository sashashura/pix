// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/membership-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../../../lib/domain/models/Membership');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | membership-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a Membership model object into JSON API data', function () {
      // given
      const membership = new Membership({
        id: 5,
        organization: {
          id: 10293,
          name: 'The name of the organization',
          type: 'SUP',
          code: 'WASABI666',
          externalId: 'EXTID',
        },
        organizationRole: Membership.roles.ADMIN,
        user: {
          id: 123,
          firstName: 'firstName',
          lastName: 'lastName',
          email: 'email',
        },
      });

      const expectedSerializedMembership = {
        data: {
          type: 'memberships',
          id: '5',
          attributes: {
            'organization-role': Membership.roles.ADMIN,
          },
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
            type: 'users',
            id: '123',
            attributes: {
              'first-name': 'firstName',
              'last-name': 'lastName',
              email: 'email',
            },
          },
        ],
      };

      // when
      const json = serializer.serialize(membership);

      // then
      expect(json).to.deep.equal(expectedSerializedMembership);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should include "organization"', function () {
      // given
      const membership = domainBuilder.buildMembership();

      // when
      const json = serializer.serialize(membership);

      // then
      expect(json.data.relationships.organization.data.type).to.equal('organizations');
      expect(json.data.relationships.organization.data.id).to.equal(`${membership.organization.id}`);
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
      const membership = domainBuilder.buildMembership();

      // when
      const json = serializer.serialize(membership);

      // then
      expect(json.data.relationships.user.data.type).to.equal('users');
      expect(json.data.relationships.user.data.id).to.equal(`${membership.user.id}`);
      expect(json.included[1].type).to.equal('users');
      expect(json.included[1].attributes).to.deep.equal({
        'first-name': 'Jean',
        'last-name': 'Dupont',
        email: 'jean.dupont@example.net',
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not force the add of campaigns and target profiles relation links if the membership does not contain organization data', function () {
      // given
      const membership = domainBuilder.buildMembership();
      membership.organization = null;

      // when
      const json = serializer.serialize(membership);

      // then
      expect(json.data.relationships.organization).to.be.undefined;
      expect(json.included.length).to.equal(1);
      expect(json.included[0].type).to.not.equal('organization');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not force the add of user relation link if the user is undefined', function () {
      // given
      const membership = domainBuilder.buildMembership();
      membership.user = undefined;

      // when
      const json = serializer.serialize(membership);

      // then
      expect(json.data.relationships.user).to.be.undefined;
      expect(json.included.length).to.equal(1);
      expect(json.included[0].type).to.not.equal('users');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#deserialize()', function () {
    let jsonMembership: $TSFixMe = null;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      jsonMembership = {
        data: {
          type: 'memberships',
          id: '12345',
          attributes: {
            'organization-role': 'ADMIN',
          },
        },
      };
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert JSON API data into a map object that contain attribute to patch', function () {
      // when
      const membership = serializer.deserialize(jsonMembership);

      // then
      expect(membership.organizationRole).to.equal('ADMIN');
      expect(membership.id).to.equal('12345');
    });
  });
});
