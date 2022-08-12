// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignCo... Remove this comment to see the full error message
const campaignController = require('./campaign-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignMa... Remove this comment to see the full error message
const campaignManagementController = require('./campaign-management-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignSt... Remove this comment to see the full error message
const campaignStatsController = require('./campaign-stats-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'identifier... Remove this comment to see the full error message
const identifiersType = require('../../domain/types/identifiers-type');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../domain/models/CampaignParticipationStatuses');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignPa... Remove this comment to see the full error message
const campaignParticipationStatuses = Object.values(CampaignParticipationStatuses);

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.register = async function (server: $TSFixMe) {
  server.route([
    {
      method: 'POST',
      path: '/api/campaigns',
      config: {
        handler: campaignController.save,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Création d‘une nouvelle campagne\n' +
            '- L‘utilisateur doit avoir les droits d‘accès à l‘organisation liée à la campagne à créer',
        ],
        tags: ['api', 'campaign'],
      },
    },
    {
      method: 'GET',
      path: '/api/campaigns',
      config: {
        auth: false,
        handler: campaignController.getByCode,
        notes: ['- Récupération de la campagne dont le code est spécifié dans les filtres de la requête'],
        tags: ['api', 'campaign'],
      },
    },
    {
      method: 'GET',
      path: '/api/campaigns/{id}',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.campaignId,
          }),
        },
        handler: campaignController.getById,
        notes: ["- Récupération d'une campagne par son id"],
        tags: ['api', 'campaign'],
      },
    },
    {
      method: 'GET',
      path: '/api/admin/campaigns/{id}',
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
            id: identifiersType.campaignId,
          }),
        },
        handler: campaignManagementController.getCampaignDetails,
        tags: ['api', 'campaign', 'admin'],
        notes: [
          "- **Cette route est restreinte aux utilisateurs authentifiés ayant les droits d'accès**\n" +
            "- Elle permet de récupérer le détail d'une campagne.",
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/admin/campaigns/{id}/participations',
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
            id: identifiersType.campaignId,
          }),
          query: Joi.object({
            'page[number]': Joi.number().integer().empty(''),
            'page[size]': Joi.number().integer().empty(''),
          }),
        },
        handler: campaignManagementController.findPaginatedParticipationsForCampaignManagement,
        tags: ['api', 'campaign', 'participations', 'admin'],
        notes: [
          "- **Cette route est restreinte aux utilisateurs authentifiés ayant les droits d'accès**\n" +
            "- Elle permet de récupérer les participations d'une campagne donnée.",
        ],
      },
    },
    {
      method: 'PATCH',
      path: '/api/admin/campaigns/{id}',
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
            id: identifiersType.campaignId,
          }),
          payload: Joi.object({
            data: {
              type: 'campaigns',
              attributes: {
                name: Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
                title: Joi.string().allow(null).required(),
                'custom-landing-page-text': Joi.string().allow(null).required(),
                'custom-result-page-text': Joi.string().allow(null).required(),
                'custom-result-page-button-text': Joi.string().allow(null).required(),
                'custom-result-page-button-url': Joi.string().allow(null).required(),
                'multiple-sendings': Joi.boolean().required(),
              },
            },
          }),
          options: {
            allowUnknown: true,
          },
        },
        handler: campaignManagementController.updateCampaignDetailsManagement,
        tags: ['api', 'campaign', 'admin'],
        notes: [
          "- **Cette route est restreinte aux utilisateurs authentifiés ayant les droits d'accès**\n" +
            "- Elle permet de modifier certaines informations d'une campagne.",
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/campaigns/{id}/csv-assessment-results',
      config: {
        auth: false,
        validate: {
          params: Joi.object({
            id: identifiersType.campaignId,
          }),
        },
        handler: campaignController.getCsvAssessmentResults,
        notes: [
          "- **Cette route est restreinte via un token dédié passé en paramètre avec l'id de l'utilisateur.**\n" +
            "- Récupération d'un CSV avec les résultats de la campagne d‘évaluation\n" +
            '- L‘utilisateur doit avoir les droits d‘accès à l‘organisation liée à la campagne à créer',
        ],
        tags: ['api', 'campaign'],
      },
    },
    {
      method: 'GET',
      path: '/api/campaigns/{id}/csv-profiles-collection-results',
      config: {
        auth: false,
        validate: {
          params: Joi.object({
            id: identifiersType.campaignId,
          }),
        },
        handler: campaignController.getCsvProfilesCollectionResults,
        notes: [
          "- **Cette route est restreinte via un token dédié passé en paramètre avec l'id de l'utilisateur.**\n" +
            "- Récupération d'un CSV avec les résultats de la campagne de collecte de profils\n" +
            '- L‘utilisateur doit avoir les droits d‘accès à l‘organisation liée à la campagne à créer',
        ],
        tags: ['api', 'campaign'],
      },
    },
    {
      method: 'PATCH',
      path: '/api/campaigns/{id}',
      config: {
        pre: [{ method: securityPreHandlers.checkAuthorizationToManageCampaign }],
        validate: {
          params: Joi.object({
            id: identifiersType.campaignId,
          }),
          payload: Joi.object({
            data: {
              type: 'campaigns',
              attributes: {
                'owner-id': identifiersType.ownerId,
                name: Joi.string().required(),
                title: Joi.string().allow(null).required(),
                'custom-landing-page-text': Joi.string().allow(null).required(),
              },
            },
          }),
          options: {
            allowUnknown: true,
          },
        },
        handler: campaignController.update,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            "- Modification d'une campagne\n" +
            '- L‘utilisateur doit avoir les droits d‘accès à l‘organisation liée à la campagne à modifier',
        ],
        tags: ['api', 'campaign'],
      },
    },
    {
      method: 'GET',
      path: '/api/campaigns/{id}/collective-results',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.campaignId,
          }),
        },
        handler: campaignController.getCollectiveResult,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Récupération des résultats collectifs de la campagne par son id',
        ],
        tags: ['api', 'campaign'],
      },
    },
    {
      method: 'GET',
      path: '/api/campaigns/{id}/analyses',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.campaignId,
          }),
        },
        handler: campaignController.getAnalysis,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            "- Récupération de l'analyse de la campagne par son id",
        ],
        tags: ['api', 'campaign'],
      },
    },
    {
      method: 'PUT',
      path: '/api/campaigns/{id}/archive',
      config: {
        pre: [{ method: securityPreHandlers.checkAuthorizationToManageCampaign }],
        validate: {
          params: Joi.object({
            id: identifiersType.campaignId,
          }),
        },
        handler: campaignController.archiveCampaign,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' + "- Archivage d'une campagne par son id",
        ],
      },
    },
    {
      method: 'DELETE',
      path: '/api/campaigns/{id}/archive',
      config: {
        pre: [{ method: securityPreHandlers.checkAuthorizationToManageCampaign }],
        validate: {
          params: Joi.object({
            id: identifiersType.campaignId,
          }),
        },
        handler: campaignController.unarchiveCampaign,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            "- Désarchivage d'une campagne par son id",
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/campaigns/{id}/profiles-collection-participations',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.campaignId,
          }),
          query: Joi.object({
            'filter[divisions][]': [Joi.string(), Joi.array().items(Joi.string())],
            'filter[groups][]': [Joi.string(), Joi.array().items(Joi.string())],
            'filter[search]': Joi.string().empty(''),
            'page[number]': Joi.number().integer().empty(''),
            'page[size]': Joi.number().integer().empty(''),
          }),
        },
        handler: campaignController.findProfilesCollectionParticipations,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            "- Récupération des profils collectés d'une campagne par son id",
        ],
        tags: ['api', 'campaign'],
      },
    },
    {
      method: 'GET',
      path: '/api/campaigns/{id}/participants-activity',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.campaignId,
          }),
          query: Joi.object({
            'page[number]': Joi.number().integer().empty(''),
            'page[size]': Joi.number().integer().empty(''),
            'filter[divisions][]': [Joi.string(), Joi.array().items(Joi.string())],
            'filter[status]': Joi.string()
              .valid(...campaignParticipationStatuses)
              .empty(''),
            'filter[groups][]': [Joi.string(), Joi.array().items(Joi.string())],
            'filter[search]': Joi.string().empty(''),
          }),
        },
        handler: campaignController.findParticipantsActivity,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            "- Récupération des participations d'une campagne par son id",
        ],
        tags: ['api', 'campaign'],
      },
    },
    {
      method: 'GET',
      path: '/api/campaigns/{id}/divisions',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.campaignId,
          }),
        },
        handler: campaignController.division,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Récupération des classes des participants à la campagne',
        ],
        tags: ['api', 'division'],
      },
    },
    {
      method: 'GET',
      path: '/api/campaigns/{id}/groups',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.campaignId,
          }),
        },
        handler: campaignController.getGroups,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Récupération des groupes des participants à la campagne',
        ],
        tags: ['api', 'group'],
      },
    },
    {
      method: 'GET',
      path: '/api/campaigns/{id}/stats/participations-by-stage',
      config: {
        validate: {
          params: Joi.object({ id: identifiersType.campaignId }),
        },
        handler: campaignStatsController.getParticipationsByStage,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Récupération des statistiques de participations par paliers',
        ],
        tags: ['api', 'campaign', 'stats'],
      },
    },
    {
      method: 'GET',
      path: '/api/campaigns/{id}/stats/participations-by-status',
      config: {
        validate: {
          params: Joi.object({ id: identifiersType.campaignId }),
        },
        handler: campaignStatsController.getParticipationsByStatus,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Récupération des répartitions des participations par statut',
        ],
        tags: ['api', 'campaign', 'stats'],
      },
    },
    {
      method: 'GET',
      path: '/api/campaigns/{id}/stats/participations-by-day',
      config: {
        validate: {
          params: Joi.object({ id: identifiersType.campaignId }),
        },
        handler: campaignStatsController.getParticipationsByDay,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Récupération des répartitions des participations par jour',
        ],
        tags: ['api', 'campaign', 'stats'],
      },
    },
    {
      method: 'GET',
      path: '/api/campaigns/{id}/stats/participations-by-mastery-rate',
      config: {
        validate: {
          params: Joi.object({ id: identifiersType.campaignId }),
        },
        handler: campaignStatsController.getParticipationsCountByMasteryRate,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Récupération de la répartition du pourcentage de réussite',
        ],
        tags: ['api', 'campaign', 'stats'],
      },
    },
  ]);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.name = 'campaigns-api';
