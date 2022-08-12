// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../../../../lib/domain/models/AuthenticationMethod');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/authentication-methods-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | authentication-methods-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should format a authentication method model object into JSON API data', function () {
      // given
      const user = domainBuilder.buildUser();
      const authenticationMethods = [
        domainBuilder.buildAuthenticationMethod.withPoleEmploiAsIdentityProvider({ userId: user.id }),
      ];

      // when
      const json = serializer.serialize(authenticationMethods);

      // then
      const expectedJson = {
        data: [
          {
            type: 'authentication-methods',
            attributes: {
              'identity-provider': AuthenticationMethod.identityProviders.POLE_EMPLOI,
            },
          },
        ],
      };
      expect(json).to.deep.equal(expectedJson);
    });
  });
});
