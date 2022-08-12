// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'jsonwebtok... Remove this comment to see the full error message
const jsonwebtoken = require('jsonwebtoken');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
  knex,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'nock'.
  nock,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
  sinon,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../../../../lib/config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../../../../lib/domain/models/AuthenticationMethod');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationSessionContent = require('../../../../../lib/domain/models/AuthenticationSessionContent');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'authentica... Remove this comment to see the full error message
const authenticationSessionService = require('../../../../../lib/domain/services/authentication/authentication-session-service');

const uuidPattern = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Route | oidc | token', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/oidc/token', function () {
    let server: $TSFixMe, clock: $TSFixMe, payload: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      server = await createServer();
      clock = sinon.useFakeTimers({
        now: Date.now(),
        toFake: ['Date'],
      });
      payload = {
        data: {
          attributes: {
            identity_provider: AuthenticationMethod.identityProviders.POLE_EMPLOI,
            code: 'code',
            redirect_uri: 'redirect_uri',
            state_sent: 'state',
            state_received: 'state',
          },
        },
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      clock.restore();
      await knex('authentication-methods').delete();
      await knex('users').delete();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When user does not have an account', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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
        headers: { Authorization: generateValidRequestAuthorizationHeader(userId) },
        payload,
      });

      // then
      expect(response.statusCode).to.equal(200);
      expect(getAccessTokenRequest.isDone()).to.be.true;
      expect(response.result['access_token']).to.exist;
      expect(response.result['logout_url_uuid']).to.match(uuidPattern);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When user has an invalid token', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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
