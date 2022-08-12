// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getAccountRecoveryDetails({
  temporaryKey,
  accountRecoveryDemandRepository,
  organizationLearnerRepository,
  userRepository,
  scoAccountRecoveryService
}: $TSFixMe) {
  const { id, newEmail, organizationLearnerId } =
    await scoAccountRecoveryService.retrieveAndValidateAccountRecoveryDemand({
      temporaryKey,
      accountRecoveryDemandRepository,
      userRepository,
    });

  const { firstName } = await organizationLearnerRepository.get(organizationLearnerId);

  return {
    id,
    email: newEmail,
    firstName,
  };
};
