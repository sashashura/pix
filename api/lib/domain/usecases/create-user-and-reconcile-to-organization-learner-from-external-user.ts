// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignCo... Remove this comment to see the full error message
const { CampaignCodeError, ObjectValidationError } = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require('../models/User');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../models/AuthenticationMethod');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'STUDENT_RE... Remove this comment to see the full error message
const { STUDENT_RECONCILIATION_ERRORS } = require('../constants');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createUserAndReconcileToOrganizationLearnerFromExternalUser({
  birthdate,
  campaignCode,
  token,
  obfuscationService,
  tokenService,
  userReconciliationService,
  userService,
  authenticationMethodRepository,
  campaignRepository,
  userRepository,
  userToCreateRepository,
  organizationLearnerRepository,
  studentRepository
}: $TSFixMe) {
  const campaign = await campaignRepository.getByCode(campaignCode);
  if (!campaign) {
    throw new CampaignCodeError();
  }

  const externalUser = await tokenService.extractExternalUserFromIdToken(token);

  if (!externalUser.firstName || !externalUser.lastName || !externalUser.samlId) {
    throw new ObjectValidationError('Missing claim(s) in IdToken');
  }

  const reconciliationInfo = {
    firstName: externalUser.firstName,
    lastName: externalUser.lastName,
    birthdate,
  };

  const domainUser = new User({
    firstName: externalUser.firstName,
    lastName: externalUser.lastName,
    cgu: false,
  });

  let matchedOrganizationLearner;
  let userWithSamlId;
  let userId;
  const reconciliationErrors = [
    STUDENT_RECONCILIATION_ERRORS.RECONCILIATION.IN_OTHER_ORGANIZATION.samlId.code,
    STUDENT_RECONCILIATION_ERRORS.RECONCILIATION.IN_SAME_ORGANIZATION.samlId.code,
  ];

  try {
    matchedOrganizationLearner =
      await userReconciliationService.findMatchingOrganizationLearnerIdForGivenOrganizationIdAndUser({
        organizationId: campaign.organizationId,
        reconciliationInfo,
        organizationLearnerRepository,
      });

    await userReconciliationService.checkIfStudentHasAnAlreadyReconciledAccount(
      matchedOrganizationLearner,
      userRepository,
      obfuscationService,
      studentRepository
    );

    userWithSamlId = await userRepository.getBySamlId(externalUser.samlId);
    if (!userWithSamlId) {
      userId = await userService.createAndReconcileUserToOrganizationLearner({
        user: domainUser,
        organizationLearnerId: matchedOrganizationLearner.id,
        samlId: externalUser.samlId,
        authenticationMethodRepository,
        organizationLearnerRepository,
        userToCreateRepository,
      });
    }
  } catch (error) {
    if (reconciliationErrors.includes((error as $TSFixMe).code)) {
      await authenticationMethodRepository.updateExternalIdentifierByUserIdAndIdentityProvider({
    externalIdentifier: externalUser.samlId,
    userId: (error as $TSFixMe).meta.userId,
    identityProvider: AuthenticationMethod.identityProviders.GAR,
});
      const organizationLearner = await organizationLearnerRepository.reconcileUserToOrganizationLearner({
    userId: (error as $TSFixMe).meta.userId,
    organizationLearnerId: matchedOrganizationLearner.id,
});
      userId = organizationLearner.userId;
    } else {
      throw error;
    }
  }
  const tokenUserId = userWithSamlId ? userWithSamlId.id : userId;
  const accessToken = tokenService.createAccessTokenForSaml(tokenUserId);
  await userRepository.updateLastLoggedAt({ userId: tokenUserId });
  return accessToken;
};
