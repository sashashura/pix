// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'codeUtils'... Remove this comment to see the full error message
const codeUtils = require('../../infrastructure/utils/code-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../models/AuthenticationMethod');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidPas... Remove this comment to see the full error message
const { InvalidPasswordForUpdateEmailError, UserNotAuthorizedToUpdateEmailError } = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'get'.
const get = require('lodash/get');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function sendVerificationCode({
  i18n,
  locale,
  newEmail,
  password,
  userId,
  authenticationMethodRepository,
  userEmailRepository,
  userRepository,
  encryptionService,
  mailService
}: $TSFixMe) {
  const user = await userRepository.get(userId);
  if (!user.email) {
    throw new UserNotAuthorizedToUpdateEmailError();
  }

  await userRepository.checkIfEmailIsAvailable(newEmail);

  const authenticationMethod = await authenticationMethodRepository.findOneByUserIdAndIdentityProvider({
    userId,
    identityProvider: AuthenticationMethod.identityProviders.PIX,
  });

  try {
    const passwordHash = get(authenticationMethod, 'authenticationComplement.password', '');

    await encryptionService.checkPassword({
      password,
      passwordHash,
    });
  } catch (e) {
    throw new InvalidPasswordForUpdateEmailError();
  }

  const code = codeUtils.generateNumericalString(6);

  await userEmailRepository.saveEmailModificationDemand({ userId, code, newEmail });
  await mailService.sendVerificationCodeEmail({ code, locale, translate: i18n.__, email: newEmail });
};
