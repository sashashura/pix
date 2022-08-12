// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'membership... Remove this comment to see the full error message
const membershipController = require('./membership-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'identifier... Remove this comment to see the full error message
const identifiersType = require('../../domain/types/identifiers-type');

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.register = async function (server: $TSFixMe) {
  server.route([
    {
      method: 'POST',
      path: '/api/admin/memberships',
      config: {
        pre: [
          {
            method: (request: $TSFixMe, h: $TSFixMe) =>
              securityPreHandlers.adminMemberHasAtLeastOneAccessOf([
                securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
                securityPreHandlers.checkAdminMemberHasRoleSupport,
                securityPreHandlers.checkAdminMemberHasRoleMetier,
              ])(request, h),
            assign: 'hasAuthorizationToAccessAdminScope',
          },
        ],
        handler: membershipController.create,
        notes: [
          "- **Cette route est restreinte aux utilisateurs authentifiés ayant les droits d'accès**\n" +
            '- Elle permet de donner l’accès à une organisation, avec un rôle particulier pour un utilisateur donné',
        ],
        plugins: {
          'hapi-swagger': {
            payloadType: 'form',
            order: 1,
          },
        },
        tags: ['api', 'memberships'],
      },
    },
    {
      method: 'PATCH',
      path: '/api/memberships/{id}',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkUserIsAdminInOrganization,
            assign: 'isAdminInOrganization',
          },
        ],
        validate: {
          params: Joi.object({
            id: identifiersType.membershipId,
          }),
        },
        handler: membershipController.update,
        description: 'Update organization role by admin for a organization members',
        notes: [
          "- **Cette route est restreinte aux utilisateurs authentifiés en tant qu'administrateur de l'organisation**\n" +
            "- Elle permet de modifier le rôle d'un membre de l'organisation",
        ],
        plugins: {
          'hapi-swagger': {
            payloadType: 'form',
            order: 2,
          },
        },
        tags: ['api', 'memberships'],
      },
    },
    {
      method: 'PATCH',
      path: '/api/admin/memberships/{id}',
      config: {
        pre: [
          {
            method: (request: $TSFixMe, h: $TSFixMe) =>
              securityPreHandlers.adminMemberHasAtLeastOneAccessOf([
                securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
                securityPreHandlers.checkAdminMemberHasRoleSupport,
                securityPreHandlers.checkAdminMemberHasRoleMetier,
              ])(request, h),
            assign: 'hasAuthorizationToAccessAdminScope',
          },
        ],
        validate: {
          params: Joi.object({
            id: identifiersType.membershipId,
          }),
        },
        handler: membershipController.update,
        description: 'Update organization role by admin for a organization members',
        notes: [
          "- **Cette route est restreinte aux utilisateurs authentifiés ayant les droits d'accès**\n" +
            "- Elle permet de modifier le rôle d'un membre de l'organisation",
        ],
        plugins: {
          'hapi-swagger': {
            payloadType: 'form',
            order: 2,
          },
        },
        tags: ['api', 'memberships'],
      },
    },
    {
      method: 'POST',
      path: '/api/memberships/{id}/disable',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkUserIsAdminInOrganization,
            assign: 'isAdminInOrganization',
          },
        ],
        validate: {
          params: Joi.object({
            id: identifiersType.membershipId,
          }),
        },
        handler: membershipController.disable,
        notes: [
          "- **Cette route est restreinte aux utilisateurs authentifiés en tant qu'administrateur de l'organisation\n" +
            "- Elle permet la désactivation d'un membre",
        ],
      },
    },
    {
      method: 'POST',
      path: '/api/admin/memberships/{id}/disable',
      config: {
        pre: [
          {
            method: (request: $TSFixMe, h: $TSFixMe) =>
              securityPreHandlers.adminMemberHasAtLeastOneAccessOf([
                securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
                securityPreHandlers.checkAdminMemberHasRoleSupport,
                securityPreHandlers.checkAdminMemberHasRoleMetier,
              ])(request, h),
            assign: 'hasAuthorizationToAccessAdminScope',
          },
        ],
        validate: {
          params: Joi.object({
            id: identifiersType.membershipId,
          }),
        },
        handler: membershipController.disable,
        notes: [
          "- **Cette route est restreinte aux utilisateurs authentifiés ayant les droits d'accès**\n" +
            "- Elle permet la désactivation d'un membre",
        ],
      },
    },
  ]);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.name = 'memberships-api';
