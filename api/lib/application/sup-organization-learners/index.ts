// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi').extend(require('@joi/date'));

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sendJsonAp... Remove this comment to see the full error message
const { sendJsonApiError, UnprocessableEntityError, NotFoundError } = require('../http-errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'supOrganiz... Remove this comment to see the full error message
const supOrganizationLearnerController = require('./sup-organization-learner-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'identifier... Remove this comment to see the full error message
const identifiersType = require('../../domain/types/identifiers-type');

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.register = async function (server: $TSFixMe) {
  server.route([
    {
      method: 'POST',
      path: '/api/schooling-registration-user-associations/student',
      config: {
        handler: supOrganizationLearnerController.reconcileSupOrganizationLearner,
        validate: {
          options: {
            allowUnknown: false,
          },
          payload: Joi.object({
            data: {
              attributes: {
                'student-number': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
                'first-name': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
                'last-name': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
                birthdate: Joi.date().format('YYYY-MM-DD').required(),
                'campaign-code': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
              },
              type: 'schooling-registration-user-associations',
            },
          }),
          failAction: (request: $TSFixMe, h: $TSFixMe) => {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
            return sendJsonApiError(new UnprocessableEntityError('Un des champs saisis n’est pas valide.'), h);
          },
        },
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Elle réconcilie l’utilisateur à l’inscription d’un étudiant dans cette organisation',
          "- L'usage de cette route est **dépréciée** en faveur de /api/sup-organization-learners/association",
        ],
        tags: ['api', 'organizationLearnerUserAssociation'],
      },
    },
    {
      method: 'POST',
      path: '/api/sup-organization-learners/association',
      config: {
        handler: supOrganizationLearnerController.reconcileSupOrganizationLearner,
        validate: {
          options: {
            allowUnknown: false,
          },
          payload: Joi.object({
            data: {
              attributes: {
                'student-number': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
                'first-name': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
                'last-name': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
                birthdate: Joi.date().format('YYYY-MM-DD').required(),
                'campaign-code': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
              },
              type: 'sup-organization-learners',
            },
          }),
          failAction: (request: $TSFixMe, h: $TSFixMe) => {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
            return sendJsonApiError(new UnprocessableEntityError('Un des champs saisis n’est pas valide.'), h);
          },
        },
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Elle réconcilie l’utilisateur à l’inscription d’un étudiant dans cette organisation',
        ],
        tags: ['api', 'sup-organization-learner'],
      },
    },
    {
      method: 'PATCH',
      path: '/api/organizations/{id}/schooling-registration-user-associations/{schoolingRegistrationId}',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkUserIsAdminInSUPOrganizationManagingStudents,
          },
        ],
        handler: supOrganizationLearnerController.updateStudentNumber,
        validate: {
          options: {
            allowUnknown: true,
          },
          params: Joi.object({
            id: identifiersType.organizationId,
            schoolingRegistrationId: identifiersType.schoolingRegistrationId,
          }),
          payload: Joi.object({
            data: {
              attributes: {
                'student-number': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
              },
            },
          }),
          failAction: (request: $TSFixMe, h: $TSFixMe, err: $TSFixMe) => {
            const isStudentNumber = err.details[0].path.includes('student-number');
            if (isStudentNumber) {
              // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
              return sendJsonApiError(new UnprocessableEntityError('Un des champs saisis n’est pas valide.'), h);
            }
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
            return sendJsonApiError(new NotFoundError('Ressource non trouvée'), h);
          },
        },
        notes: [
          "- **Cette route est restreinte aux utilisateurs authentifiés et admin au sein de l'orga**\n" +
            '- Elle met à jour le numéro étudiant',
          "- L'usage de cette route est **dépréciée** en faveur de /api/organizations/{id}/sup-organization-learners/{organizationLearnerId}",
        ],
        tags: ['api', 'organizationLearnerUserAssociation'],
      },
    },
    {
      method: 'PATCH',
      path: '/api/organizations/{id}/sup-organization-learners/{organizationLearnerId}',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkUserIsAdminInSUPOrganizationManagingStudents,
          },
        ],
        handler: supOrganizationLearnerController.updateStudentNumber,
        validate: {
          options: {
            allowUnknown: true,
          },
          params: Joi.object({
            id: identifiersType.organizationId,
            organizationLearnerId: identifiersType.organizationLearnerId,
          }),
          payload: Joi.object({
            data: {
              attributes: {
                'student-number': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
              },
            },
          }),
          failAction: (request: $TSFixMe, h: $TSFixMe, err: $TSFixMe) => {
            const isStudentNumber = err.details[0].path.includes('student-number');
            if (isStudentNumber) {
              // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
              return sendJsonApiError(new UnprocessableEntityError('Un des champs saisis n’est pas valide.'), h);
            }
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
            return sendJsonApiError(new NotFoundError('Ressource non trouvée'), h);
          },
        },
        notes: [
          "- **Cette route est restreinte aux utilisateurs authentifiés et admin au sein de l'orga**\n" +
            '- Elle met à jour le numéro étudiant',
        ],
        tags: ['api', 'sup-organization-learners'],
      },
    },
  ]);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.name = 'sup-organization-learners-api';
