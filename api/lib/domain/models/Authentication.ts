// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
class Authentication {
  token: $TSFixMe;
  userId: $TSFixMe;
  constructor({
    token,
    userId
  }: $TSFixMe = {}) {
    this.token = token;
    this.userId = userId;
  }

  toJSON() {
    return {
      user_id: this.userId,
      token: this.token,
    };
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Authentication;
