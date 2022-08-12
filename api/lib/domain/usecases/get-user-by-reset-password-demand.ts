// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getUserByResetPasswordDemand({
  temporaryKey,
  resetPasswordService,
  tokenService,
  userRepository
}: $TSFixMe) {
  await tokenService.decodeIfValid(temporaryKey);
  const { email } = await resetPasswordService.verifyDemand(temporaryKey);
  return userRepository.getByEmail(email);
};
