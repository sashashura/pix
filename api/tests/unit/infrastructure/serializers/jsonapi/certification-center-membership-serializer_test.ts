// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCenterMembershipSerializer = require('../../../../../lib/infrastructure/serializers/jsonapi/certification-center-membership-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | certification-center-membership-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a Certification Center Membership model object into JSON API data', function () {
      // given
      const certificationCenter = domainBuilder.buildCertificationCenter();
      const user = domainBuilder.buildUser();
      const certificationCenterMembership = domainBuilder.buildCertificationCenterMembership({
        certificationCenter,
        user,
      });

      const expectedSerializedCertificationCenter = {
        data: [
          {
            id: certificationCenterMembership.id.toString(),
            type: 'certificationCenterMemberships',
            attributes: {
              'created-at': certificationCenterMembership.createdAt,
            },
            relationships: {
              'certification-center': {
                data: {
                  id: certificationCenter.id.toString(),
                  type: 'certificationCenters',
                },
              },
              user: {
                data: {
                  id: user.id.toString(),
                  type: 'users',
                },
              },
            },
          },
        ],
        included: [
          {
            id: certificationCenter.id.toString(),
            type: 'certificationCenters',
            attributes: {
              name: certificationCenter.name,
              type: certificationCenter.type,
            },
            relationships: {
              sessions: {
                links: {
                  related: `/api/certification-centers/${certificationCenter.id}/sessions`,
                },
              },
            },
          },
          {
            id: user.id.toString(),
            type: 'users',
            attributes: {
              'first-name': user.firstName,
              'last-name': user.lastName,
              email: user.email,
            },
          },
        ],
      };

      // when
      const serializedCertificationCenter = certificationCenterMembershipSerializer.serialize([
        certificationCenterMembership,
      ]);

      // then
      expect(serializedCertificationCenter).to.deep.equal(expectedSerializedCertificationCenter);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serializeMembers', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert into JSON API data', function () {
      // given
      const certificationCenter = domainBuilder.buildCertificationCenter();
      const user = domainBuilder.buildUser();
      const certificationCenterMembership = domainBuilder.buildCertificationCenterMembership({
        certificationCenter,
        user,
      });

      const expectedSerializedMember = {
        data: [
          {
            id: user.id.toString(),
            type: 'members',
            attributes: {
              'first-name': user.firstName,
              'last-name': user.lastName,
            },
          },
        ],
      };

      // when
      const serializedMember = certificationCenterMembershipSerializer.serializeMembers([
        certificationCenterMembership,
      ]);

      // then
      expect(serializedMember).to.deep.equal(expectedSerializedMember);
    });
  });
});
