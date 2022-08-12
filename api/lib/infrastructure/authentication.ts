// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'find'.
const { find } = require('lodash');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const boom = require('boom');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('../domain/services/token-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'config'.
const config = require('../../lib/config');

async function _checkIsAuthenticated(request: $TSFixMe, h: $TSFixMe, {
  key,
  validate
}: $TSFixMe) {
  if (!request.headers.authorization) {
    return boom.unauthorized(null, 'jwt');
  }

  const authorizationHeader = request.headers.authorization;
  const accessToken = tokenService.extractTokenFromAuthChain(authorizationHeader);

  if (!accessToken) {
    return boom.unauthorized();
  }

  const decodedAccessToken = tokenService.getDecodedToken(accessToken, key);
  if (decodedAccessToken) {
    const { isValid, credentials, errorCode } = validate(decodedAccessToken, request, h);
    if (isValid) {
      return h.authenticated({ credentials });
    }

    if (errorCode === 403) {
      return boom.forbidden();
    }
  }

  return boom.unauthorized();
}

function validateUser(decoded: $TSFixMe) {
  return { isValid: true, credentials: { userId: decoded.user_id } };
}

function validateClientApplication(decoded: $TSFixMe) {
  const application = find(config.graviteeRegisterApplicationsCredentials, { clientId: decoded.client_id });

  if (!application) {
    return { isValid: false, errorCode: 401 };
  }

  if (decoded.scope !== application.scope) {
    return { isValid: false, errorCode: 403 };
  }

  return { isValid: true, credentials: { client_id: decoded.clientId, scope: decoded.scope, source: decoded.source } };
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  schemeName: 'jwt-scheme',

  scheme(_: $TSFixMe, {
    key,
    validate
  }: $TSFixMe) {
    return { authenticate: (request: $TSFixMe, h: $TSFixMe) => _checkIsAuthenticated(request, h, { key, validate }) };
  },

  strategies: [
    {
      name: 'jwt-user',
      configuration: {
        key: config.authentication.secret,
        validate: validateUser,
      },
    },
    {
      name: 'jwt-livret-scolaire',
      configuration: {
        key: config.jwtConfig.livretScolaire.secret,
        validate: validateClientApplication,
      },
    },
    {
      name: 'jwt-pole-emploi',
      configuration: {
        key: config.jwtConfig.poleEmploi.secret,
        validate: validateClientApplication,
      },
    },
  ],

  defaultStrategy: 'jwt-user',
};
