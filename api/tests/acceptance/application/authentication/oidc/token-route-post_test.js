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
const AuthenticationSessionContent = require('../../../../../lib/domain/models/AuthenticationSessionContent');
const authenticationSessionService = require('../../../../../lib/domain/services/authentication/authentication-session-service');
const OidcIdentityProviders = require('../../../../../lib/domain/constants/oidc-identity-providers');

const uuidPattern = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);

describe('Acceptance | Route | oidc | token', function () {
  describe('POST /api/oidc/token', function () {
    let server, clock, payload;

    beforeEach(async function () {
      server = await createServer();
      clock = sinon.useFakeTimers({
        now: Date.now(),
        toFake: ['Date'],
      });
      payload = {
        data: {
          attributes: {
            identity_provider: OidcIdentityProviders.POLE_EMPLOI.code,
            code: 'code',
            redirect_uri: 'redirect_uri',
            state_sent: 'state',
            state_received: 'state',
          },
        },
      };
    });

    afterEach(async function () {
      clock.restore();
      await knex('authentication-methods').delete();
      await knex('users').delete();
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
        const response = await server.inject({ method: 'POST', url: '/api/oidc/token', payload });

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
        identityProvider: OidcIdentityProviders.POLE_EMPLOI.code,
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
        headers: { Authorization: generateValidRequestAuthorizationHeader(userId) },
        payload,
      });

      // then
      expect(response.statusCode).to.equal(200);
      expect(getAccessTokenRequest.isDone()).to.be.true;
      expect(response.result['access_token']).to.exist;
      expect(response.result['logout_url_uuid']).to.match(uuidPattern);
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
          headers: { Authorization: 'invalid_token' },
          payload,
        });

        // expect
        expect(response.statusCode).to.equal(401);
      });
    });
  });
});
