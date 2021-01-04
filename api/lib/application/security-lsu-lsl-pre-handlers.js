const tokenService = require('../domain/services/token-service');
const boom = require('boom');

const JSONAPIError = require('jsonapi-serializer').Error;
const _ = require('lodash');

function _replyWithAuthenticationError(h) {
  return Promise.resolve().then(() => {
    const errorHttpStatusCode = 401;

    const jsonApiError = new JSONAPIError({
      code: errorHttpStatusCode,
      title: 'Unauthorized access',
      detail: 'Missing or invalid access token in request auhorization headers.',
    });

    return h.response(jsonApiError).code(errorHttpStatusCode).takeover();
  });
}

function _replyWithAuthorizationError(h) {
  return Promise.resolve().then(() => {
    const errorHttpStatusCode = 403;

    const jsonApiError = new JSONAPIError({
      code: errorHttpStatusCode,
      title: 'Forbidden access',
      detail: 'Missing or insufficient permissions.',
    });

    return h.response(jsonApiError).code(errorHttpStatusCode).takeover();
  });
}

const LIVRET_SCOLAIRE_SCOPE = 'organisation-certifications-results';

async function checkApplicationIsAuthenticated(request, h) {

  if (!request.headers.authorization) {
    return boom.unauthorized(null, 'jwt');
  }

  const authorizationHeader = request.headers.authorization;
  const accessToken = tokenService.extractTokenFromAuthChain(authorizationHeader);

  if (!accessToken) {
    return _replyWithAuthenticationError(h);
  }

  const decodedAccessToken = tokenService.getDecodedToken(accessToken);

  if (decodedAccessToken && decodedAccessToken.clientId !== 'livret-scolaire-client-id') {
    return _replyWithAuthenticationError(h);
  }

  if (decodedAccessToken && decodedAccessToken.scope !== LIVRET_SCOLAIRE_SCOPE) {
    return _replyWithAuthorizationError(h);
  }
  if (decodedAccessToken && decodedAccessToken.scope === LIVRET_SCOLAIRE_SCOPE) {
    return h.authenticated({ credentials: { accessToken, client_id: decodedAccessToken.clientId, source: decodedAccessToken.source } });
  }
  return _replyWithAuthenticationError(h);
}

module.exports = {
  checkApplicationIsAuthenticated,
};
