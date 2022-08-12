// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../../config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'OidcAuthen... Remove this comment to see the full error message
const OidcAuthenticationService = require('./oidc-authentication-service');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CnavOidcAu... Remove this comment to see the full error message
class CnavOidcAuthenticationService extends OidcAuthenticationService {
  constructor() {
    const source = 'cnav';
    const identityProvider = 'CNAV';
    const expirationDelaySeconds = settings.cnav.accessTokenLifespanMs / 1000;
    const jwtOptions = { expiresIn: expirationDelaySeconds };
    const clientSecret = settings.cnav.clientSecret;
    const clientId = settings.cnav.clientId;
    const tokenUrl = settings.cnav.tokenUrl;
    const authenticationUrl = settings.cnav.authenticationUrl;
    const authenticationUrlParameters = [{ key: 'scope', value: 'openid profile' }];
    const userInfoUrl = settings.cnav.userInfoUrl;

    super({
      source,
      identityProvider,
      jwtOptions,
      clientSecret,
      clientId,
      tokenUrl,
      authenticationUrl,
      authenticationUrlParameters,
      userInfoUrl,
    });
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CnavOidcAuthenticationService;
