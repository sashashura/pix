// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'StudentInf... Remove this comment to see the full error message
const StudentInformationForAccountRecovery = require('../read-models/StudentInformationForAccountRecovery');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function checkScoAccountRecovery({
  studentInformation,
  organizationLearnerRepository,
  organizationRepository,
  accountRecoveryDemandRepository,
  userRepository,
  scoAccountRecoveryService,
  userReconciliationService
}: $TSFixMe) {
  const { firstName, lastName, username, organizationId, email } =
    await scoAccountRecoveryService.retrieveOrganizationLearner({
      studentInformation,
      accountRecoveryDemandRepository,
      organizationLearnerRepository,
      userRepository,
      userReconciliationService,
    });

  const { name: latestOrganizationName } = await organizationRepository.get(organizationId);

  return new StudentInformationForAccountRecovery({
    firstName,
    lastName,
    username,
    email,
    latestOrganizationName,
  });
};
