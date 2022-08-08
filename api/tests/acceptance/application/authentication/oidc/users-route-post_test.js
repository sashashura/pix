const jsonwebtoken = require('jsonwebtoken');
const querystring = require('querystring');
const { expect, knex } = require('../../../../test-helper');
const authenticationSessionService = require('../../../../../lib/domain/services/authentication/authentication-session-service');
const createServer = require('../../../../../server');
const AuthenticationSessionContent = require('../../../../../lib/domain/models/AuthenticationSessionContent');

describe('Acceptance | Route | oidc users', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
  });

  describe('POST /api/oidc/users', function () {
    afterEach(async function () {
      await knex('authentication-methods').delete();
      await knex('users').delete();
    });

    it('should return 200 HTTP status for cnav', async function () {
      // given
      const idToken = jsonwebtoken.sign(
        {
          given_name: 'Brice',
          family_name: 'Glace',
          nonce: 'nonce',
          sub: 'some-user-unique-id',
        },
        'secret'
      );
      const userAuthenticationKey = await authenticationSessionService.save({
        sessionContent: { idToken },
        userInfo: {
          firstName: 'Brice',
          lastName: 'Glace',
          nonce: 'nonce',
          externalIdentityId: 'some-user-unique-id',
        },
      });

      const request = {
        method: 'POST',
        url: '/api/oidc/users',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        payload: querystring.stringify({
          identity_provider: 'CNAV',
          authentication_key: userAuthenticationKey,
        }),
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
      expect(createdAuthenticationMethod.externalIdentifier).to.equal('some-user-unique-id');
    });

    it('should return 200 HTTP status for pole emploi', async function () {
      // given
      const firstName = 'firstName';
      const lastName = 'lastName';
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
        accessToken: 'accessToken',
        expiresIn: 10,
        idToken,
        refreshToken: 'refreshToken',
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
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        payload: querystring.stringify({
          identity_provider: 'POLE_EMPLOI',
          authentication_key: userAuthenticationKey,
        }),
      };

      // when
      const response = await server.inject(request);

      // then
      expect(response.statusCode).to.equal(200);

      const createdUser = await knex('users').first();
      expect(createdUser.firstName).to.equal(firstName);
      expect(createdUser.lastName).to.equal(lastName);

      const createdAuthenticationMethod = await knex('authentication-methods').first();
      expect(createdAuthenticationMethod.externalIdentifier).to.equal(externalIdentifier);
    });

    context('when authentication key has expired', function () {
      it('should return 401 HTTP status', async function () {
        // given
        const userAuthenticationKey = 'authentication_expired';

        const request = {
          method: 'POST',
          url: '/api/oidc/users',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          payload: querystring.stringify({
            identity_provider: 'CNAV',
            authentication_key: userAuthenticationKey,
          }),
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
