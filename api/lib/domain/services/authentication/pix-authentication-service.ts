// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'encryption... Remove this comment to see the full error message
const encryptionService = require('../encryption-service');

async function getUserByUsernameAndPassword({
  username,
  password,
  userRepository
}: $TSFixMe) {
  const foundUser = await userRepository.getByUsernameOrEmailWithRolesAndPassword(username);
  const passwordHash = foundUser.authenticationMethods[0].authenticationComplement.password;

  await encryptionService.checkPassword({
    password,
    passwordHash,
  });

  return foundUser;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  getUserByUsernameAndPassword,
};
