// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'challengeC... Remove this comment to see the full error message
const challengeController = require('./challenge-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'identifier... Remove this comment to see the full error message
const identifiersType = require('../../domain/types/identifiers-type');

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.register = async function (server: $TSFixMe) {
  server.route([
    {
      method: 'GET',
      path: '/api/challenges/{id}',
      config: {
        auth: false,
        validate: {
          params: Joi.object({
            id: identifiersType.challengeId,
          }),
        },
        handler: challengeController.get,
        tags: ['api'],
      },
    },
  ]);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.name = 'challenges-api';
