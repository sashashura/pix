// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('./token-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../config');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  generateResultsLink(sessionId: $TSFixMe) {
    const daysBeforeExpiration = 30;

    const token = tokenService.createCertificationResultsLinkToken({ sessionId, daysBeforeExpiration });
    const link = `${settings.domain.pixApp + settings.domain.tldOrg}/api/sessions/download-all-results/${token}`;

    return link;
  },
};
