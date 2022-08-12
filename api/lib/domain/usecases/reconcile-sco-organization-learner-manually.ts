const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignCo... Remove this comment to see the full error message
  CampaignCodeError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationLearnerAlreadyLinkedToUserError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserShould... Remove this comment to see the full error message
  UserShouldNotBeReconciledOnAnotherAccountError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'STUDENT_RE... Remove this comment to see the full error message
const { STUDENT_RECONCILIATION_ERRORS } = require('../constants');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isEmpty'.
const isEmpty = require('lodash/isEmpty');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function reconcileScoOrganizationLearnerManually({
  campaignCode,
  reconciliationInfo,
  withReconciliation,
  campaignRepository,
  organizationLearnerRepository,
  studentRepository,
  userRepository,
  obfuscationService,
  userReconciliationService
}: $TSFixMe) {
  const campaign = await campaignRepository.getByCode(campaignCode);
  if (!campaign) {
    throw new CampaignCodeError();
  }

  const organizationLearnerOfUserAccessingCampaign =
    await userReconciliationService.findMatchingOrganizationLearnerIdForGivenOrganizationIdAndUser({
      organizationId: campaign.organizationId,
      reconciliationInfo,
      organizationLearnerRepository,
    });

  await userReconciliationService.checkIfStudentHasAnAlreadyReconciledAccount(
    organizationLearnerOfUserAccessingCampaign,
    userRepository,
    obfuscationService,
    studentRepository
  );

  await _checkIfAnotherStudentIsAlreadyReconciledWithTheSameOrganizationAndUser(
    reconciliationInfo.id,
    campaign.organizationId,
    organizationLearnerRepository
  );

  await _checkIfUserIsConnectedOnAnotherAccount({
    organizationLearnerOfUserAccessingCampaign,
    authenticatedUserId: reconciliationInfo.id,
    organizationLearnerRepository,
  });

  if (withReconciliation) {
    return organizationLearnerRepository.reconcileUserToOrganizationLearner({
      userId: reconciliationInfo.id,
      organizationLearnerId: organizationLearnerOfUserAccessingCampaign.id,
    });
  }
};

async function _checkIfAnotherStudentIsAlreadyReconciledWithTheSameOrganizationAndUser(
  userId: $TSFixMe,
  organizationId: $TSFixMe,
  organizationLearnerRepository: $TSFixMe
) {
  const organizationLearnerFound = await organizationLearnerRepository.findOneByUserIdAndOrganizationId({
    userId,
    organizationId,
  });

  if (organizationLearnerFound) {
    const detail = 'Un autre étudiant est déjà réconcilié dans la même organisation et avec le même compte utilisateur';
    const error = STUDENT_RECONCILIATION_ERRORS.RECONCILIATION.IN_SAME_ORGANIZATION.anotherStudentIsAlreadyReconciled;
    const meta = {
      shortCode: error.shortCode,
    };
    throw new OrganizationLearnerAlreadyLinkedToUserError(detail, error.code, meta);
  }
}

async function _checkIfUserIsConnectedOnAnotherAccount({
  organizationLearnerOfUserAccessingCampaign,
  authenticatedUserId,
  organizationLearnerRepository
}: $TSFixMe) {
  const loggedAccountReconciledOrganizationLearners = await organizationLearnerRepository.findByUserId({
    userId: authenticatedUserId,
  });

  const loggedAccountReconciledOrganizationLearnersWithoutNullNationalStudentIds =
    loggedAccountReconciledOrganizationLearners.filter(
      (organizationLearner: $TSFixMe) => !!organizationLearner.nationalStudentId
    );

  if (isEmpty(loggedAccountReconciledOrganizationLearnersWithoutNullNationalStudentIds)) {
    return;
  }

  const isUserNationalStudentIdDifferentFromLoggedAccount =
    loggedAccountReconciledOrganizationLearnersWithoutNullNationalStudentIds.every(
      (organizationLearner: $TSFixMe) => organizationLearner.nationalStudentId !== organizationLearnerOfUserAccessingCampaign.nationalStudentId
    );

  if (isUserNationalStudentIdDifferentFromLoggedAccount) {
    const isUserBirthdayDifferentFromLoggedAccount =
      loggedAccountReconciledOrganizationLearnersWithoutNullNationalStudentIds.every(
        (organizationLearner: $TSFixMe) => organizationLearner.birthdate !== organizationLearnerOfUserAccessingCampaign.birthdate
      );

    if (isUserBirthdayDifferentFromLoggedAccount) {
      const error = STUDENT_RECONCILIATION_ERRORS.RECONCILIATION.ACCOUNT_BELONGING_TO_ANOTHER_USER;
      const meta = {
        shortCode: error.shortCode,
      };
      throw new UserShouldNotBeReconciledOnAnotherAccountError({ code: error.code, meta });
    }
  }
}
