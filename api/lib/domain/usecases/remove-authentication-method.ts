// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../models/AuthenticationMethod');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToRemoveAuthenticationMethod } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function removeAuthenticationMethod({
  userId,
  type,
  userRepository,
  authenticationMethodRepository
}: $TSFixMe) {
  const user = await userRepository.get(userId);

  if (type === 'EMAIL') {
    if (!user.username) {
      await _removeAuthenticationMethod(
        userId,
        AuthenticationMethod.identityProviders.PIX,
        authenticationMethodRepository
      );
    }
    await userRepository.updateEmail({ id: userId, email: null });
  }

  if (type === 'USERNAME') {
    if (!user.email) {
      await _removeAuthenticationMethod(
        userId,
        AuthenticationMethod.identityProviders.PIX,
        authenticationMethodRepository
      );
    }
    await userRepository.updateUsername({ id: userId, username: null });
  }

  if (type === 'GAR') {
    await _removeAuthenticationMethod(
      userId,
      AuthenticationMethod.identityProviders.GAR,
      authenticationMethodRepository
    );
  }

  if (type === 'POLE_EMPLOI') {
    await _removeAuthenticationMethod(
      userId,
      AuthenticationMethod.identityProviders.POLE_EMPLOI,
      authenticationMethodRepository
    );
  }
};

async function _removeAuthenticationMethod(userId: $TSFixMe, identityProvider: $TSFixMe, authenticationMethodRepository: $TSFixMe) {
  const authenticationMethods = await authenticationMethodRepository.findByUserId({ userId });

  if (authenticationMethods.length === 1) {
    throw new UserNotAuthorizedToRemoveAuthenticationMethod();
  }

  await authenticationMethodRepository.removeByUserIdAndIdentityProvider({ userId, identityProvider });
}
