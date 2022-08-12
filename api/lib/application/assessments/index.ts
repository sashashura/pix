// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentController = require('./assessment-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentAuthorization = require('../preHandlers/assessment-authorization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'identifier... Remove this comment to see the full error message
const identifiersType = require('../../domain/types/identifiers-type');

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.register = async (server: $TSFixMe) => {
  server.route([
    {
      method: 'POST',
      path: '/api/assessments',
      config: {
        auth: false,
        handler: assessmentController.save,
        tags: ['api'],
      },
    },
    {
      method: 'GET',
      path: '/api/assessments/{id}/next',
      config: {
        auth: false,
        validate: {
          params: Joi.object({
            id: identifiersType.assessmentId,
          }),
        },
        handler: assessmentController.getNextChallenge,
        notes: ["- Récupération de la question suivante pour l'évaluation donnée"],
        tags: ['api'],
      },
    },
    {
      method: 'GET',
      path: '/api/assessments/{id}',
      config: {
        auth: false,
        validate: {
          params: Joi.object({
            id: identifiersType.assessmentId,
          }),
        },
        pre: [
          {
            method: assessmentAuthorization.verify,
            assign: 'authorizationCheck',
          },
        ],
        handler: assessmentController.get,
        tags: ['api'],
      },
    },
    {
      method: 'GET',
      path: '/api/assessments/{id}/last-challenge-id',
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
            id: identifiersType.assessmentId,
          }),
        },
        handler: assessmentController.getLastChallengeId,
        tags: ['api'],
      },
    },
    {
      method: 'GET',
      path: '/api/assessments/{id}/challenge-for-pix-auto-answer',
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
            id: identifiersType.assessmentId,
          }),
        },
        handler: assessmentController.getChallengeForPixAutoAnswer,
        tags: ['api'],
      },
    },
    {
      method: 'PATCH',
      path: '/api/assessments/{id}/complete-assessment',
      config: {
        auth: false,
        pre: [
          {
            method: assessmentAuthorization.verify,
            assign: 'authorizationCheck',
          },
        ],
        validate: {
          params: Joi.object({
            id: identifiersType.assessmentId,
          }),
        },
        handler: assessmentController.completeAssessment,
        tags: ['api'],
      },
    },
    {
      method: 'GET',
      path: '/api/assessments/{id}/competence-evaluations',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.assessmentId,
          }),
        },
        handler: assessmentController.findCompetenceEvaluations,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            "- Récupération des competence-evaluations d'un assessment",
        ],
        tags: ['api', 'competence-evaluations'],
      },
    },
    {
      method: 'PATCH',
      path: '/api/assessments/{id}/last-challenge-state/{state}',
      config: {
        auth: false,
        pre: [
          {
            method: assessmentAuthorization.verify,
            assign: 'authorizationCheck',
          },
        ],
        validate: {
          params: Joi.object({
            id: identifiersType.assessmentId,
            state: Joi.string().valid('asked', 'timeout', 'focusedout'),
          }),
          payload: Joi.object({
            data: Joi.object({
              attributes: Joi.object({
                'challenge-id': Joi.string().allow(null),
              }),
            }),
          }),
          options: {
            allowUnknown: true,
          },
        },
        handler: assessmentController.updateLastChallengeState,
        notes: [
          '- Sauvegarde la dernière question posée, ainsi que son état\n' +
            "- L'état doit être indiqué en paramètre, et la question optionnellement dans le payload.",
        ],
        tags: ['api', 'assessments'],
      },
    },
  ]);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.name = 'assessments-api';
