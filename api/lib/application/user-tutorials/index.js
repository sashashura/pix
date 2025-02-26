const Joi = require('joi');

const userTutorialsController = require('./user-tutorials-controller');
const identifiersType = require('../../domain/types/identifiers-type');

exports.register = async (server) => {
  server.route([
    {
      method: 'PUT',
      path: '/api/users/tutorials/{tutorialId}',
      config: {
        handler: userTutorialsController.add,
        validate: {
          params: Joi.object({
            tutorialId: identifiersType.tutorialId,
          }),
          payload: Joi.object({
            data: Joi.object({
              attributes: Joi.object({
                'skill-id': Joi.string().allow(null),
              }),
            }),
          }).allow(null),
          options: {
            allowUnknown: true,
          },
        },
        tags: ['api', 'tutorials'],
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Enregistrement d‘un tutoriel par l‘utilisateur courant\n' +
            '- L’id du tutoriel doit faire référence à un tutoriel existant',
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/users/tutorials/saved',
      config: {
        handler: userTutorialsController.findSaved,
        tags: ['api', 'tutorials'],
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Récupération des tutoriels enregistrés par l‘utilisateur courant\n',
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/users/tutorials/recommended',
      config: {
        handler: userTutorialsController.findRecommended,
        tags: ['api', 'tutorials'],
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Récupération des tutoriels recommandés pour l‘utilisateur courant\n',
        ],
      },
    },
    {
      method: 'DELETE',
      path: '/api/users/tutorials/{tutorialId}',
      config: {
        validate: {
          params: Joi.object({
            tutorialId: identifiersType.tutorialId,
          }),
        },
        handler: userTutorialsController.removeFromUser,
        tags: ['api', 'tutorials'],
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Suppression d‘un tutoriel de la liste des tutoriels enregistrés par l‘utilisateur courant\n' +
            ' - L‘id du tutoriel doit faire référence à un tutoriel existant',
        ],
      },
    },
  ]);
};

exports.name = 'tutorials-api';
