// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'authentica... Remove this comment to see the full error message
const authenticationServiceRegistry = require('../../../domain/services/authentication/authentication-service-registry');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'get'.
const get = require('lodash/get');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const authenticationRegistry = require('../../../domain/services/authentication/authentication-service-registry');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../../domain/models/AuthenticationMethod');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Unauthoriz... Remove this comment to see the full error message
const { UnauthorizedError } = require('../../http-errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'config'.
const config = require('../../../config');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getRedirectLogoutUrl(request: $TSFixMe, h: $TSFixMe) {
    const userId = request.auth.credentials.userId;
    const { identity_provider: identityProvider, logout_url_uuid: logoutUrlUUID } = request.query;
    const oidcAuthenticationService = authenticationServiceRegistry.lookupAuthenticationService(identityProvider);
    const redirectLogoutUrl = await oidcAuthenticationService.getRedirectLogoutUrl({
      userId,
      logoutUrlUUID,
    });

    return h.response({ redirectLogoutUrl }).code(200);
  },

  async getAuthenticationUrl(request: $TSFixMe, h: $TSFixMe) {
    const { identity_provider: identityProvider } = request.query;
    const oidcAuthenticationService = authenticationRegistry.lookupAuthenticationService(identityProvider);
    const result = oidcAuthenticationService.getAuthenticationUrl({ redirectUri: request.query['redirect_uri'] });
    return h.response(result).code(200);
  },

  async authenticateUser(request: $TSFixMe) {
    const { code, identityProvider, redirectUri, stateSent, stateReceived } = request.deserializedPayload;
    let authenticatedUserId;
    if (!config.featureToggles.isSsoAccountReconciliationEnabled) {
      authenticatedUserId =
        identityProvider === AuthenticationMethod.identityProviders.POLE_EMPLOI
          ? get(request.auth, 'credentials.userId')
          : undefined;
    }
    const oidcAuthenticationService = authenticationRegistry.lookupAuthenticationService(identityProvider);

    const result = await usecases.authenticateOidcUser({
      authenticatedUserId,
      code,
      redirectUri,
      stateReceived,
      stateSent,
      oidcAuthenticationService,
    });

    if (result.isAuthenticationComplete) {
      return {
        access_token: result.pixAccessToken,
        logout_url_uuid: result.logoutUrlUUID,
      };
    } else {
      const message = "L'utilisateur n'a pas de compte Pix";
      const responseCode = 'SHOULD_VALIDATE_CGU';
      const meta = { authenticationKey: result.authenticationKey };
      throw new UnauthorizedError(message, responseCode, meta);
    }
  },

  async createUser(request: $TSFixMe, h: $TSFixMe) {
    const { identityProvider, authenticationKey } = request.deserializedPayload;

    const { accessToken, logoutUrlUUID } = await usecases.createOidcUser({ authenticationKey, identityProvider });

    const response = { access_token: accessToken, logout_url_uuid: logoutUrlUUID };
    return h.response(response).code(200);
  },
};
