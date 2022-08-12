// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'get'.
const get = require('lodash/get');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BadRequest... Remove this comment to see the full error message
const { BadRequestError, sendJsonApiError } = require('./application/http-errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'handleFail... Remove this comment to see the full error message
function handleFailAction(request: $TSFixMe, h: $TSFixMe, err: $TSFixMe) {
  const message = get(err, 'details[0].message', '');
  return sendJsonApiError(new BadRequestError(message), h);
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  handleFailAction,
};
