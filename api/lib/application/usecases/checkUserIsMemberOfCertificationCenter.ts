// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCenterMembershipRepository = require('../../infrastructure/repositories/certification-center-membership-repository');
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async execute(userId: $TSFixMe, certificationCenterId: $TSFixMe) {
    return await certificationCenterMembershipRepository.isMemberOfCertificationCenter({
      userId,
      certificationCenterId,
    });
  },
};
