const querystring = require('querystring');
const jsonwebtoken = require('jsonwebtoken');
const {
  expect,
  databaseBuilder,
  knex,
  nock,
  sinon,
  generateValidRequestAuthorizationHeader,
} = require('../../../../test-helper');

const createServer = require('../../../../../server');
const settings = require('../../../../../lib/config');
const moment = require('moment');
const AuthenticationMethod = require('../../../../../lib/domain/models/AuthenticationMethod');
const AuthenticationSessionContent = require('../../../../../lib/domain/models/AuthenticationSessionContent');
const authenticationSessionService = require('../../../../../lib/domain/services/authentication/authentication-session-service');

const uuidPattern = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);

describe('Acceptance | Route | oidc token', function () {
  describe('POST /api/oidc/token', function () {
    let server;
    let clock;

    beforeEach(async function () {
      server = await createServer();
      clock = sinon.useFakeTimers({
        now: Date.now(),
        toFake: ['Date'],
      });
    });

    afterEach(async function () {
      clock.restore();
      await knex('authentication-methods').delete();
      await knex('users').delete();
    });

    context('When the state sent does not match the state received', function () {
      it('should return http code 400', async function () {
        // given && when
        const response = await server.inject({
          method: 'POST',
          url: '/api/oidc/token',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          payload: querystring.stringify({
            identity_provider: 'POLE_EMPLOI',
            code: 'code',
            redirect_uri: 'redirect_uri',
            state_sent: 'a_state',
            state_received: 'another_state',
          }),
        });

        // then
        expect(response.statusCode).to.equal(400);
      });
    });

    context('When user does not have an account', function () {
      it('should return status code 401 with authentication key matching session content and error code to validate cgu', async function () {
        // given
        const idToken = jsonwebtoken.sign(
          {
            given_name: 'John',
            family_name: 'Doe',
            nonce: 'nonce',
            sub: 'sub',
          },
          'secret'
        );

        const getAccessTokenResponse = {
          access_token: 'access_token',
          id_token: idToken,
          expires_in: 60,
          refresh_token: 'refresh_token',
        };

        nock(settings.poleEmploi.tokenUrl).post('/').reply(200, getAccessTokenResponse);

        const sessionContentAndUserInfo = {
          sessionContent: new AuthenticationSessionContent({
            accessToken: 'access_token',
            idToken,
            expiresIn: 60,
            refreshToken: 'refresh_token',
          }),
          userInfo: {
            externalIdentityId: 'sub',
            firstName: 'John',
            lastName: 'Doe',
            nonce: 'nonce',
          },
        };

        // when
        const response = await server.inject({
          method: 'POST',
          url: '/api/oidc/token',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          payload: querystring.stringify({
            identity_provider: 'POLE_EMPLOI',
            code: 'code',
            redirect_uri: 'redirect_uri',
            state_sent: 'state',
            state_received: 'state',
          }),
        });

        // then
        const [error] = response.result.errors;
        expect(response.statusCode).to.equal(401);
        expect(error.code).to.exist;
        expect(error.code).to.equal('SHOULD_VALIDATE_CGU');

        const authenticationKey = error.meta.authenticationKey;
        expect(authenticationKey).to.exist;
        const result = await authenticationSessionService.getByKey(authenticationKey);
        expect(result).to.deep.equal(sessionContentAndUserInfo);
      });
    });

    it('should return 200 with access_token and logout_url_uuid', async function () {
      // given
      const firstName = 'John';
      const lastName = 'Doe';
      const externalIdentifier = 'sub';

      const userId = databaseBuilder.factory.buildUser({
        firstName,
        lastName,
      }).id;

      databaseBuilder.factory.buildAuthenticationMethod.withIdentityProvider({
        identityProvider: AuthenticationMethod.identityProviders.CNAV,
        externalIdentifier,
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
        expiresIn: 1000,
        userId,
      });
      await databaseBuilder.commit();

      const idToken = jsonwebtoken.sign(
        {
          given_name: firstName,
          family_name: lastName,
          nonce: 'nonce',
          sub: externalIdentifier,
        },
        'secret'
      );
      const getAccessTokenResponse = {
        access_token: 'access_token',
        id_token: idToken,
        expires_in: 60,
        refresh_token: 'refresh_token',
      };
      const getAccessTokenRequest = nock(settings.poleEmploi.tokenUrl).post('/').reply(200, getAccessTokenResponse);

      // when
      const response = await server.inject({
        method: 'POST',
        url: '/api/oidc/token',
        headers: {
          Authorization: generateValidRequestAuthorizationHeader(userId),
          'content-type': 'application/x-www-form-urlencoded',
        },
        payload: querystring.stringify({
          identity_provider: AuthenticationMethod.identityProviders.POLE_EMPLOI,
          code: 'code',
          redirect_uri: 'redirect_uri',
          state_sent: 'state',
          state_received: 'state',
        }),
      });

      // then
      expect(response.statusCode).to.equal(200);
      expect(getAccessTokenRequest.isDone()).to.be.true;
      expect(response.result['access_token']).to.exist;
      expect(response.result['logout_url_uuid']).to.match(uuidPattern);
    });

    context('When oidc authentication method exists', function () {
      it('should update its authentication complement', async function () {
        // given
        const firstName = 'John';
        const lastName = 'Doe';
        const externalIdentifier = 'sub';

        const userId = databaseBuilder.factory.buildUser({
          firstName,
          lastName,
        }).id;

        databaseBuilder.factory.buildAuthenticationMethod.withIdentityProvider({
          identityProvider: AuthenticationMethod.identityProviders.POLE_EMPLOI,
          externalIdentifier,
          accessToken: 'old_access_token',
          refreshToken: 'old_refresh_token',
          expiresIn: 1000,
          userId,
        });
        await databaseBuilder.commit();

        const idToken = jsonwebtoken.sign(
          {
            given_name: firstName,
            family_name: lastName,
            nonce: 'nonce',
            sub: externalIdentifier,
          },
          'secret'
        );
        const getAccessTokenResponse = {
          access_token: 'access_token',
          id_token: idToken,
          expires_in: 60,
          refresh_token: 'refresh_token',
        };
        nock(settings.poleEmploi.tokenUrl).post('/').reply(200, getAccessTokenResponse);

        // when
        await server.inject({
          method: 'POST',
          url: '/api/oidc/token',
          headers: {
            Authorization: generateValidRequestAuthorizationHeader(userId),
            'content-type': 'application/x-www-form-urlencoded',
          },
          payload: querystring.stringify({
            identity_provider: AuthenticationMethod.identityProviders.POLE_EMPLOI,
            code: 'code',
            redirect_uri: 'redirect_uri',
            state_sent: 'state',
            state_received: 'state',
          }),
        });

        // then
        const authenticationMethods = await knex('authentication-methods').where({ userId });
        expect(authenticationMethods[0].authenticationComplement.accessToken).to.equal(
          getAccessTokenResponse['access_token']
        );
        expect(authenticationMethods[0].authenticationComplement.expiredDate).to.equal(
          moment().add(getAccessTokenResponse['expires_in'], 's').toISOString()
        );
        expect(authenticationMethods[0].authenticationComplement.refreshToken).to.equal(
          getAccessTokenResponse['refresh_token']
        );
      });

      it('should return a 409 Conflict if the authenticated user is not the expected one', async function () {
        // given
        databaseBuilder.factory.buildUser();
        const otherUser = databaseBuilder.factory.buildUser();
        databaseBuilder.factory.buildAuthenticationMethod.withIdentityProvider({
          identityProvider: AuthenticationMethod.identityProviders.POLE_EMPLOI,
          externalIdentifier: 'other_external_identifier',
          userId: otherUser.id,
        });
        await databaseBuilder.commit();

        const idToken = jsonwebtoken.sign(
          {
            given_name: 'John',
            family_name: 'Doe',
            nonce: 'nonce',
            sub: 'sub',
          },
          'secret'
        );
        const getAccessTokenResponse = {
          access_token: 'access_token',
          id_token: idToken,
          expires_in: 60,
          refresh_token: 'refresh_token',
        };
        nock(settings.poleEmploi.tokenUrl).post('/').reply(200, getAccessTokenResponse);

        // when
        const response = await server.inject({
          method: 'POST',
          url: '/api/oidc/token',
          headers: {
            Authorization: generateValidRequestAuthorizationHeader(otherUser.id),
            'content-type': 'application/x-www-form-urlencoded',
          },
          payload: querystring.stringify({
            identity_provider: AuthenticationMethod.identityProviders.POLE_EMPLOI,
            code: 'code',
            redirect_uri: 'redirect_uri',
            state_sent: 'state',
            state_received: 'state',
          }),
        });

        // then
        expect(response.statusCode).to.equal(409);
      });
    });

    context('When oidc authentication method does not exist', function () {
      it('should create the authentication method with an authentication complement', async function () {
        // given
        const firstName = 'John';
        const lastName = 'Doe';
        const externalIdentifier = 'sub';

        const userId = databaseBuilder.factory.buildUser({
          firstName,
          lastName,
        }).id;
        await databaseBuilder.commit();

        const idToken = jsonwebtoken.sign(
          {
            given_name: firstName,
            family_name: lastName,
            nonce: 'nonce',
            sub: externalIdentifier,
          },
          'secret'
        );
        const getAccessTokenResponse = {
          access_token: 'access_token',
          id_token: idToken,
          expires_in: 60,
          refresh_token: 'refresh_token',
        };
        nock(settings.poleEmploi.tokenUrl).post('/').reply(200, getAccessTokenResponse);

        // when
        await server.inject({
          method: 'POST',
          url: '/api/oidc/token',
          headers: {
            Authorization: generateValidRequestAuthorizationHeader(userId),
            'content-type': 'application/x-www-form-urlencoded',
          },
          payload: querystring.stringify({
            identity_provider: AuthenticationMethod.identityProviders.POLE_EMPLOI,
            code: 'code',
            redirect_uri: 'redirect_uri',
            state_sent: 'state',
            state_received: 'state',
          }),
        });

        // then
        const authenticationMethods = await knex('authentication-methods').where({ userId });
        expect(authenticationMethods[0].authenticationComplement.accessToken).to.equal(
          getAccessTokenResponse['access_token']
        );
        expect(authenticationMethods[0].authenticationComplement.expiredDate).to.equal(
          moment().add(getAccessTokenResponse['expires_in'], 's').toISOString()
        );
        expect(authenticationMethods[0].authenticationComplement.refreshToken).to.equal(
          getAccessTokenResponse['refresh_token']
        );
      });
    });

    context('When user has an invalid token', function () {
      it('should be rejected by API', async function () {
        // given
        const idToken = jsonwebtoken.sign(
          {
            given_name: 'John',
            family_name: 'Doe',
            nonce: 'nonce',
            sub: 'sub',
          },
          'secret'
        );
        const getAccessTokenResponse = {
          access_token: 'access_token',
          id_token: idToken,
          expires_in: 60,
          refresh_token: 'refresh_token',
        };
        nock(settings.poleEmploi.tokenUrl).post('/').reply(200, getAccessTokenResponse);

        // when
        const response = await server.inject({
          method: 'POST',
          url: '/api/oidc/token',
          headers: {
            Authorization: 'invalid_token',
            'content-type': 'application/x-www-form-urlencoded',
          },
          payload: querystring.stringify({
            identity_provider: AuthenticationMethod.identityProviders.POLE_EMPLOI,
            code: 'code',
            redirect_uri: 'redirect_uri',
            state_sent: 'state',
            state_received: 'state',
          }),
        });

        // expect
        expect(response.statusCode).to.equal(401);
      });
    });

    context('When pole-emploi request fail', function () {
      it('should return HTTP 500 with error detail', async function () {
        // given
        const errorData = {
          error: 'invalid_client',
          error_description: 'Invalid authentication method for accessing this endpoint.',
        };
        nock.cleanAll();
        nock(settings.poleEmploi.tokenUrl).post('/').reply(400, errorData);

        // when
        const response = await server.inject({
          method: 'POST',
          url: '/api/oidc/token',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          payload: querystring.stringify({
            identity_provider: AuthenticationMethod.identityProviders.POLE_EMPLOI,
            code: 'code',
            redirect_uri: 'redirect_uri',
            state_sent: 'state',
            state_received: 'state',
          }),
        });

        // expect
        expect(response.statusCode).to.equal(500);
        expect(response.result.errors[0].detail).to.equal(
          '{"error":"invalid_client","error_description":"Invalid authentication method for accessing this endpoint."}'
        );
      });
    });
  });
});
