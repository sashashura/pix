// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'features'.
const { features } = require('../../config');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AccountRec... Remove this comment to see the full error message
  AccountRecoveryDemandExpired,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MultipleOr... Remove this comment to see the full error message
  MultipleOrganizationLearnersWithDifferentNationalStudentIdError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
  UserNotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserHasAlr... Remove this comment to see the full error message
  UserHasAlreadyLeftSCO,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'uniqBy'.
const { uniqBy } = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'retrieveOr... Remove this comment to see the full error message
async function retrieveOrganizationLearner({
  accountRecoveryDemandRepository,
  studentInformation,
  organizationLearnerRepository,
  userRepository,
  userReconciliationService
}: $TSFixMe) {
  const latestOrganizationLearner = await organizationLearnerRepository.getLatestOrganizationLearner({
    birthdate: studentInformation.birthdate,
    nationalStudentId: studentInformation.ineIna.toUpperCase(),
  });

  const userId = await _getUserIdByMatchingStudentInformationWithOrganizationLearner({
    studentInformation,
    latestOrganizationLearner,
    userReconciliationService,
  });

  const accountRecoveryDemands = await accountRecoveryDemandRepository.findByUserId(userId);

  if (accountRecoveryDemands.some((accountRecoveryDemand: $TSFixMe) => accountRecoveryDemand.used)) {
    throw new UserHasAlreadyLeftSCO();
  }

  await _checkIfThereAreMultipleUserForTheSameAccount({ userId, organizationLearnerRepository });

  const { username, email } = await userRepository.get(userId);

  const { id, firstName, lastName, organizationId } = latestOrganizationLearner;

  return { id, userId, firstName, lastName, username, organizationId, email };
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'retrieveAn... Remove this comment to see the full error message
async function retrieveAndValidateAccountRecoveryDemand({
  temporaryKey,
  userRepository,
  accountRecoveryDemandRepository
}: $TSFixMe) {
  const { id, userId, newEmail, organizationLearnerId, createdAt } =
    await accountRecoveryDemandRepository.findByTemporaryKey(temporaryKey);
  await userRepository.checkIfEmailIsAvailable(newEmail);

  const accountRecoveryDemands = await accountRecoveryDemandRepository.findByUserId(userId);

  if (accountRecoveryDemands.some((accountRecoveryDemand: $TSFixMe) => accountRecoveryDemand.used)) {
    throw new UserHasAlreadyLeftSCO();
  }

  if (_demandHasExpired(createdAt)) {
    throw new AccountRecoveryDemandExpired();
  }

  return { id, userId, newEmail, organizationLearnerId };
}

function _demandHasExpired(demandCreationDate: $TSFixMe) {
  const minutesInADay = 60 * 24;
  const lifetimeInMinutes = parseInt(features.scoAccountRecoveryKeyLifetimeMinutes) || minutesInADay;
  const millisecondsInAMinute = 60 * 1000;
  const lifetimeInMilliseconds = lifetimeInMinutes * millisecondsInAMinute;

  const expirationDate = new Date(demandCreationDate.getTime() + lifetimeInMilliseconds);
  const now = new Date();

  return expirationDate < now;
}

async function _getUserIdByMatchingStudentInformationWithOrganizationLearner({
  studentInformation,
  latestOrganizationLearner,
  userReconciliationService
}: $TSFixMe) {
  const matchingOrganizationLearnerId = await userReconciliationService.findMatchingCandidateIdForGivenUser(
    [latestOrganizationLearner],
    { firstName: studentInformation.firstName, lastName: studentInformation.lastName }
  );

  if (!matchingOrganizationLearnerId) {
    throw new UserNotFoundError();
  }

  return latestOrganizationLearner.userId;
}

async function _checkIfThereAreMultipleUserForTheSameAccount({
  userId,
  organizationLearnerRepository
}: $TSFixMe) {
  const organizationLearners = await organizationLearnerRepository.findByUserId({ userId });
  const nonEmptyNationalStudentIds = organizationLearners.filter((learner: $TSFixMe) => !!learner.nationalStudentId);

  if (uniqBy(nonEmptyNationalStudentIds, 'nationalStudentId').length > 1) {
    throw new MultipleOrganizationLearnersWithDifferentNationalStudentIdError();
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  retrieveOrganizationLearner,
  retrieveAndValidateAccountRecoveryDemand,
};
