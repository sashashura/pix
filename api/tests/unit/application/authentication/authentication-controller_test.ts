// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, hFake } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('../../../../lib/domain/services/token-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'authentica... Remove this comment to see the full error message
const authenticationController = require('../../../../lib/application/authentication/authentication-controller');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Controller | Authentication', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createToken', function () {
    const accessToken = 'jwt.access.token';
    const USER_ID = 1;
    const username = 'user@email.com';
    const password = 'user_password';
    const scope = 'pix-orga';
    const source = 'pix';

    /**
     * @see https://www.oauth.com/oauth2-servers/access-tokens/access-token-response/
     */
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an OAuth 2 token response (even if we do not really implement OAuth 2 authorization protocol)', async function () {
      // given
      const expirationDelaySeconds = 6666;
      const refreshToken = 'refresh.token';
      const request = {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        payload: {
          grant_type: 'password',
          username,
          password,
          scope,
        },
      };

      sinon
        .stub(usecases, 'authenticateUser')
        .withArgs({ username, password, scope, source })
        .resolves({ accessToken, refreshToken, expirationDelaySeconds });
      sinon.stub(tokenService, 'extractUserId').returns(USER_ID);

      // when
      const response = await authenticationController.createToken(request, hFake);

      // then
      const expectedResponseResult = {
        token_type: 'bearer',
        access_token: accessToken,
        user_id: USER_ID,
        refresh_token: refreshToken,
        expires_in: expirationDelaySeconds,
      };
      expect(response.source).to.deep.equal(expectedResponseResult);
      expect(response.statusCode).to.equal(200);
      expect(response.headers).to.deep.equal({
        'Content-Type': 'application/json;charset=UTF-8',
        'Cache-Control': 'no-store',
        Pragma: 'no-cache',
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#authenticateExternalUser', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an access token', async function () {
      // given
      const accessToken = 'jwt.access.token';
      const user = {
        username: 'saml.jackson1234',
        password: 'Pix123',
      };
      const externalUserToken = 'SamlJacksonToken';
      const expectedUserId = 1;

      const request = {
        payload: {
          data: {
            attributes: {
              username: user.username,
              password: user.password,
              'external-user-token': externalUserToken,
              'expected-user-id': expectedUserId,
            },
            type: 'external-user-authentication-requests',
          },
        },
      };

      sinon
        .stub(usecases, 'authenticateExternalUser')
        .withArgs({
          username: user.username,
          password: user.password,
          externalUserToken,
          expectedUserId,
        })
        .resolves(accessToken);

      // when
      const response = await authenticationController.authenticateExternalUser(request, hFake);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.source.data.attributes['access-token']).to.equal(accessToken);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#authenticateApplication', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an OAuth 2 token response', async function () {
      // given
      const access_token = 'jwt.access.token';
      const client_id = Symbol('clientId');
      const client_secret = Symbol('clientSecret');
      const scope = Symbol('scope');

      const request = {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        payload: {
          grant_type: 'password',
          client_id,
          client_secret,
          scope,
        },
      };
      sinon.stub(tokenService, 'extractClientId').returns(client_id);
      sinon
        .stub(usecases, 'authenticateApplication')
        .withArgs({ clientId: client_id, clientSecret: client_secret, scope })
        .resolves(access_token);

      // when
      const response = await authenticationController.authenticateApplication(request, hFake);

      // then
      const expectedResponseResult = {
        token_type: 'bearer',
        access_token,
        client_id,
      };
      expect(response.source).to.deep.equal(expectedResponseResult);
      expect(response.statusCode).to.equal(200);
      expect(response.headers).to.deep.equal({
        'Content-Type': 'application/json;charset=UTF-8',
        'Cache-Control': 'no-store',
        Pragma: 'no-cache',
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#revokeToken', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 204', async function () {
      // given
      const token = 'jwt.refresh.token';
      const request = {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        payload: {
          token,
        },
      };
      sinon.stub(usecases, 'revokeRefreshToken').resolves();

      // when
      const response = await authenticationController.revokeToken(request, hFake);

      // then
      expect(response.statusCode).to.equal(204);
      sinon.assert.calledWith(usecases.revokeRefreshToken, { refreshToken: token });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null when token hint is of type access token', async function () {
      // given
      const token = 'jwt.refresh.token';
      const request = {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        payload: {
          token,
          token_type_hint: 'access_token',
        },
      };
      sinon.stub(usecases, 'revokeRefreshToken').resolves();

      // when
      const response = await authenticationController.revokeToken(request, hFake);

      // then
      expect(response).to.be.null;
    });
  });
});
