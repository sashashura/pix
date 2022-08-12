// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ObjectVali... Remove this comment to see the full error message
const { ObjectValidationError } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  validateEntity(schema: $TSFixMe, entity: $TSFixMe) {
    const { error } = schema.validate(entity);
    if (error) {
      throw new ObjectValidationError(error);
    }
  },
};
