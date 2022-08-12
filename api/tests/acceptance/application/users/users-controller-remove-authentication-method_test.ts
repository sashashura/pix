const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'insertUser... Remove this comment to see the full error message
  insertUserWithRoleSuperAdmin,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
  knex,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../../../lib/domain/models/AuthenticationMethod');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | users-controller-remove-authentication-method', function () {
  let server: $TSFixMe;
  let user: $TSFixMe;
  let options: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
    user = databaseBuilder.factory.buildUser({ username: 'jhn.doe0101', email: null });
    databaseBuilder.factory.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
      userId: user.id,
    });
    databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({ userId: user.id });

    const superAdmin = await insertUserWithRoleSuperAdmin();
    options = {
      method: 'POST',
      url: `/api/admin/users/${user.id}/remove-authentication`,
      payload: {
        data: {
          attributes: {
            type: 'USERNAME',
          },
        },
      },
      headers: { authorization: generateValidRequestAuthorizationHeader(superAdmin.id) },
    };
    return databaseBuilder.commit();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /admin/users/:id/remove-authentication', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 204', async function () {
      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(204);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should set the username to null', async function () {
      // when
      await server.inject(options);

      // then
      const updatedUser = await knex('users').where({ id: user.id }).first();
      expect(updatedUser.username).to.be.null;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should remove PIX authenticationMethod', async function () {
      // when
      await server.inject(options);

      // then
      const pixAuthenticationMethod = await knex('authentication-methods')
        .where({ userId: user.id, identityProvider: AuthenticationMethod.identityProviders.PIX })
        .first();
      expect(pixAuthenticationMethod).to.be.undefined;
    });
  });
});
