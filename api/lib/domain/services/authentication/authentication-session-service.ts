// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../../config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'temporaryS... Remove this comment to see the full error message
const temporaryStorage = require('../../../infrastructure/temporary-storage').withPrefix('authentication-session:');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EXPIRATION... Remove this comment to see the full error message
const EXPIRATION_DELAY_SECONDS = settings.authenticationSession.temporaryStorage.expirationDelaySeconds;

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  getByKey(key: $TSFixMe) {
    return temporaryStorage.get(key);
  },

  save(authenticationContent: $TSFixMe) {
    return temporaryStorage.save({
      value: authenticationContent,
      expirationDelaySeconds: EXPIRATION_DELAY_SECONDS,
    });
  },
};
