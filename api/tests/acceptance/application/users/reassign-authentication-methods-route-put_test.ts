const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'insertUser... Remove this comment to see the full error message
  insertUserWithRoleSuperAdmin,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../../../lib/domain/models/AuthenticationMethod');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Route | Users', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/admin/users/{userId}/authentication-methods/{authenticationMethodId}', function () {
    let server: $TSFixMe;
    let superAdmin: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      server = await createServer();
      superAdmin = await insertUserWithRoleSuperAdmin();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 204 HTTP status code', async function () {
      // given
      const originUserId = databaseBuilder.factory.buildUser().id;
      const targetUserId = databaseBuilder.factory.buildUser().id;
      const authenticationMethodId = databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
        userId: originUserId,
      }).id;
      await databaseBuilder.commit();

      // when
      const response = await server.inject({
        method: 'POST',
        url: `/api/admin/users/${originUserId}/authentication-methods/${authenticationMethodId}`,
        headers: {
          authorization: generateValidRequestAuthorizationHeader(superAdmin.id),
        },
        payload: {
          data: {
            attributes: {
              'user-id': targetUserId,
              'identity-provider': AuthenticationMethod.identityProviders.GAR,
            },
          },
        },
      });

      // then
      expect(response.statusCode).to.equal(204);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 422 HTTP status code when target user has already a GAR authentication method', async function () {
      // given
      const originUserId = databaseBuilder.factory.buildUser().id;
      const targetUserId = databaseBuilder.factory.buildUser().id;
      const authenticationMethodId = databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
        userId: originUserId,
      }).id;

      databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
        userId: targetUserId,
        externalIdentifier: 'externalId2',
      });

      await databaseBuilder.commit();

      // when
      const response = await server.inject({
        method: 'POST',
        url: `/api/admin/users/${originUserId}/authentication-methods/${authenticationMethodId}`,
        headers: {
          authorization: generateValidRequestAuthorizationHeader(superAdmin.id),
        },
        payload: {
          data: {
            attributes: {
              'user-id': targetUserId,
              'identity-provider': AuthenticationMethod.identityProviders.GAR,
            },
          },
        },
      });

      // then
      expect(response.statusCode).to.equal(422);
      expect(response.result.errors[0].detail).to.equal(
        `L'utilisateur ${targetUserId} a déjà une méthode de connexion GAR.`
      );
    });
  });
});
