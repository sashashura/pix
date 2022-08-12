// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AccountRec... Remove this comment to see the full error message
class AccountRecoveryDemand {
  createdAt: $TSFixMe;
  id: $TSFixMe;
  newEmail: $TSFixMe;
  oldEmail: $TSFixMe;
  organizationLearnerId: $TSFixMe;
  temporaryKey: $TSFixMe;
  used: $TSFixMe;
  userId: $TSFixMe;
  constructor({
    id,
    userId,
    organizationLearnerId,
    oldEmail,
    newEmail,
    temporaryKey,
    used,
    createdAt
  }: $TSFixMe = {}) {
    this.id = id;
    this.organizationLearnerId = organizationLearnerId;
    this.userId = userId;
    this.oldEmail = oldEmail;
    this.newEmail = newEmail.toLowerCase();
    this.temporaryKey = temporaryKey;
    this.used = used;
    this.createdAt = createdAt;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = AccountRecoveryDemand;
