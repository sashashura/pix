const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MissingOrI... Remove this comment to see the full error message
  MissingOrInvalidCredentialsError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
  UserNotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PasswordNo... Remove this comment to see the full error message
  PasswordNotMatching,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Unexpected... Remove this comment to see the full error message
  UnexpectedUserAccountError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserAlread... Remove this comment to see the full error message
  UserAlreadyExistsWithAuthenticationMethodError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserShould... Remove this comment to see the full error message
  UserShouldChangePasswordError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../models/AuthenticationMethod');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'authentica... Remove this comment to see the full error message
async function authenticateExternalUser({
  username,
  password,
  externalUserToken,
  expectedUserId,
  tokenService,
  pixAuthenticationService,
  obfuscationService,
  authenticationMethodRepository,
  userRepository
}: $TSFixMe) {
  try {
    const userFromCredentials = await pixAuthenticationService.getUserByUsernameAndPassword({
      username,
      password,
      userRepository,
    });

    if (userFromCredentials.id !== expectedUserId) {
      const expectedUser = await userRepository.getForObfuscation(expectedUserId);
      const authenticationMethod = await obfuscationService.getUserAuthenticationMethodWithObfuscation(expectedUser);

      throw new UnexpectedUserAccountError({
        message: undefined,
        code: 'UNEXPECTED_USER_ACCOUNT',
        meta: { value: authenticationMethod.value },
      });
    }

    await _addGarAuthenticationMethod({
      userId: userFromCredentials.id,
      externalUserToken,
      tokenService,
      authenticationMethodRepository,
      userRepository,
    });

    if (userFromCredentials.shouldChangePassword) {
      const passwordResetToken = tokenService.createPasswordResetToken(userFromCredentials.id);
      throw new UserShouldChangePasswordError(undefined, passwordResetToken);
    }

    const token = tokenService.createAccessTokenForSaml(userFromCredentials.id);
    await userRepository.updateLastLoggedAt({ userId: userFromCredentials.id });
    return token;
  } catch (error) {
    if (error instanceof UserNotFoundError || error instanceof PasswordNotMatching) {
      throw new MissingOrInvalidCredentialsError();
    } else {
      throw error;
    }
  }
}

async function _addGarAuthenticationMethod({
  userId,
  externalUserToken,
  tokenService,
  authenticationMethodRepository,
  userRepository
}: $TSFixMe) {
  const { samlId, firstName, lastName } = await tokenService.extractExternalUserFromIdToken(externalUserToken);
  await _checkIfSamlIdIsNotReconciledWithAnotherUser({ samlId, userId, userRepository });

  const garAuthenticationMethod = new AuthenticationMethod({
    identityProvider: AuthenticationMethod.identityProviders.GAR,
    externalIdentifier: samlId,
    userId,
    authenticationComplement: new AuthenticationMethod.GARAuthenticationComplement({
      firstName,
      lastName,
    }),
  });
  await authenticationMethodRepository.create({ authenticationMethod: garAuthenticationMethod });
}

const _checkIfSamlIdIsNotReconciledWithAnotherUser = async ({
  samlId,
  userId,
  userRepository
}: $TSFixMe) => {
  const userFromCredentialsBySamlId = await userRepository.getBySamlId(samlId);
  if (userFromCredentialsBySamlId && userFromCredentialsBySamlId.id !== userId) {
    throw new UserAlreadyExistsWithAuthenticationMethodError();
  }
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = authenticateExternalUser;
