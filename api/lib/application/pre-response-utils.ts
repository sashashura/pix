// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'errorManag... Remove this comment to see the full error message
const errorManager = require('./error-manager');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BaseHttpEr... Remove this comment to see the full error message
const { BaseHttpError, UnauthorizedError } = require('./http-errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainErro... Remove this comment to see the full error message
const { DomainError } = require('../domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'handleDoma... Remove this comment to see the full error message
function handleDomainAndHttpErrors(request: $TSFixMe, h: $TSFixMe) {
  const response = request.response;

  if (response instanceof DomainError || response instanceof BaseHttpError) {
    return errorManager.handle(request, h, response);
  }

  // Ne devrait pas etre necessaire
  if (response.isBoom && response.output.statusCode === 401) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    return errorManager.handle(request, h, new UnauthorizedError(undefined, 401));
  }

  return h.continue;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  handleDomainAndHttpErrors,
};
