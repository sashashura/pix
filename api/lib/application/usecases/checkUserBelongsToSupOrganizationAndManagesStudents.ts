// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'membership... Remove this comment to see the full error message
const membershipRepository = require('../../infrastructure/repositories/membership-repository');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async execute(userId: $TSFixMe, organizationId: $TSFixMe) {
    const memberships = await membershipRepository.findByUserIdAndOrganizationId({
      userId,
      organizationId,
      includeOrganization: true,
    });

    return memberships.some(
      (membership: $TSFixMe) => membership.organization.isManagingStudents && membership.organization.isSup
    );
  },
};
