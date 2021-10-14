'use strict';

const Hapi = require('@hapi/hapi');
const authKeycloak = require('hapi-auth-keycloak');

const init = async () => {

  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  await server.register({ plugin: authKeycloak });

  server.auth.strategy('keycloak-jwt', 'keycloak-jwt', {
    realmUrl: 'http://localhost:8080/auth/realms/pix',
    clientId: 'hapiPix',
    minTimeBetweenJwksRequests: 15,
    cache: true,
    userInfo: ['name', 'email'],
  });

  server.route([
    {
      method: 'GET',
      path: '/check-sso',
      config: {
        description: 'protected endpoint',
        auth: {
          strategies: ['keycloak-jwt'],
        },
        handler() {
          return 'hello world';
        },
      },
    },
  ]);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
