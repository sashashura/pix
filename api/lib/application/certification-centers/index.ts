// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCenterController = require('./certification-center-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'identifier... Remove this comment to see the full error message
const identifiersType = require('../../domain/types/identifiers-type');

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.register = async function (server: $TSFixMe) {
  server.route([
    {
      method: 'POST',
      path: '/api/certification-centers',
      config: {
        handler: certificationCenterController.create,
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
        notes: [
          "- **Cette route est restreinte aux utilisateurs ayant les droits d'accès**\n" +
            '- Création d‘un nouveau centre de certification\n',
        ],
        tags: ['api', 'certification-center'],
      },
    },
    {
      method: 'PATCH',
      path: '/api/certification-centers/{id}',
      config: {
        handler: certificationCenterController.update,
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
        notes: [
          "- **Cette route est restreinte aux utilisateurs ayant les droits d'accès**\n" +
            '- Création d‘un nouveau centre de certification\n',
        ],
        tags: ['api', 'certification-center'],
      },
    },
    {
      method: 'GET',
      path: '/api/certification-centers',
      config: {
        handler: certificationCenterController.findPaginatedFilteredCertificationCenters,
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
        notes: [
          "- **Cette route est restreinte aux utilisateurs ayant les droits d'accès**\n" +
            '- Liste des centres de certification\n',
        ],
        tags: ['api', 'certification-center'],
      },
    },
    {
      method: 'GET',
      path: '/api/certification-centers/{id}',
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
        validate: {
          params: Joi.object({
            id: identifiersType.certificationCenterId,
          }),
        },
        handler: certificationCenterController.getById,
        notes: [
          "- **Cette route est restreinte aux utilisateurs ayant les droits d'accès**\n" +
            "- Récupération d'un centre de certification\n",
        ],
        tags: ['api', 'certification-center'],
      },
    },
    {
      method: 'GET',
      path: '/api/certification-centers/{certificationCenterId}/sessions/{sessionId}/students',
      config: {
        validate: {
          params: Joi.object({
            certificationCenterId: identifiersType.certificationCenterId,
            sessionId: identifiersType.sessionId,
          }),
          query: Joi.object({
            'filter[divisions][]': [Joi.string(), Joi.array().items(Joi.string())],
            'page[number]': Joi.number().integer(),
            'page[size]': Joi.number().integer(),
          }),
        },
        handler: certificationCenterController.getStudents,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            "- Récupération d'une liste d'élèves SCO à partir d'un identifiant de centre de certification",
        ],
        tags: ['api', 'certification-center', 'students', 'session'],
      },
    },
    {
      method: 'GET',
      path: '/api/certification-centers/{certificationCenterId}/divisions',
      config: {
        validate: {
          params: Joi.object({
            certificationCenterId: identifiersType.certificationCenterId,
          }),
        },
        handler: certificationCenterController.getDivisions,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            "- Récupération d'une liste de classes à partir d'un identifiant de centre de certification",
        ],
        tags: ['api', 'certification-center', 'students', 'session'],
      },
    },
    {
      method: 'GET',
      path: '/api/certification-centers/{id}/session-summaries',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.certificationCenterId,
          }),
        },
        handler: certificationCenterController.findPaginatedSessionSummaries,
        tags: ['api', 'certification-center'],
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n',
          '- Elle retourne les sessions rattachées au centre de certification.',
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/certification-centers/{certificationCenterId}/certification-center-memberships',
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
        validate: {
          params: Joi.object({
            certificationCenterId: identifiersType.certificationCenterId,
          }),
        },
        handler: certificationCenterController.findCertificationCenterMembershipsByCertificationCenter,
        notes: [
          "- **Cette route est restreinte aux utilisateurs ayant les droits d'accès**\n" +
            "- Récupération de tous les membres d'un centre de certification.\n",
        ],
        tags: ['api', 'admin', 'certification-center-membership'],
      },
    },
    {
      method: 'GET',
      path: '/api/certification-centers/{certificationCenterId}/members',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkUserIsMemberOfCertificationCenter,
            assign: 'isMemberOfCertificationCenter',
          },
        ],
        validate: {
          params: Joi.object({
            certificationCenterId: identifiersType.certificationCenterId,
          }),
        },
        handler: certificationCenterController.findCertificationCenterMemberships,
        notes: [
          '- **Cette route est restreinte aux utilisateurs appartenant à un centre de certification**\n' +
            "- Récupération de tous les membres d'un centre de certification.\n",
        ],
        tags: ['api', 'certification-center', 'members'],
      },
    },
    {
      method: 'POST',
      path: '/api/certification-centers/{certificationCenterId}/certification-center-memberships',
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
        validate: {
          params: Joi.object({
            certificationCenterId: identifiersType.certificationCenterId,
          }),
          payload: Joi.object().required().keys({
            email: Joi.string().email().required(),
          }),
        },
        handler: certificationCenterController.createCertificationCenterMembershipByEmail,
        notes: [
          "- **Cette route est restreinte aux utilisateurs ayant les droits d'accès**\n" +
            "- Création d‘un nouveau membre d'un centre de certification,\n" +
            "à partir de l'adresse e-mail d'un utilisateur.",
        ],
        tags: ['api', 'certification-center-membership'],
      },
    },
  ]);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.name = 'certification-centers-api';
