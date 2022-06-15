const Joi = require('joi');
const HttpErrors = require('../http-errors');
const identifiersType = require('../../domain/types/identifiers-type');

const payloadSchema = Joi.object({
  params: {
    id: identifiersType.campaignId,
  },
  payload: {
    data: {
      attributes: {
        name: Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
        title: Joi.string().allow(null).required(),
        'custom-landing-page-text': Joi.string().max(5000).allow(null).required(),
        'custom-result-page-text': Joi.string().allow(null).required(),
        'custom-result-page-button-text': Joi.string().allow(null).required(),
        'custom-result-page-button-url': Joi.string().allow(null).required(),
        'multiple-sendings': Joi.boolean().required(),
      },
    },
  },
});

function validate(request) {
  const { error } = payloadSchema.validate(request, { allowUnknown: true });
  if (error) {
    throw new HttpErrors.BadRequestError();
  }
  return true;
}

module.exports = { validate };
