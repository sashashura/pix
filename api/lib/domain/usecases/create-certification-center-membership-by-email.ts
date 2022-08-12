// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
const { AlreadyExistingEntityError } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createCertificationCenterMembershipByEmail({
  certificationCenterId,
  email,
  certificationCenterMembershipRepository,
  userRepository
}: $TSFixMe) {
  const { id: userId } = await userRepository.getByEmail(email);

  const isMembershipExisting = await certificationCenterMembershipRepository.isMemberOfCertificationCenter({
    userId,
    certificationCenterId,
  });

  if (isMembershipExisting) {
    throw new AlreadyExistingEntityError(
      `Certification center membership already exists for the user ID ${userId} and certification center ID ${certificationCenterId}.`
    );
  }

  return certificationCenterMembershipRepository.save({ userId, certificationCenterId });
};
