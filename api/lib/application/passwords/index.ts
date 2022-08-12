// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'XRegExp'.
const XRegExp = require('xregexp');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'passwordVa... Remove this comment to see the full error message
const { passwordValidationPattern } = require('../../config').account;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'passwordCo... Remove this comment to see the full error message
const passwordController = require('./password-controller');

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.register = async function (server: $TSFixMe) {
  server.route([
    {
      method: 'POST',
      path: '/api/password-reset-demands',
      config: {
        auth: false,
        handler: passwordController.createResetDemand,
        validate: {
          payload: Joi.object({
            data: {
              attributes: {
                email: Joi.string().email().required(),
                'temporary-key': [Joi.string(), null],
              },
              type: Joi.string(),
            },
          }),
        },
        notes: ['Route publique', 'Faire une demande de réinitialisation de mot de passe'],
        tags: ['api', 'passwords'],
      },
    },

    {
      method: 'GET',
      path: '/api/password-reset-demands/{temporaryKey}',
      config: {
        auth: false,
        handler: passwordController.checkResetDemand,
        tags: ['api', 'passwords'],
      },
    },
    {
      method: 'POST',
      path: '/api/expired-password-updates',
      config: {
        auth: false,
        handler: passwordController.updateExpiredPassword,
        validate: {
          payload: Joi.object({
            data: {
              attributes: {
                'password-reset-token': Joi.string().required(),
                'new-password': Joi.string().pattern(XRegExp(passwordValidationPattern)).required(),
              },
              type: Joi.string(),
            },
          }),
        },
        notes: ['Route publique', 'Cette route permet de mettre à jour un mot de passe expiré'],
        tags: ['api', 'passwords'],
      },
    },
  ]);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.name = 'passwords-api';
