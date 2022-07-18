const AuthenticationMethod = require('../../models/AuthenticationMethod');
const poleEmploiAuthenticationService = require('./pole-emploi-authentication-service');
const cnavAuthenticationService = require('./cnav-authentication-service');
const fwbAuthenticationService = require('./fwb-authentication-service');

function lookupAuthenticationService(identityProvider) {
  switch (identityProvider) {
    case AuthenticationMethod.identityProviders.POLE_EMPLOI:
      return poleEmploiAuthenticationService;
    case AuthenticationMethod.identityProviders.CNAV:
      return cnavAuthenticationService;
    case AuthenticationMethod.identityProviders.FWB:
      return fwbAuthenticationService;
    default:
      throw new Error();
  }
}

module.exports = {
  lookupAuthenticationService,
};
