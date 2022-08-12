// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function anonymizeUser({
  userId,
  userRepository,
  authenticationMethodRepository,
  refreshTokenService
}: $TSFixMe) {
  const anonymizedUser = {
    firstName: `prenom_${userId}`,
    lastName: `nom_${userId}`,
    email: `email_${userId}@example.net`,
    username: null,
  };

  await authenticationMethodRepository.removeAllAuthenticationMethodsByUserId({ userId });
  await refreshTokenService.revokeRefreshTokensForUserId({ userId });
  return userRepository.updateUserDetailsForAdministration(userId, anonymizedUser);
};
