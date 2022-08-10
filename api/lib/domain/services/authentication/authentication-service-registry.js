const AuthenticationMethod = require('../../models/AuthenticationMethod');
const PoleEmploiOidcAuthenticationService = require('./pole-emploi-oidc-authentication-service');
const CnavOidcAuthenticationService = require('./cnav-oidc-authentication-service');
const FwbOidcAuthenticationService = require('./fwb-oidc-authentication-service');

const poleEmploiOidcAuthenticationService = new PoleEmploiOidcAuthenticationService();
const cnavOidcAuthenticationService = new CnavOidcAuthenticationService();
const fwbOidcAuthenticationService = new FwbOidcAuthenticationService();

function lookupAuthenticationService(identityProvider) {
  switch (identityProvider) {
    case AuthenticationMethod.identityProviders.POLE_EMPLOI:
      return poleEmploiOidcAuthenticationService;
    case AuthenticationMethod.identityProviders.CNAV:
      return cnavOidcAuthenticationService;
    case AuthenticationMethod.identityProviders.FWB:
      return fwbOidcAuthenticationService;
    default:
      throw new Error(`Identity provider ${identityProvider} is not supported`);
  }
}

module.exports = {
  lookupAuthenticationService,
};
