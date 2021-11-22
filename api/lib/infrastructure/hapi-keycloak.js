const KeycloakConfig = require('keycloak-connect/middleware/auth-utils/config');
const GrantManager = require('keycloak-connect/middleware/auth-utils/grant-manager');
const Token = require('keycloak-connect/middleware/auth-utils/token');
const Grant = require('keycloak-connect/middleware/auth-utils/grant');
const Boom = require('@hapi/boom');
const _ = require('lodash');
const crypto = require('crypto');

const throwError = (message) => {
  throw new Error(message);
};

const tokenRules = {
  exists: (token) => token || throwError('Invalid token (missing)'),
  notExpired: (token) =>
    (token.content.exp || token.content.expiration) * 1000 > Date.now() || throwError('Invalid token (expired)'),
  signed: (token) => token.signed || throwError('Invalid token (not signed)'),
  validAction: (token, action) => token.content.action === action || throwError('Invalid token (wrong action)'),
  validResource: (token, resource) =>
    token.content.resource === resource || throwError('Invalid token (wrong resource)'),
  validSignature: async (token, grantManager) => {
    const verify = crypto.createVerify('RSA-SHA256');
    if (grantManager.publicKey) {
      verify.update(token.signed);
      if (!verify.verify(grantManager.publicKey, token.signature, 'base64')) {
        throwError('Invalid token (signature)');
      }
    } else {
      const key = await grantManager.rotation.getJWK(token.header.kid);
      verify.update(token.signed);
      if (!verify.verify(key, token.signature)) {
        throwError('Invalid token (signature)');
      }
    }
  },
};

class ActionTokenVerifier {
  constructor(grantManager) {
    this.grantManager = grantManager;
  }

  async verify(token, { action, resource }) {
    tokenRules.exists(token);
    tokenRules.notExpired(token);
    tokenRules.signed(token);
    tokenRules.validAction(token, action);
    tokenRules.validResource(token, resource);
    await tokenRules.validSignature(token, this.grantManager);
    return token;
  }
}

class BearerGrantStore {
  constructor() {
    this.name = 'bearer';
  }

  canRetrieveGrantFrom(request) {
    const header = request.headers.authorization;
    if (!header) {
      return false;
    }
    return header.indexOf('bearer ') === 0 || header.indexOf('Bearer ') === 0;
  }

  getGrant(request) {
    if (!this.canRetrieveGrantFrom(request)) {
      return null;
    }
    const accessToken = request.headers.authorization.substring('bearer '.length);
    return {
      access_token: accessToken,
    };
  }
}

class GrantSerializer {
  constructor(clientId) {
    this.clientId = clientId;
  }

  deserialize(grantData) {
    if (!grantData) {
      return null;
    }
    return new Grant({
      access_token: grantData.access_token ? new Token(grantData.access_token, this.clientId) : undefined,
      __raw: grantData,
    });
  }
}

class KeycloakAdapter {
  constructor(server, config) {
    this.server = server;
    this.config = Object.assign(
      {
        principalNameAttribute: 'name',
      },
      config
    );
    if (!this.config.secret) {
      this.config.secret = this.config.clientSecret;
    }
    this.keycloakConfig = new KeycloakConfig(this.config);
    this.grantManager = new GrantManager(this.keycloakConfig);
    this.actionTokenVerifier = new ActionTokenVerifier(this.grantManager);
    this.grantSerializer = new GrantSerializer(this.config.clientId);
    this.grantStore = new BearerGrantStore();
  }

  getAssignedRoles(accessToken) {
    const appRoles = _.get(accessToken, `content.resource_access['${this.keycloakConfig.clientId}'].roles`, []);
    const realmRoles = _.get(accessToken, 'content.realm_access.roles', []);
    return _.union(appRoles, realmRoles);
  }

  async authenticate(request, reply) {
    const log = this.server.log.bind(this.server);
    const grant = this.grantStore.getGrant(request);
    const existingGrant = grant ? this.grantSerializer.deserialize(grant) : null;

    if (!existingGrant) {
      log(['debug', 'keycloak'], 'No authorization grant received.');
      return null;
    }
    try {
      const grant = await this.grantManager.validateGrant(existingGrant);
      return this.getPrincipal(grant);
    } catch (err) {
      log(['warn', 'keycloak'], `Authorization has failed - Received grant is invalid: ${err}.`);
      return null;
    }
  }

  answer(reply) {
    return {
      authenticated: (options) => reply.authenticated(options),
      representation: (obj) => obj,
    };
  }

  getAuthScheme() {
    const keycloak = this;
    return (server, options) => {
      return {
        authenticate: async (request, reply) => {
          const credentials = await keycloak.authenticate(request, reply);
          server.log(
            ['debug', 'keycloak'],
            `Authentication request. URL: ${request.raw.req.url}, user: ${
              credentials ? credentials.name : '[Anonymous]'
            }`
          );
          if (credentials) {
            return keycloak.answer(reply).authenticated({ credentials });
          } else {
            return Boom.unauthorized('The resource owner is not authenticated.', 'bearer', {
              realm: keycloak.config.realm,
            });
          }
        },
      };
    };
  }

  getPrincipal(grant) {
    return {
      name: this.getPrincipalName(grant),
      scope: this.getAssignedRoles(grant.access_token),
      idToken: grant.id_token,
      accessToken: grant.access_token,
      userId: parseInt(grant.access_token?.content?.pixUserId),
    };
  }

  getPrincipalName(grant) {
    const principalNameAttribute = this.config.principalNameAttribute;
    let principalName;
    if (grant.id_token && grant.id_token.content[principalNameAttribute]) {
      principalName = grant.id_token.content[principalNameAttribute];
    } else if (grant.access_token.content[principalNameAttribute]) {
      principalName = grant.access_token.content[principalNameAttribute];
    } else {
      this.server.log(
        ['warn', 'keycloak'],
        `Neither ID token nor access token contains '${principalNameAttribute}' attribute. Using 'sub' instead.`
      );
      principalName = grant.access_token.content.sub;
    }
    return principalName;
  }

  register() {
    this.server.auth.scheme('keycloak', this.getAuthScheme());
  }
}

module.exports = {
  register(server, options) {
    const adapter = new KeycloakAdapter(server, options);
    adapter.register();
  },
  name: 'hapi-keycloak',
  version: '1.0.0',
};
