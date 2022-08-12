// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EmailModif... Remove this comment to see the full error message
class EmailModificationDemand {
  code: $TSFixMe;
  newEmail: $TSFixMe;
  constructor({
    code,
    newEmail
  }: $TSFixMe = {}) {
    this.code = code;
    this.newEmail = newEmail;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = EmailModificationDemand;
