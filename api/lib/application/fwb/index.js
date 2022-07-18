const fwbController = require('./fwb-controller');

exports.register = async function (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/fwb/auth-url',
      config: {
        auth: false,
        handler: fwbController.getAuthUrl,
        notes: [
          "- Cette route permet de récupérer l'url d'authentification de la FWB.\n" +
            '- Elle retournera également les valeurs state et nonce.',
        ],
        tags: ['api', 'FWB'],
      },
    },
    {
      method: 'POST',
      path: '/api/fwb/users',
      config: {
        auth: false,
        handler: fwbController.createUser,
        notes: [
          '- Cette route permet de créer un compte Pix pour un utilisateur provenant de la FWB.\n' +
            "- Elle retournera un access token Pix correspondant à l'utilisateur.",
        ],
        tags: ['api', 'FWB'],
      },
    },
  ]);
};

exports.name = 'fwb-api';
