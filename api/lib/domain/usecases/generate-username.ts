const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignCo... Remove this comment to see the full error message
  CampaignCodeError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationLearnerNotFound,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationLearnerAlreadyLinkedToUserError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'STUDENT_RE... Remove this comment to see the full error message
const { STUDENT_RECONCILIATION_ERRORS } = require('../constants');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'find'.
const { find, get } = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function generateUsername({
  studentInformation,
  campaignCode,
  campaignRepository,
  organizationLearnerRepository,
  userReconciliationService,
  obfuscationService,
  userRepository,
  studentRepository
}: $TSFixMe) {
  const campaign = await campaignRepository.getByCode(campaignCode);
  if (!campaign) {
    throw new CampaignCodeError(`Le code campagne ${campaignCode} n'existe pas.`);
  }

  const matchedOrganizationLearner = await findMatchedOrganizationLearnerForGivenOrganizationIdAndStudentInfo({
    organizationId: campaign.organizationId,
    studentInformation,
    organizationLearnerRepository,
    userReconciliationService,
    obfuscationService,
  });
  await checkIfStudentIsAlreadyReconciledOnTheSameOrganization(
    matchedOrganizationLearner,
    userRepository,
    obfuscationService
  );

  const student = await studentRepository.getReconciledStudentByNationalStudentId(
    matchedOrganizationLearner.nationalStudentId
  );
  await checkIfStudentHasAlreadyAccountsReconciledInOtherOrganizations(student, userRepository, obfuscationService);

  studentInformation = {
    firstName: matchedOrganizationLearner.firstName,
    lastName: matchedOrganizationLearner.lastName,
    birthdate: matchedOrganizationLearner.birthdate,
  };

  return userReconciliationService.createUsernameByUser({ user: studentInformation, userRepository });
};

async function findMatchedOrganizationLearnerForGivenOrganizationIdAndStudentInfo({
  organizationId,
  studentInformation: { firstName, lastName, birthdate },
  organizationLearnerRepository,
  userReconciliationService
}: $TSFixMe) {
  const organizationLearners = await organizationLearnerRepository.findByOrganizationIdAndBirthdate({
    organizationId,
    birthdate,
  });

  if (organizationLearners.length === 0) {
    throw new OrganizationLearnerNotFound(
      'There were no organizationLearners matching with organization and birthdate'
    );
  }

  const organizationLearnerId = await userReconciliationService.findMatchingCandidateIdForGivenUser(
    organizationLearners,
    { firstName, lastName }
  );

  if (!organizationLearnerId) {
    throw new OrganizationLearnerNotFound('There were no organizationLearners matching with names');
  }

  return find(organizationLearners, { id: organizationLearnerId });
}

async function checkIfStudentIsAlreadyReconciledOnTheSameOrganization(
  matchingOrganizationLearner: $TSFixMe,
  userRepository: $TSFixMe,
  obfuscationService: $TSFixMe
) {
  if (get(matchingOrganizationLearner, 'userId')) {
    const userId = matchingOrganizationLearner.userId;
    const user = await userRepository.getForObfuscation(userId);
    const authenticationMethod = await obfuscationService.getUserAuthenticationMethodWithObfuscation(user);

    const detail = 'Un compte existe déjà pour l‘élève dans le même établissement.';
    const error =
      STUDENT_RECONCILIATION_ERRORS.LOGIN_OR_REGISTER.IN_SAME_ORGANIZATION[authenticationMethod.authenticatedBy];
    const meta = { shortCode: error.shortCode, value: authenticationMethod.value };
    throw new OrganizationLearnerAlreadyLinkedToUserError(detail, error.code, meta);
  }
}

async function checkIfStudentHasAlreadyAccountsReconciledInOtherOrganizations(
  student: $TSFixMe,
  userRepository: $TSFixMe,
  obfuscationService: $TSFixMe
) {
  if (get(student, 'account')) {
    const userId = student.account.userId;
    const user = await userRepository.getForObfuscation(userId);
    const authenticationMethod = await obfuscationService.getUserAuthenticationMethodWithObfuscation(user);

    const detail = 'Un compte existe déjà pour l‘élève dans un autre établissement.';
    const error =
      STUDENT_RECONCILIATION_ERRORS.LOGIN_OR_REGISTER.IN_OTHER_ORGANIZATION[authenticationMethod.authenticatedBy];
    const meta = { shortCode: error.shortCode, value: authenticationMethod.value };
    throw new OrganizationLearnerAlreadyLinkedToUserError(detail, error.code, meta);
  }
}
