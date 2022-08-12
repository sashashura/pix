// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BadRequest... Remove this comment to see the full error message
const { BadRequestError } = require('../http-errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('../../domain/services/token-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  /**
   * @see https://tools.ietf.org/html/rfc6749#section-4.3
   */
  async createToken(request: $TSFixMe, h: $TSFixMe) {
    let accessToken, refreshToken;
    let expirationDelaySeconds;

    if (request.payload.grant_type === 'refresh_token') {
      refreshToken = request.payload.refresh_token;
      const accessTokenAndExpirationDelaySeconds = await usecases.createAccessTokenFromRefreshToken({ refreshToken });
      accessToken = accessTokenAndExpirationDelaySeconds.accessToken;
      expirationDelaySeconds = accessTokenAndExpirationDelaySeconds.expirationDelaySeconds;
    } else if (request.payload.grant_type === 'password') {
      const { username, password, scope } = request.payload;

      const source = 'pix';
      const tokensAndExpirationDelaySeconds = await usecases.authenticateUser({ username, password, scope, source });
      accessToken = tokensAndExpirationDelaySeconds.accessToken;
      refreshToken = tokensAndExpirationDelaySeconds.refreshToken;
      expirationDelaySeconds = tokensAndExpirationDelaySeconds.expirationDelaySeconds;
    } else {
      throw new BadRequestError('Invalid grant type');
    }

    return h
      .response({
        token_type: 'bearer',
        access_token: accessToken,
        user_id: tokenService.extractUserId(accessToken),
        refresh_token: refreshToken,
        expires_in: expirationDelaySeconds,
      })
      .code(200)
      .header('Content-Type', 'application/json;charset=UTF-8')
      .header('Cache-Control', 'no-store')
      .header('Pragma', 'no-cache');
  },

  async authenticateExternalUser(request: $TSFixMe, h: $TSFixMe) {
    const {
      username,
      password,
      'external-user-token': externalUserToken,
      'expected-user-id': expectedUserId,
    } = request.payload.data.attributes;

    const accessToken = await usecases.authenticateExternalUser({
      username,
      password,
      externalUserToken,
      expectedUserId,
    });

    const response = {
      data: {
        attributes: {
          'access-token': accessToken,
        },
        type: 'external-user-authentication-requests',
      },
    };
    return h.response(response).code(200);
  },

  async authenticateAnonymousUser(request: $TSFixMe, h: $TSFixMe) {
    const { campaign_code: campaignCode, lang } = request.payload;
    const accessToken = await usecases.authenticateAnonymousUser({ campaignCode, lang });

    const response = {
      token_type: 'bearer',
      access_token: accessToken,
    };

    return h.response(response).code(200);
  },

  async authenticateApplication(request: $TSFixMe, h: $TSFixMe) {
    const { client_id: clientId, client_secret: clientSecret, scope } = request.payload;

    const accessToken = await usecases.authenticateApplication({ clientId, clientSecret, scope });

    return h
      .response({
        token_type: 'bearer',
        access_token: accessToken,
        client_id: clientId,
      })
      .code(200)
      .header('Content-Type', 'application/json;charset=UTF-8')
      .header('Cache-Control', 'no-store')
      .header('Pragma', 'no-cache');
  },

  async revokeToken(request: $TSFixMe, h: $TSFixMe) {
    if (request.payload.token_type_hint === 'access_token') return null;

    await usecases.revokeRefreshToken({ refreshToken: request.payload.token });
    return h.response().code(204);
  },
};
