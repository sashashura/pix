const settings = require('../../../config');
const OidcAuthenticationService = require('./oidc-authentication-service');

class FwbOidcAuthenticationService extends OidcAuthenticationService {
  constructor() {
    const source = 'fwb';
    const identityProvider = 'FWB';
    const expirationDelaySeconds = settings.fwb.accessTokenLifespanMs / 1000;
    const jwtOptions = { expiresIn: expirationDelaySeconds };
    const clientSecret = settings.fwb.clientSecret;
    const clientId = settings.fwb.clientId;
    const tokenUrl = settings.fwb.tokenUrl;
    const authenticationUrl = settings.fwb.authenticationUrl;
    const authenticationUrlParameters = [{ key: 'scope', value: 'openid profile' }];
    const userInfoUrl = settings.fwb.userInfoUrl;

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

module.exports = FwbOidcAuthenticationService;
