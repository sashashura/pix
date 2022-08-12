// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EXPIRATION... Remove this comment to see the full error message
const EXPIRATION_DELAY_SECONDS = settings.temporaryStorage.expirationDelaySeconds;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EmailModif... Remove this comment to see the full error message
const EmailModificationDemand = require('../../domain/models/EmailModificationDemand');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'temporaryS... Remove this comment to see the full error message
const temporaryStorage = require('../temporary-storage').withPrefix('verify-email:');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  saveEmailModificationDemand({
    userId,
    code,
    newEmail
  }: $TSFixMe) {
    const key = userId;

    return temporaryStorage.save({
      key,
      value: { code, newEmail },
      expirationDelaySeconds: EXPIRATION_DELAY_SECONDS,
    });
  },

  async getEmailModificationDemandByUserId(userId: $TSFixMe) {
    const key = userId;
    const emailModificationDemand = await temporaryStorage.get(key);

    if (!emailModificationDemand) return;

    return new EmailModificationDemand({
      newEmail: emailModificationDemand.newEmail,
      code: emailModificationDemand.code,
    });
  },
};
