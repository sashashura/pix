// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'statuses'.
const { statuses } = require('../models/Session');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'types'.
const { types } = require('../models/CertificationCenter');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'identifier... Remove this comment to see the full error message
const identifiersType = require('../../domain/types/identifiers-type');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'validation... Remove this comment to see the full error message
const validationConfiguration = { abortEarly: false, allowUnknown: true };

const sessionValidationJoiSchema = Joi.object({
  address: Joi.string().required().messages({
    'string.base': 'Veuillez indiquer un nom de site.',
    'string.empty': 'Veuillez indiquer un nom de site.',
  }),

  room: Joi.string().required().messages({
    'string.base': 'Veuillez indiquer un nom de salle.',
    'string.empty': 'Veuillez indiquer un nom de salle.',
  }),

  date: Joi.string().isoDate().required().messages({
    'string.empty': 'Veuillez indiquer une date de début.',
  }),

  time: Joi.string()
    .pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      'string.base': 'Veuillez indiquer une heure de début.',
      'string.empty': 'Veuillez indiquer une heure de début.',
      'string.pattern.base': 'Veuillez indiquer une heure de début.',
    }),

  examiner: Joi.string().required().messages({
    'string.base': 'Veuillez indiquer un(e) surveillant(e).',
    'string.empty': 'Veuillez indiquer un(e) surveillant(e).',
  }),
});

const sessionFiltersValidationSchema = Joi.object({
    id: identifiersType.sessionId.optional(),
    status: Joi.string()
        .trim()
        .valid((statuses as $TSFixMe).CREATED, (statuses as $TSFixMe).FINALIZED, (statuses as $TSFixMe).IN_PROCESS, (statuses as $TSFixMe).PROCESSED)
        .optional(),
    resultsSentToPrescriberAt: Joi.boolean().optional(),
    certificationCenterName: Joi.string().trim().optional(),
    certificationCenterExternalId: Joi.string().trim().optional(),
    certificationCenterType: Joi.string().trim().valid(types.SUP, types.SCO, types.PRO).optional(),
});

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  validate(session: $TSFixMe) {
    const { error } = sessionValidationJoiSchema.validate(session, validationConfiguration);
    if (error) {
      throw EntityValidationError.fromJoiErrors(error.details);
    }
  },

  validateAndNormalizeFilters(filters: $TSFixMe) {
    const { value, error } = sessionFiltersValidationSchema.validate(filters, { abortEarly: true });

    if (error) {
      throw EntityValidationError.fromJoiErrors(error.details);
    }

    return value;
  },
};
