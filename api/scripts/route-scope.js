const Hapi = require('@hapi/hapi');
const authentication = require('../lib/infrastructure/authentication');
const routes = require('../lib/routes');
const scope = 'perimetre-acces';

const logRoutingTable = async () => {
  const server = await createServer();

  const routingTable = server.table();
  const scopedRoutes = routingTable.filter((route) => {
    if (route.settings && route.settings.description && route.settings.description === scope) {
      return true;
    } else {
      return false;
    }

  });

  scopedRoutes.map((route) => {
    console.log(`${route.method} ${route.path}`);
  });
};

const createServer = async function () {
  const server = new Hapi.server();
  setupAuthentication(server);
  await setupRoutesAndPlugins(server);
  return server;
};

const setupRoutesAndPlugins = async function (server) {
  await server.register(routes);
};

const setupAuthentication = function (server) {
  server.auth.scheme(authentication.schemeName, authentication.scheme);
  authentication.strategies.map((strategy) => {
    server.auth.strategy(strategy.name, authentication.schemeName, strategy.configuration);
  });
  server.auth.default(authentication.defaultStrategy);
};

(async () => {
  await logRoutingTable();
})();
