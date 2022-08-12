// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'validation... Remove this comment to see the full error message
const validationConfiguration = { abortEarly: false, allowUnknown: true };

const userValidationJoiSchema = Joi.object({
  firstName: Joi.string().required().max(255).messages({
    'string.empty': 'EMPTY_FIRST_NAME',
    'string.max': 'MAX_SIZE_FIRST_NAME',
  }),

  lastName: Joi.string().required().max(255).messages({
    'string.empty': 'EMPTY_LAST_NAME',
    'string.max': 'MAX_SIZE_LAST_NAME',
  }),

  email: Joi.string().max(255).email({ ignoreLength: true }).messages({
    'string.empty': 'EMPTY_EMAIL',
    'string.max': 'MAX_SIZE_EMAIL',
    'string.email': 'WRONG_EMAIL_FORMAT',
  }),

  username: Joi.string().messages({
    'string.empty': 'EMPTY_USERNAME',
  }),

  cgu: Joi.boolean()
    .when('$cguRequired', {
      is: Joi.boolean().required().valid(true),
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .valid(true)
    .messages({
      'boolean.base': 'ACCEPT_CGU',
      'any.only': 'ACCEPT_CGU',
    }),

  mustValidateTermsOfService: Joi.boolean(),

  hasSeenAssessmentInstructions: Joi.boolean(),
})
  .xor('username', 'email')
  .required()
  .messages({
    'any.required': 'EMPTY_INPUT',
    'object.missing': 'FILL_USERNAME_OR_EMAIL',
  });

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  validate({
    user,
    cguRequired = true
  }: $TSFixMe) {
    const { error } = userValidationJoiSchema.validate(user, { ...validationConfiguration, context: { cguRequired } });
    if (error) {
      throw EntityValidationError.fromJoiErrors(error.details);
    }
    return true;
  },
};
