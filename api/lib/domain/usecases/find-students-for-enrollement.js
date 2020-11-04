const { ForbiddenAccess } = require('../errors');
const { NotFoundError } = require('../errors');

module.exports = async function findStudentsForEnrollement({
  userId,
  certificationCenterId,
  sessionId,
  organizationRepository,
  schoolingRegistrationRepository,
  certificationCenterMembershipRepository,
}) {
  const hasAccess = await certificationCenterMembershipRepository.doesUserHaveMembershipToCertificationCenter(userId, certificationCenterId);
  if (!hasAccess) throw new ForbiddenAccess(`User ${userId} is not a member of certification center ${certificationCenterId}`);

  console.log({ certificationCenterId, sessionId });
  try {
    const organizationId = await organizationRepository.getIdByCertificationCenterId(certificationCenterId);
    // get schooling registrations for the session
    // match with students and add field isEnrolled
    return schoolingRegistrationRepository.findByOrganizationIdOrderByDivision({ organizationId });
  } catch (error) {
    if (error instanceof NotFoundError) return [];
    throw error;
  }
};
