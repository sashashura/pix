// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const { AuthenticationMethodAlreadyExistsError } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function reassignAuthenticationMethodToAnotherUser({
  originUserId,
  targetUserId,
  authenticationMethodId,
  userRepository,
  authenticationMethodRepository
}: $TSFixMe) {
  const authenticationMethodToReassign = await authenticationMethodRepository.getByIdAndUserId({
    id: authenticationMethodId,
    userId: originUserId,
  });
  const identityProviderToReassign = authenticationMethodToReassign.identityProvider;

  await _checkIfTargetUserExists({ targetUserId, userRepository });

  await _checkIfTargetUserHasAlreadyAMethodWithIdentityProvider({
    targetUserId,
    identityProviderToReassign,
    authenticationMethodRepository,
  });

  await authenticationMethodRepository.updateAuthenticationMethodUserId({
    originUserId,
    identityProvider: identityProviderToReassign,
    targetUserId,
  });
};

async function _checkIfTargetUserExists({
  targetUserId,
  userRepository
}: $TSFixMe) {
  await userRepository.get(targetUserId);
}

async function _checkIfTargetUserHasAlreadyAMethodWithIdentityProvider({
  targetUserId,
  identityProviderToReassign,
  authenticationMethodRepository
}: $TSFixMe) {
  const targetUserAuthenticationMethods = await authenticationMethodRepository.findByUserId({ userId: targetUserId });
  const hasTargetAnAuthenticationMethodWithProvider = targetUserAuthenticationMethods.find(
    (authenticationMethod: $TSFixMe) => authenticationMethod.identityProvider === identityProviderToReassign
  );

  if (hasTargetAnAuthenticationMethodWithProvider) {
    throw new AuthenticationMethodAlreadyExistsError(
      `L'utilisateur ${targetUserId} a déjà une méthode de connexion ${identityProviderToReassign}.`
    );
  }
}
