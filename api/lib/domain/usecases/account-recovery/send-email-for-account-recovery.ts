// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'crypto'.
const crypto = require('crypto');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AccountRec... Remove this comment to see the full error message
const AccountRecoveryDemand = require('../../models/AccountRecoveryDemand');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function sendEmailForAccountRecovery({
  studentInformation,
  temporaryKey,
  organizationLearnerRepository,
  userRepository,
  accountRecoveryDemandRepository,
  mailService,
  scoAccountRecoveryService,
  userReconciliationService
}: $TSFixMe) {
  const { email: newEmail } = studentInformation;
  const encodedTemporaryKey = temporaryKey || crypto.randomBytes(32).toString('hex');

  const {
    firstName,
    id,
    userId,
    email: oldEmail,
  } = await scoAccountRecoveryService.retrieveOrganizationLearner({
    studentInformation,
    accountRecoveryDemandRepository,
    organizationLearnerRepository,
    userRepository,
    userReconciliationService,
  });

  await userRepository.checkIfEmailIsAvailable(newEmail);

  const accountRecoveryDemand = new AccountRecoveryDemand({
    userId,
    organizationLearnerId: id,
    newEmail,
    oldEmail,
    used: false,
    temporaryKey: encodedTemporaryKey,
  });
  await accountRecoveryDemandRepository.save(accountRecoveryDemand);

  await mailService.sendAccountRecoveryEmail({
    firstName,
    email: newEmail,
    temporaryKey: encodedTemporaryKey,
  });
};
