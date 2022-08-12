// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AccountRec... Remove this comment to see the full error message
const AccountRecoveryDemand = require('../../../../lib/domain/models/AccountRecoveryDemand');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildAccountRecoveryDemand({
  userId = 7,
  organizationLearnerId,
  newEmail = 'new-email@example.net',
  oldEmail = 'old-email@example.net',
  used = false,
  temporaryKey = '1234567890AZERTY'
}: $TSFixMe = {}) {
  return new AccountRecoveryDemand({
    userId,
    organizationLearnerId,
    newEmail,
    oldEmail,
    used,
    temporaryKey,
  });
};
