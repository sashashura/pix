// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createPasswordResetDemand({
  email,
  locale,
  mailService,
  resetPasswordService,
  resetPasswordDemandRepository,
  userRepository
}: $TSFixMe) {
  await userRepository.isUserExistingByEmail(email);

  const temporaryKey = resetPasswordService.generateTemporaryKey();
  const passwordResetDemand = await resetPasswordDemandRepository.create({ email, temporaryKey });

  await mailService.sendResetPasswordDemandEmail({ email, locale, temporaryKey });

  return passwordResetDemand;
};
