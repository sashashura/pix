// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const { databaseBuilder, expect, generateValidRequestAuthorizationHeader } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../../../lib/domain/models/AuthenticationMethod');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Route | Users', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/users/{id}/authentication-methods', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 HTTP status code', async function () {
      // given
      const server = await createServer();

      const user = databaseBuilder.factory.buildUser({});
      const garAuthenticationMethod = databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
        userId: user.id,
      });

      await databaseBuilder.commit();

      const options = {
        method: 'GET',
        url: `/api/users/${user.id}/authentication-methods`,
        headers: {
          authorization: generateValidRequestAuthorizationHeader(user.id),
        },
      };

      // when
      const response = await server.inject(options);

      // then
      const expectedJson = {
        data: [
          {
            type: 'authentication-methods',
            id: garAuthenticationMethod.id.toString(),
            attributes: {
              'identity-provider': AuthenticationMethod.identityProviders.GAR,
            },
          },
        ],
      };

      expect(response.statusCode).to.equal(200);
      expect(response.result).to.deep.equal(expectedJson);
    });
  });
});
