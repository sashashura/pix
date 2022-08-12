// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi').extend(require('@joi/date'));

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationLearnerController = require('./organization-learner-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'identifier... Remove this comment to see the full error message
const identifiersType = require('../../domain/types/identifiers-type');

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.register = async function (server: $TSFixMe) {
  const adminRoutes = [
    {
      method: 'DELETE',
      path: '/api/admin/organization-learners/{id}/association',
      config: {
        pre: [
          {
            method: (request: $TSFixMe, h: $TSFixMe) =>
              securityPreHandlers.adminMemberHasAtLeastOneAccessOf([
                securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
                securityPreHandlers.checkAdminMemberHasRoleSupport,
              ])(request, h),
            assign: 'hasAuthorizationToAccessAdminScope',
          },
        ],
        handler: organizationLearnerController.dissociate,
        validate: {
          params: Joi.object({
            id: identifiersType.organizationLearnerId,
          }),
        },
        notes: [
          "- **Cette route est restreinte aux utilisateurs authentifiés ayant les droits d'accès**\n" +
            '- Elle dissocie un utilisateur d’un prescrit',
        ],
        tags: ['api', 'admin', 'organization-learners'],
      },
    },
  ];

  server.route([
    ...adminRoutes,
    {
      method: 'DELETE',
      path: '/api/schooling-registration-user-associations/{id}',
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
        handler: organizationLearnerController.dissociate,
        validate: {
          params: Joi.object({
            id: identifiersType.schoolingRegistrationId,
          }),
        },
        notes: [
          "- **Cette route est restreinte aux utilisateurs authentifiés ayant les droits d'accès**\n" +
            '- Elle dissocie un utilisateur d’une inscription d’élève',
          "- L'usage de cette route est **dépréciée** en faveur de /api/admin/organization-learners/{id}/association",
        ],
        tags: ['api', 'admin', 'schoolingRegistrationUserAssociation'],
      },
    },
    {
      method: 'GET',
      path: '/api/schooling-registration-user-associations',
      config: {
        handler: organizationLearnerController.findAssociation,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            "- Récupération de l'inscription de l'élève à l'organisation, et de l'utilisateur associé\n" +
            '- L’id demandé doit correspondre à celui de l’utilisateur authentifié',
          "- L'usage de cette route est **dépréciée** en faveur de /api/organization-learners",
        ],
        tags: ['api', 'organizationLearnerUserAssociation'],
      },
    },
    {
      method: 'GET',
      path: '/api/organization-learners',
      config: {
        handler: organizationLearnerController.findAssociation,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Récupération du prescrit\n' +
            '- L’id demandé doit correspondre à celui de l’utilisateur authentifié',
        ],
        tags: ['api', 'organization-learners'],
      },
    },
  ]);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.name = 'organization-learners-api';
