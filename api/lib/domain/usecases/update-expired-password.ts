// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'get'.
const get = require('lodash/get');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../domain/models/AuthenticationMethod');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ForbiddenA... Remove this comment to see the full error message
const { ForbiddenAccess } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
const { UserNotFoundError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../../lib/infrastructure/logger');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function updateExpiredPassword({
  passwordResetToken,
  newPassword,
  encryptionService,
  tokenService,
  authenticationMethodRepository,
  userRepository
}: $TSFixMe) {
  const userId = await tokenService.extractUserId(passwordResetToken);

  let foundUser;
  try {
    foundUser = await userRepository.getById(userId);
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      logger.warn('Trying to change his password with incorrect user id');
    }
    throw error;
  }

  const authenticationMethod = await authenticationMethodRepository.findOneByUserIdAndIdentityProvider({
    userId: foundUser.id,
    identityProvider: AuthenticationMethod.identityProviders.PIX,
  });

  const shouldChangePassword = get(authenticationMethod, 'authenticationComplement.shouldChangePassword');

  if (!shouldChangePassword) {
    throw new ForbiddenAccess();
  }

  const hashedPassword = await encryptionService.hashPassword(newPassword);

  await authenticationMethodRepository.updateExpiredPassword({
    userId: foundUser.id,
    hashedPassword,
  });

  return foundUser.username ?? foundUser.email;
};
