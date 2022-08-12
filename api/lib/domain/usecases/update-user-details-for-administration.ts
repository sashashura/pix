// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'has'.
const has = require('lodash/has');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
  AlreadyRegisteredEmailAndUsernameError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
  AlreadyRegisteredEmailError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
  AlreadyRegisteredUsernameError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function updateUserDetailsForAdministration({
  userId,
  userDetailsForAdministration,
  userRepository
}: $TSFixMe) {
  const { email, username } = userDetailsForAdministration;

  const foundUsersWithEmailAlreadyUsed = email && (await userRepository.findAnotherUserByEmail(userId, email));
  const foundUsersWithUsernameAlreadyUsed =
    username && (await userRepository.findAnotherUserByUsername(userId, username));

  await _checkEmailAndUsernameAreAvailable({
    usersWithEmail: foundUsersWithEmailAlreadyUsed,
    usersWithUsername: foundUsersWithUsernameAlreadyUsed,
  });

  const userMustValidateTermsOfService = await _isAddingEmailForFirstTime({ userId, email, userRepository });
  if (userMustValidateTermsOfService) {
    userDetailsForAdministration.mustValidateTermsOfService = true;
  }

  await userRepository.updateUserDetailsForAdministration(userId, userDetailsForAdministration);

  return userRepository.getUserDetailsForAdmin(userId);
};

async function _checkEmailAndUsernameAreAvailable({
  usersWithEmail,
  usersWithUsername
}: $TSFixMe) {
  const isEmailAlreadyUsed = has(usersWithEmail, '[0].email');
  const isUsernameAlreadyUsed = has(usersWithUsername, '[0].username');

  if (isEmailAlreadyUsed && isUsernameAlreadyUsed) {
    throw new AlreadyRegisteredEmailAndUsernameError();
  } else if (isEmailAlreadyUsed) {
    throw new AlreadyRegisteredEmailError();
  } else if (isUsernameAlreadyUsed) {
    throw new AlreadyRegisteredUsernameError();
  }
}

async function _isAddingEmailForFirstTime({
  userId,
  email,
  userRepository
}: $TSFixMe) {
  const user = await userRepository.get(userId);
  const userWithoutEmail = !user.email;
  const userHasUsername = !!user.username;
  const shouldChangeEmail = !!email;
  return userWithoutEmail && userHasUsername && shouldChangeEmail;
}
