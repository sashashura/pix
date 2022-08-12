// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToUpdatePasswordError } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function updateUserPassword({
  userId,
  password,
  temporaryKey,
  encryptionService,
  resetPasswordService,
  authenticationMethodRepository,
  userRepository
}: $TSFixMe) {
  const hashedPassword = await encryptionService.hashPassword(password);
  const user = await userRepository.get(userId);

  if (!user.email) {
    throw new UserNotAuthorizedToUpdatePasswordError();
  }

  await resetPasswordService.hasUserAPasswordResetDemandInProgress(user.email, temporaryKey);

  const updatedUser = await authenticationMethodRepository.updateChangedPassword({
    userId: user.id,
    hashedPassword,
  });
  await resetPasswordService.invalidateOldResetPasswordDemand(user.email);

  return updatedUser;
};
