'use strict';

const Hapi = require('@hapi/hapi');

const init = async () => {

  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  await server.register({
    plugin: require('keycloak-hapi'),
    options: {
      serverUrl: 'http://localhost:8080/auth',
      realm: 'pix',
      clientId: 'hapiPix',
      clientSecret: 'f9033011-6a16-439f-af97-c0c924bb9910',
      bearerOnly: true,
    },
  });

  server.auth.strategy('keycloak', 'keycloak');
  server.auth.default('keycloak');

  server.route([
    {
      method: 'GET',
      path: '/api',
      config: {
        description: 'protected endpoint',
        auth: {
          strategies: ['keycloak'],
        },
        handler(request) {
          console.debug(request.auth);
          return { msg: `Vous êtes dans l'API, ${request.auth.credentials.name}` };
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
