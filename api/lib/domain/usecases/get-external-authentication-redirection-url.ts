// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../models/AuthenticationMethod');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getExternalAuthenticationRedirectionUrl({
  userAttributes,
  userRepository,
  authenticationMethodRepository,
  tokenService,
  settings
}: $TSFixMe) {
  const { attributeMapping } = settings.saml;
  const externalUser = {
    firstName: userAttributes[attributeMapping.firstName],
    lastName: userAttributes[attributeMapping.lastName],
    samlId: userAttributes[attributeMapping.samlId],
  };

  const user = await userRepository.getBySamlId(externalUser.samlId);

  if (user) {
    return await _getUrlWithAccessToken({
      user,
      externalUser,
      tokenService,
      userRepository,
      authenticationMethodRepository,
    });
  }

  return _getUrlForReconciliationPage({ tokenService, externalUser });
};

async function _getUrlWithAccessToken({
  user,
  externalUser,
  tokenService,
  userRepository,
  authenticationMethodRepository
}: $TSFixMe) {
  const token = tokenService.createAccessTokenForSaml(user.id);
  await userRepository.updateLastLoggedAt({ userId: user.id });
  await _saveUserFirstAndLastName({ authenticationMethodRepository, user, externalUser });
  return `/?token=${encodeURIComponent(token)}&user-id=${user.id}`;
}

async function _saveUserFirstAndLastName({
  authenticationMethodRepository,
  user,
  externalUser
}: $TSFixMe) {
  const authenticationMethod = await authenticationMethodRepository.findOneByUserIdAndIdentityProvider({
    userId: user.id,
    identityProvider: AuthenticationMethod.identityProviders.GAR,
  });

  if (
    _externalUserFirstAndLastNameMatchesAuthenticationMethodFirstAndLastName({ authenticationMethod, externalUser })
  ) {
    return;
  }

  authenticationMethod.authenticationComplement = new AuthenticationMethod.GARAuthenticationComplement({
    firstName: externalUser.firstName,
    lastName: externalUser.lastName,
  });

  authenticationMethodRepository.update(authenticationMethod);
}

function _externalUserFirstAndLastNameMatchesAuthenticationMethodFirstAndLastName({
  authenticationMethod,
  externalUser
}: $TSFixMe) {
  return (
    externalUser.firstName === authenticationMethod.authenticationComplement?.firstName &&
    externalUser.lastName === authenticationMethod.authenticationComplement?.lastName
  );
}

function _getUrlForReconciliationPage({
  tokenService,
  externalUser
}: $TSFixMe) {
  const externalUserToken = tokenService.createIdTokenForUserReconciliation(externalUser);
  return `/campagnes?externalUser=${encodeURIComponent(externalUserToken)}`;
}
