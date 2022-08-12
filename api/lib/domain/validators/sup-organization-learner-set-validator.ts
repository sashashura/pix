// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi').extend(require('@joi/date'));
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'validation... Remove this comment to see the full error message
const validationConfiguration = { allowUnknown: true };

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'validation... Remove this comment to see the full error message
const validationSchema = Joi.array().unique('studentNumber');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  checkValidation(organizationLearnerSet: $TSFixMe) {
    const { error } = validationSchema.validate(organizationLearnerSet.learners, validationConfiguration);

    if (error) {
      const err = EntityValidationError.fromJoiErrors(error.details);
      err.key = 'studentNumber';
      err.why = 'uniqueness';
      throw err;
    }
  },
};
