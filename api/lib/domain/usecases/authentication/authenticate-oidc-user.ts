// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Unexpected... Remove this comment to see the full error message
const { UnexpectedOidcStateError, UnexpectedUserAccountError } = require('../../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../../infrastructure/logger');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../models/AuthenticationMethod');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function authenticateOidcUser({
  stateReceived,
  stateSent,
  code,
  redirectUri,
  authenticatedUserId,
  oidcAuthenticationService,
  authenticationSessionService,
  authenticationMethodRepository,
  userRepository
}: $TSFixMe) {
  if (stateSent !== stateReceived) {
    logger.error(`State sent ${stateSent} did not match the state received ${stateReceived}`);
    throw new UnexpectedOidcStateError();
  }

  const sessionContent = await oidcAuthenticationService.exchangeCodeForTokens({ code, redirectUri });
  const userInfo = await oidcAuthenticationService.getUserInfo({
    idToken: sessionContent.idToken,
    accessToken: sessionContent.accessToken,
  });
  const user = await userRepository.findByExternalIdentifier({
    externalIdentityId: userInfo.externalIdentityId,
    identityProvider: oidcAuthenticationService.identityProvider,
  });

  const userId = user?.id || authenticatedUserId;

  if (!userId) {
    const authenticationKey = await authenticationSessionService.save({ userInfo, sessionContent });
    return { authenticationKey, isAuthenticationComplete: false };
  }

  await _createOrUpdateAuthenticationMethodWithComplement({
    userInfo,
    userId,
    sessionContent,
    oidcAuthenticationService,
    authenticationMethodRepository,
  });

  const pixAccessToken = oidcAuthenticationService.createAccessToken(userId);
  const logoutUrlUUID = await oidcAuthenticationService.saveIdToken({
    idToken: sessionContent.idToken,
    userId,
  });
  userRepository.updateLastLoggedAt({ userId });

  return { pixAccessToken, logoutUrlUUID, isAuthenticationComplete: true };
};

async function _createOrUpdateAuthenticationMethodWithComplement({
  userInfo,
  userId,
  sessionContent,
  oidcAuthenticationService,
  authenticationMethodRepository
}: $TSFixMe) {
  const authenticationComplement = oidcAuthenticationService.createAuthenticationComplement({ sessionContent });
  if (!authenticationComplement) return;

  const alreadyExistingAuthenticationMethod = await authenticationMethodRepository.findOneByUserIdAndIdentityProvider({
    userId,
    identityProvider: oidcAuthenticationService.identityProvider,
  });

  if (!alreadyExistingAuthenticationMethod) {
    return await authenticationMethodRepository.create({
      authenticationMethod: new AuthenticationMethod({
        identityProvider: oidcAuthenticationService.identityProvider,
        userId,
        externalIdentifier: userInfo.externalIdentityId,
        authenticationComplement,
      }),
    });
  }

  if (alreadyExistingAuthenticationMethod.externalIdentifier !== userInfo.externalIdentityId) {
    throw new UnexpectedUserAccountError({ message: "Le compte Pix connecté n'est pas celui qui est attendu." });
  }

  return await authenticationMethodRepository.updateAuthenticationComplementByUserIdAndIdentityProvider({
    authenticationComplement,
    userId,
    identityProvider: oidcAuthenticationService.identityProvider,
  });
}
