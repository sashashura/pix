// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/organization-member-identity-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationMemberIdentity = require('../../../../../lib/domain/models/OrganizationMemberIdentity');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | organization-members-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a JSON API serialized organization members', function () {
      // given
      const organizationMember1 = new OrganizationMemberIdentity({
        id: 123,
        firstName: 'Alain',
        lastName: 'Provist',
      });
      const organizationMember2 = new OrganizationMemberIdentity({
        id: 666,
        firstName: 'Claire',
        lastName: 'De Lune',
      });
      const members = [organizationMember1, organizationMember2];

      // when
      const serializedOrganizationMemberIdentity = serializer.serialize(members);

      // then
      expect(serializedOrganizationMemberIdentity).to.deep.equal({
        data: [
          {
            type: 'member-identities',
            id: '123',
            attributes: {
              'first-name': 'Alain',
              'last-name': 'Provist',
            },
          },
          {
            type: 'member-identities',
            id: '666',
            attributes: {
              'first-name': 'Claire',
              'last-name': 'De Lune',
            },
          },
        ],
      });
    });
  });
});
