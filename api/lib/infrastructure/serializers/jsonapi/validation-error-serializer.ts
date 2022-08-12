// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

function _buildError(field: $TSFixMe, message: $TSFixMe) {
  return {
    status: '400',
    title: 'Invalid Attribute',
    detail: message,
    source: { pointer: '/data/attributes/' + _.kebabCase(field) },
    meta: { field },
  };
}

function _buildEntirePayloadError(message: $TSFixMe) {
  return {
    status: '400',
    title: 'Invalid Payload',
    detail: message,
    source: { pointer: '/data/attributes' },
  };
}

function serialize(validationErrors: $TSFixMe) {
  const errors: $TSFixMe = [];

  Object.keys(validationErrors.data).forEach(function (field) {
    validationErrors.data[field].forEach((message: $TSFixMe) => {
      if (_.isEmpty(field)) {
        errors.push(_buildEntirePayloadError(message));
      } else {
        errors.push(_buildError(field, message));
      }
    });
  });

  return {
    errors,
  };
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = { serialize };
