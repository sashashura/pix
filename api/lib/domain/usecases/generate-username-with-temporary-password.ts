// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isEmpty'.
const isEmpty = require('lodash/isEmpty');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToGenerateUsernamePasswordError } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function generateUsernameWithTemporaryPassword({
  organizationLearnerId,
  organizationId,
  passwordGenerator,
  encryptionService,
  userReconciliationService,
  userService,
  authenticationMethodRepository,
  userRepository,
  organizationLearnerRepository
}: $TSFixMe) {
  const organizationLearner = await organizationLearnerRepository.get(organizationLearnerId);
  _checkIfStudentHasAccessToOrganization(organizationLearner, organizationId);

  const studentAccount = await userRepository.get(organizationLearner.userId);
  _checkIfStudentAccountAlreadyHasUsername(studentAccount);

  const username = await userReconciliationService.createUsernameByUser({
    user: organizationLearner,
    userRepository,
  });

  const hasStudentAccountAnIdentityProviderPIX = await authenticationMethodRepository.hasIdentityProviderPIX({
    userId: studentAccount.id,
  });

  if (hasStudentAccountAnIdentityProviderPIX) {
    const updatedUser = await userRepository.addUsername(studentAccount.id, username);
    return { username: updatedUser.username };
  } else {
    const generatedPassword = passwordGenerator.generateSimplePassword();
    const hashedPassword = await encryptionService.hashPassword(generatedPassword);

    // and Create Password
    await userService.updateUsernameAndAddPassword({
      userId: studentAccount.id,
      username,
      hashedPassword,
      authenticationMethodRepository,
      userRepository,
    });

    return { username, generatedPassword };
  }
};

function _checkIfStudentHasAccessToOrganization(organizationLearner: $TSFixMe, organizationId: $TSFixMe) {
  if (organizationLearner.organizationId !== organizationId) {
    throw new UserNotAuthorizedToGenerateUsernamePasswordError(
      `L'élève avec l'INE ${organizationLearner.nationalStudentId} n'appartient pas à l'organisation.`
    );
  }
}

function _checkIfStudentAccountAlreadyHasUsername(studentAccount: $TSFixMe) {
  if (!isEmpty(studentAccount.username)) {
    throw new UserNotAuthorizedToGenerateUsernamePasswordError(
      `Ce compte utilisateur dispose déjà d'un identifiant: ${studentAccount.username}.`
    );
  }
}
