// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'jsonwebtok... Remove this comment to see the full error message
const jsonwebtoken = require('jsonwebtoken');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, knex } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'authentica... Remove this comment to see the full error message
const authenticationSessionService = require('../../../../../lib/domain/services/authentication/authentication-session-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationSessionContent = require('../../../../../lib/domain/models/AuthenticationSessionContent');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Route | oidc users', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/oidc/users', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('authentication-methods').delete();
      await knex('users').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 HTTP status for oidc', async function () {
      // given
      const firstName = 'Brice';
      const lastName = 'Glace';
      const externalIdentifier = 'sub';
      const idToken = jsonwebtoken.sign(
        {
          given_name: firstName,
          family_name: lastName,
          nonce: 'nonce',
          sub: externalIdentifier,
        },
        'secret'
      );

      const sessionContent = new AuthenticationSessionContent({
        idToken,
      });
      const userAuthenticationKey = await authenticationSessionService.save({
        sessionContent,
        userInfo: {
          firstName,
          lastName,
          nonce: 'nonce',
          externalIdentityId: externalIdentifier,
        },
      });

      const request = {
        method: 'POST',
        url: '/api/oidc/users',
        payload: {
          data: {
            attributes: {
              identity_provider: 'CNAV',
              authentication_key: userAuthenticationKey,
            },
          },
        },
      };

      // when
      const response = await server.inject(request);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result['access_token']).to.exist;

      const createdUser = await knex('users').first();
      expect(createdUser.firstName).to.equal('Brice');
      expect(createdUser.lastName).to.equal('Glace');

      const createdAuthenticationMethod = await knex('authentication-methods').first();
      expect(createdAuthenticationMethod.externalIdentifier).to.equal('sub');
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when authentication key has expired', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 401 HTTP status', async function () {
        // given
        const userAuthenticationKey = 'authentication_expired';

        const request = {
          method: 'POST',
          url: '/api/oidc/users',
          payload: {
            data: {
              attributes: {
                identity_provider: 'CNAV',
                authentication_key: userAuthenticationKey,
              },
            },
          },
        };

        // when
        const response = await server.inject(request);

        // then
        expect(response.statusCode).to.equal(401);
        expect(response.result.errors[0].detail).to.equal('This authentication key has expired.');
      });
    });
  });
});
