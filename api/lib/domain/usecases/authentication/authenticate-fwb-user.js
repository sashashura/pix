const { UnexpectedOidcStateError } = require('../../errors');
const AuthenticationMethod = require('../../models/AuthenticationMethod');
const logger = require('../../../infrastructure/logger');

module.exports = async function authenticateFwbUser({
  code,
  redirectUri,
  stateReceived,
  stateSent,
  fwbAuthenticationService,
  authenticationSessionService,
  userRepository,
}) {
  if (stateSent !== stateReceived) {
    logger.error(`State sent ${stateSent} did not match the state received ${stateReceived}`);
    throw new UnexpectedOidcStateError();
  }
  const data = await fwbAuthenticationService.exchangeCodeForToken({ code, redirectUri });

  const userInfo = await fwbAuthenticationService.getUserInfo(data);

  const user = await userRepository.findByExternalIdentifier({
    externalIdentityId: userInfo.externalIdentityId,
    identityProvider: AuthenticationMethod.identityProviders.FWB,
  });

  if (user) {
    const pixAccessToken = fwbAuthenticationService.createAccessToken(user.id);

    await userRepository.updateLastLoggedAt({ userId: user.id });

    return { pixAccessToken, isAuthenticationComplete: true };
  } else {
    const authenticationKey = await authenticationSessionService.save(data);

    return { authenticationKey, isAuthenticationComplete: false };
  }
};
