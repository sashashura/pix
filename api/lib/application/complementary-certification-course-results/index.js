const Joi = require('joi');
const Badge = require('../../domain/models/Badge');
const identifiersType = require('../../domain/types/identifiers-type');
const securityPreHandlers = require('../security-pre-handlers');
const complementaryCertificationCourseResultsController = require('./complementary-certification-course-results-controller');

exports.register = async function (server) {
  server.route([
    {
      method: 'POST',
      path: '/api/admin/complementary-certification-course-results',
      config: {
        validate: {
          payload: Joi.object({
            data: {
              attributes: {
                juryLevel: Joi.string()
                  .valid(
                    Badge.keys.PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
                    Badge.keys.PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
                    Badge.keys.PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
                    Badge.keys.PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
                    Badge.keys.PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
                    Badge.keys.PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
                    Badge.keys.PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
                    Badge.keys.PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
                    Badge.keys.PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
                    Badge.keys.PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
                    'REJECTED'
                  )
                  .required(),
                complementaryCertificationCourseId: identifiersType.complementaryCertificationCourseId,
              },
            },
          }),
        },
        pre: [
          {
            method: (request, h) =>
              securityPreHandlers.adminMemberHasAtLeastOneAccessOf([
                securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
                securityPreHandlers.checkAdminMemberHasRoleCertif,
                securityPreHandlers.checkAdminMemberHasRoleSupport,
              ])(request, h),
            assign: 'hasAuthorizationToAccessAdminScope',
          },
        ],
        handler: complementaryCertificationCourseResultsController.saveJuryComplementaryCertificationCourseResult,
        notes: [
          "- **Cette route est restreinte aux utilisateurs ayant les droits d'accès**\n",
          "- Elle permet de sauvegarder le volet jury d'une certification complémentaire Pix+ Edu",
        ],
        tags: ['api', 'admin', 'complementary-certification-course-results', 'Pix+ Édu'],
      },
    },
  ]);
};

exports.name = 'complementary-certification-course-results-api';
