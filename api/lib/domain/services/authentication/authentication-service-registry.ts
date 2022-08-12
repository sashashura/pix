// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../models/AuthenticationMethod');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PoleEmploi... Remove this comment to see the full error message
const PoleEmploiOidcAuthenticationService = require('./pole-emploi-oidc-authentication-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CnavOidcAu... Remove this comment to see the full error message
const CnavOidcAuthenticationService = require('./cnav-oidc-authentication-service');

const poleEmploiOidcAuthenticationService = new PoleEmploiOidcAuthenticationService();
const cnavOidcAuthenticationService = new CnavOidcAuthenticationService();

function lookupAuthenticationService(identityProvider: $TSFixMe) {
  switch (identityProvider) {
    case AuthenticationMethod.identityProviders.POLE_EMPLOI:
      return poleEmploiOidcAuthenticationService;
    case AuthenticationMethod.identityProviders.CNAV:
      return cnavOidcAuthenticationService;
    default:
      throw new Error(`Identity provider ${identityProvider} is not supported`);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  lookupAuthenticationService,
};
