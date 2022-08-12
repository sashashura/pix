// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config();
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Hapi'.
const Hapi = require('@hapi/hapi');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const Oppsy = require('@hapi/oppsy');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('./lib/config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'preRespons... Remove this comment to see the full error message
const preResponseUtils = require('./lib/application/pre-response-utils');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const routes = require('./lib/routes');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'plugins'.
const plugins = require('./lib/infrastructure/plugins');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'swaggers'.
const swaggers = require('./lib/swaggers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'authentica... Remove this comment to see the full error message
const authentication = require('./lib/infrastructure/authentication');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'handleFail... Remove this comment to see the full error message
const { handleFailAction } = require('./lib/validate');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'monitoring... Remove this comment to see the full error message
const monitoringTools = require('./lib/infrastructure/monitoring-tools');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'deserializ... Remove this comment to see the full error message
const deserializer = require('./lib/infrastructure/serializers/jsonapi/deserializer');

monitoringTools.installHapiHook();

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'config'.
let config: $TSFixMe;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = async () => {
  loadConfiguration();

  const server = createBareServer();

  if (settings.logOpsMetrics) await enableOpsMetrics(server);

  setupErrorHandling(server);

  setupAuthentication(server);

  await setupRoutesAndPlugins(server);

  await setupOpenApiSpecification(server);

  setupDeserialization(server);

  return server;
};

const createBareServer = function () {
  const serverConfiguration = {
    compression: false,
    debug: { request: false, log: false },
    routes: {
      validate: {
        failAction: handleFailAction,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['X-Requested-With'],
      },
      response: {
        emptyStatusCode: 204,
      },
    },
    port: config.port,
    router: {
      isCaseSensitive: false,
      stripTrailingSlash: true,
    },
  };

  return new Hapi.server(serverConfiguration);
};

const enableOpsMetrics = async function (server: $TSFixMe) {
  const oppsy = new Oppsy(server);

  oppsy.on('ops', (data: $TSFixMe) => {
    server.log(['ops'], data);
  });

  oppsy.start(config.logging.emitOpsEventEachSeconds * 1000);
};

const loadConfiguration = function () {
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  config = require('./lib/config');
};

const setupErrorHandling = function (server: $TSFixMe) {
  server.ext('onPreResponse', preResponseUtils.handleDomainAndHttpErrors);
};

const setupDeserialization = function (server: $TSFixMe) {
  server.ext('onPreHandler', async (request: $TSFixMe, h: $TSFixMe) => {
    if (request.payload?.data) {
      request.deserializedPayload = await deserializer.deserialize(request.payload);
    }
    return h.continue;
  });
};

const setupAuthentication = function (server: $TSFixMe) {
  server.auth.scheme(authentication.schemeName, authentication.scheme);
  authentication.strategies.forEach((strategy: $TSFixMe) => {
    server.auth.strategy(strategy.name, authentication.schemeName, strategy.configuration);
  });
  server.auth.default(authentication.defaultStrategy);
};

const setupRoutesAndPlugins = async function (server: $TSFixMe) {
  const configuration = [].concat(plugins, routes);
  await server.register(configuration);
};

const setupOpenApiSpecification = async function (server: $TSFixMe) {
  for (const swaggerRegisterArgs of swaggers) {
    await server.register(...swaggerRegisterArgs);
  }
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = createServer;
