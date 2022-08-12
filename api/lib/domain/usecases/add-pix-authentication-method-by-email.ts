// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const { AuthenticationMethodAlreadyExistsError } = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../models/AuthenticationMethod');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function addPixAuthenticationMethodByEmail({
  userId,
  email,
  passwordGenerator,
  encryptionService,
  userRepository,
  authenticationMethodRepository
}: $TSFixMe) {
  await userRepository.checkIfEmailIsAvailable(email);

  const alreadyHasPixAuthenticationMethod = await authenticationMethodRepository.hasIdentityProviderPIX({ userId });

  if (alreadyHasPixAuthenticationMethod) {
    throw new AuthenticationMethodAlreadyExistsError();
  } else {
    const generatedPassword = passwordGenerator.generateComplexPassword();
    const hashedPassword = await encryptionService.hashPassword(generatedPassword);

    const authenticationMethodFromPix = new AuthenticationMethod({
      userId,
      identityProvider: AuthenticationMethod.identityProviders.PIX,
      authenticationComplement: new AuthenticationMethod.PixAuthenticationComplement({
        password: hashedPassword,
        shouldChangePassword: false,
      }),
    });
    await authenticationMethodRepository.create({ authenticationMethod: authenticationMethodFromPix });

    return userRepository.updateUserDetailsForAdministration(userId, { email });
  }
};
