// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const accept = require('@hapi/accept');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('../../domain/services/token-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ENGLISH_SP... Remove this comment to see the full error message
const { ENGLISH_SPOKEN, FRENCH_FRANCE, FRENCH_SPOKEN } = require('../../domain/constants').LOCALE;

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = { escapeFileName, extractUserIdFromRequest, extractLocaleFromRequest };

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'escapeFile... Remove this comment to see the full error message
function escapeFileName(fileName: $TSFixMe) {
  return fileName.replace(/[^_. A-Za-z0-9-]/g, '_');
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'extractUse... Remove this comment to see the full error message
function extractUserIdFromRequest(request: $TSFixMe) {
  if (request.headers && request.headers.authorization) {
    const token = tokenService.extractTokenFromAuthChain(request.headers.authorization);
    return tokenService.extractUserId(token);
  }
  return null;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'extractLoc... Remove this comment to see the full error message
function extractLocaleFromRequest(request: $TSFixMe) {
  const defaultLocale = FRENCH_FRANCE;
  const languageHeader = request.headers && request.headers['accept-language'];
  if (!languageHeader) {
    return defaultLocale;
  }
  const acceptedLanguages = [ENGLISH_SPOKEN, FRENCH_SPOKEN, FRENCH_FRANCE];
  return accept.language(languageHeader, acceptedLanguages) || defaultLocale;
}
