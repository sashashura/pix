// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
class AuthenticationSessionContent {
  accessToken: $TSFixMe;
  expiresIn: $TSFixMe;
  idToken: $TSFixMe;
  refreshToken: $TSFixMe;
  constructor({
    accessToken,
    idToken,
    expiresIn,
    refreshToken
  }: $TSFixMe) {
    this.accessToken = accessToken;
    this.idToken = idToken;
    this.expiresIn = expiresIn;
    this.refreshToken = refreshToken;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = AuthenticationSessionContent;
