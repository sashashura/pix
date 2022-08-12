// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'JSONAPIErr... Remove this comment to see the full error message
const JSONAPIError = require('jsonapi-serializer').Error;

function _formatAttribute({
  attribute,
  message
}: $TSFixMe) {
  return {
    status: '422',
    source: {
      pointer: `/data/attributes/${_.kebabCase(attribute)}`,
    },
    title: `Invalid data attribute "${attribute}"`,
    detail: message,
  };
}

function _formatRelationship({
  attribute,
  message
}: $TSFixMe) {
  const relationship = attribute.replace('Id', '');
  return {
    status: '422',
    source: {
      pointer: `/data/relationships/${_.kebabCase(relationship)}`,
    },
    title: `Invalid relationship "${relationship}"`,
    detail: message,
  };
}

function _formatUndefinedAttribute({
  message
}: $TSFixMe) {
  return {
    status: '422',
    title: 'Invalid data attributes',
    detail: message,
  };
}

function _formatInvalidAttribute({
  attribute,
  message
}: $TSFixMe) {
  if (!attribute) {
    return _formatUndefinedAttribute({ message });
  }
  if (attribute.endsWith('Id')) {
    return _formatRelationship({ attribute, message });
  }
  return _formatAttribute({ attribute, message });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = (invalidAttributes: $TSFixMe) => {
  return new JSONAPIError(invalidAttributes.map(_formatInvalidAttribute));
};
