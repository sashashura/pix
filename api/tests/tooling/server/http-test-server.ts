// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Hapi'.
const Hapi = require('@hapi/hapi');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'preRespons... Remove this comment to see the full error message
const preResponseUtils = require('../../../lib/application/pre-response-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'handleFail... Remove this comment to see the full error message
const { handleFailAction } = require('../../../lib/validate');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'authentica... Remove this comment to see the full error message
const authentication = require('../../../lib/infrastructure/authentication');

const routesConfig = {
  routes: {
    validate: {
      failAction: handleFailAction,
    },
  },
};

/**
 * ⚠️ You must declare your stubs before calling the HttpTestServer constructor (because of Node.Js memoization).
 *
 * Ex:
 *
 * beforeEach(() => {
 *   sinon.stub(usecases, 'updateOrganizationInformation');
 *   sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').callsFake((request, reply) => reply(true));
 *   httpTestServer = new HttpTestServer();
 *   await httpTestServer.register(moduleUnderTest);
 * });
 */
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'HttpTestSe... Remove this comment to see the full error message
class HttpTestServer {
  _mustThrow5XXOnError: $TSFixMe;
  _mustThrowOn5XXError: $TSFixMe;
  hapiServer: $TSFixMe;
  constructor({ mustThrowOn5XXError = true } = {}) {
    this.hapiServer = Hapi.server(routesConfig);
    this._mustThrow5XXOnError = mustThrowOn5XXError;
    this._setupErrorHandling();
  }

  async register(moduleUnderTest: $TSFixMe) {
    await this.hapiServer.register(moduleUnderTest);
  }

  _setupErrorHandling() {
    this.hapiServer.ext('onPreResponse', preResponseUtils.handleDomainAndHttpErrors);
  }

  async request(method: $TSFixMe, url: $TSFixMe, payload: $TSFixMe, auth: $TSFixMe, headers: $TSFixMe) {
    const result = await this.hapiServer.inject({ method, url, payload, auth, headers });

    if (this._mustThrowOn5XXError && result.statusCode >= 500) {
      throw new Error('Request Failed');
    }

    return result;
  }

  requestObject({
    method,
    url,
    payload,
    auth,
    headers
  }: $TSFixMe) {
    return this.request(method, url, payload, auth, headers);
  }

  setupAuthentication() {
    this.hapiServer.auth.scheme(authentication.schemeName, authentication.scheme);
    authentication.strategies.forEach((strategy: $TSFixMe) => this.hapiServer.auth.strategy(strategy.name, authentication.schemeName, strategy.configuration)
    );
    this.hapiServer.auth.default(authentication.defaultStrategy);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = HttpTestServer;
