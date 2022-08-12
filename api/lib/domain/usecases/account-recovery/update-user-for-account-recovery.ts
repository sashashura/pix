// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../models/AuthenticationMethod');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function updateUserForAccountRecovery({
  password,
  temporaryKey,
  userRepository,
  authenticationMethodRepository,
  accountRecoveryDemandRepository,
  scoAccountRecoveryService,
  encryptionService,
  domainTransaction
}: $TSFixMe) {
  const { userId, newEmail } = await scoAccountRecoveryService.retrieveAndValidateAccountRecoveryDemand({
    temporaryKey,
    accountRecoveryDemandRepository,
    userRepository,
  });

  const authenticationMethods = await authenticationMethodRepository.findByUserId({ userId });
  const isAuthenticatedFromGarOnly =
    authenticationMethods.length === 1 &&
    authenticationMethods[0].identityProvider === AuthenticationMethod.identityProviders.GAR;

  const hashedPassword = await encryptionService.hashPassword(password);

  if (isAuthenticatedFromGarOnly) {
    const authenticationMethodFromPix = new AuthenticationMethod({
      userId,
      identityProvider: AuthenticationMethod.identityProviders.PIX,
      authenticationComplement: new AuthenticationMethod.PixAuthenticationComplement({
        password: hashedPassword,
        shouldChangePassword: false,
      }),
    });
    authenticationMethodRepository.create(
      {
        authenticationMethod: authenticationMethodFromPix,
      },
      domainTransaction
    );
  } else {
    authenticationMethodRepository.updateChangedPassword(
      {
        userId,
        hashedPassword,
      },
      domainTransaction
    );
  }

  const now = new Date();
  const userValuesToUpdate = {
    cgu: true,
    email: newEmail,
    emailConfirmedAt: now,
    lastTermsOfServiceValidatedAt: now,
  };

  await userRepository.updateWithEmailConfirmed({
    id: userId,
    userAttributes: userValuesToUpdate,
    domainTransaction,
  });
  await accountRecoveryDemandRepository.markAsBeingUsed(temporaryKey, domainTransaction);
};
