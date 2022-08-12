// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi').extend(require('@joi/date'));
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'categories... Remove this comment to see the full error message
const categories = require('../constants/organization-places-categories');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'schema'.
const schema = Joi.object({
  organizationId: Joi.number().integer().required().messages({
    'any.required': `L'organisationId est obligatoire.`,
    'number.base': `L'identifiant de l'organisation doit être un nombre.`,
  }),
  count: Joi.number().integer().positive().allow(null).messages({
    'number.base': `Le nombre de places doit être un nombre sans virgule supérieur à 0.`,
    'number.positive': `Le nombre de places doit être un nombre sans virgule supérieur à 0.`,
    'number.integer': `Le nombre de places doit être un nombre sans virgule supérieur à 0.`,
  }),
  activationDate: Joi.date().format('YYYY-MM-DD').required().messages({
    'any.required': `La date d'activation est obligatoire.`,
    'date.format': `Le format de La date n'est pas correct.`,
  }),
  expirationDate: Joi.date().format('YYYY-MM-DD').greater(Joi.ref('activationDate')).allow(null).messages({
    'date.greater': `La date d'expiration doit être supérieur à la date d'activation.`,
    'date.format': `Le format de La date n'est pas correct.`,
    'any.ref': `La date d'expiration doit être supérieur à la date d'activation.`,
  }),
  reference: Joi.string().trim().required().messages({
    'any.required': `La référence est obligatoire.`,
    'string.empty': `La référence est obligatoire.`,
    'string.base': `La référence est obligatoire.`,
  }),
  category: Joi.string()
    .valid(categories.T0, categories.T1, categories.T2, categories.T2bis, categories.T3)
    .required()
    .messages({
      'any.required': `La catégorie est obligatoire.`,
    }),
  createdBy: Joi.number().integer().required().messages({
    'any.required': `Le créateur est obligatoire.`,
  }),
});

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'validate'.
function validate(organizationPlaces: $TSFixMe) {
  const { error } = schema.validate(organizationPlaces, { abortEarly: false });
  if (error) {
    throw EntityValidationError.fromJoiErrors(error.details);
  }
  return true;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = validate;
