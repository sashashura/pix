// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tagControl... Remove this comment to see the full error message
const tagController = require('./tag-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.register = async (server: $TSFixMe) => {
  server.route([
    {
      method: 'POST',
      path: '/api/admin/tags',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
            assign: 'hasRoleSuperAdmin',
          },
        ],
        validate: {
          payload: Joi.object({
            data: {
              type: 'tags',
              attributes: {
                name: Joi.string().required(),
              },
            },
          }),
          options: {
            allowUnknown: true,
          },
        },
        handler: tagController.create,
        tags: ['api', 'tags'],
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés ayant le role Super Admin**\n' +
            '- Elle permet de créer un tag',
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/admin/tags',
      config: {
        pre: [
          {
            method: (request: $TSFixMe, h: $TSFixMe) =>
              securityPreHandlers.adminMemberHasAtLeastOneAccessOf([
                securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
                securityPreHandlers.checkAdminMemberHasRoleCertif,
                securityPreHandlers.checkAdminMemberHasRoleSupport,
                securityPreHandlers.checkAdminMemberHasRoleMetier,
              ])(request, h),
            assign: 'hasAuthorizationToAccessAdminScope',
          },
        ],
        handler: tagController.findAllTags,
        notes: [
          "- **Cette route est restreinte aux utilisateurs authentifiés ayant les droits d'accès**\n" +
            '- Renvoie tous les tags.',
        ],
        tags: ['api', 'tags'],
      },
    },
  ]);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.name = 'tags-api';
