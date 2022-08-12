// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'pipe'.
const { pipe } = require('lodash/fp');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'randomStri... Remove this comment to see the full error message
const randomString = require('randomstring');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'STUDENT_RE... Remove this comment to see the full error message
const { STUDENT_RECONCILIATION_ERRORS } = require('../constants');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
  AlreadyRegisteredUsernameError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
  NotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationLearnerAlreadyLinkedToUserError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationLearnerAlreadyLinkedToInvalidUserError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'areTwoStri... Remove this comment to see the full error message
const { areTwoStringsCloseEnough, isOneStringCloseEnoughFromMultipleStrings } = require('./string-comparison-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'normalizeA... Remove this comment to see the full error message
const { normalizeAndRemoveAccents, removeSpecialCharacters } = require('./validation-treatments');

const MAX_ACCEPTABLE_RATIO = 0.25;
const STRICT_MATCH_RATIO = 0;

function findMatchingCandidateIdForGivenUser(matchingUserCandidates: $TSFixMe, user: $TSFixMe) {
  const standardizedUser = _standardizeUser(user);
  const standardizedMatchingUserCandidates = _.map(matchingUserCandidates, _standardizeMatchingCandidate);

  const foundUserId = _findMatchingCandidateId(
    standardizedMatchingUserCandidates,
    standardizedUser,
    STRICT_MATCH_RATIO
  );
  return (
    foundUserId || _findMatchingCandidateId(standardizedMatchingUserCandidates, standardizedUser, MAX_ACCEPTABLE_RATIO)
  );
}

async function findMatchingSupOrganizationLearnerIdForGivenOrganizationIdAndUser({
  organizationId,
  reconciliationInfo: { studentNumber, firstName, lastName, birthdate },
  supOrganizationLearnerRepository
}: $TSFixMe) {
  const organizationLearner = await supOrganizationLearnerRepository.findOneByStudentNumberAndBirthdate({
    organizationId,
    studentNumber,
    birthdate,
  });

  if (!organizationLearner) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError('There are no organization learners found');
  }

  const organizationLearnerId = findMatchingCandidateIdForGivenUser([organizationLearner], { firstName, lastName });
  if (!organizationLearnerId) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError('There were no organizationLearners matching with names');
  }

  if (!_.isNil(organizationLearner.userId)) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
    throw new OrganizationLearnerAlreadyLinkedToUserError();
  }
  return organizationLearner;
}

async function findMatchingOrganizationLearnerIdForGivenOrganizationIdAndUser({
  organizationId,
  reconciliationInfo: { firstName, lastName, birthdate },
  organizationLearnerRepository
}: $TSFixMe) {
  const organizationLearners = await organizationLearnerRepository.findByOrganizationIdAndBirthdate({
    organizationId,
    birthdate,
  });

  if (_.isEmpty(organizationLearners)) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError('There are no organization learners found');
  }

  const organizationLearnerId = findMatchingCandidateIdForGivenUser(organizationLearners, { firstName, lastName });
  if (!organizationLearnerId) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError('There were no organizationLearners matching with names');
  }

  return _.find(organizationLearners, { id: organizationLearnerId });
}

async function checkIfStudentHasAnAlreadyReconciledAccount(
  organizationLearner: $TSFixMe,
  userRepository: $TSFixMe,
  obfuscationService: $TSFixMe,
  studentRepository: $TSFixMe
) {
  if (!_.isNil(organizationLearner.userId)) {
    await _buildStudentReconciliationError(
      organizationLearner.userId,
      'IN_SAME_ORGANIZATION',
      userRepository,
      obfuscationService
    );
  }

  const student = await studentRepository.getReconciledStudentByNationalStudentId(
    organizationLearner.nationalStudentId
  );
  if (_.get(student, 'account')) {
    await _buildStudentReconciliationError(
      student.account.userId,
      'IN_OTHER_ORGANIZATION',
      userRepository,
      obfuscationService
    );
  }
}

async function _buildStudentReconciliationError(userId: $TSFixMe, errorContext: $TSFixMe, userRepository: $TSFixMe, obfuscationService: $TSFixMe) {
  const user = await userRepository.getForObfuscation(userId);
  let authenticationMethod;
  try {
    authenticationMethod = await obfuscationService.getUserAuthenticationMethodWithObfuscation(user);
  } catch (error) {
    throw new OrganizationLearnerAlreadyLinkedToInvalidUserError();
  }

  const detailWhenSameOrganization = 'Un compte existe déjà pour l‘élève dans le même établissement.';
  const detailWhenOtherOrganization = 'Un compte existe déjà pour l‘élève dans un autre établissement.';
  const detail = errorContext === 'IN_SAME_ORGANIZATION' ? detailWhenSameOrganization : detailWhenOtherOrganization;
  const error = STUDENT_RECONCILIATION_ERRORS.RECONCILIATION[errorContext][authenticationMethod.authenticatedBy];
  const meta = {
    shortCode: error.shortCode,
    value: authenticationMethod.value,
    userId: userId,
  };
  throw new OrganizationLearnerAlreadyLinkedToUserError(detail, error.code, meta);
}

function _containsOneElement(arr: $TSFixMe) {
  return _.size(arr) === 1;
}

function _standardizeUser(reconciliationInfo: $TSFixMe) {
  return _(reconciliationInfo).pick(['firstName', 'lastName']).mapValues(_standardize).value();
}

function _standardizeMatchingCandidate(matchingUserCandidate: $TSFixMe) {
  return _(matchingUserCandidate)
    .pick(['id', 'firstName', 'middleName', 'thirdName', 'lastName', 'preferredLastName'])
    .mapValues(_standardize)
    .value();
}

function _standardize(propToStandardize: $TSFixMe) {
  return _.isString(propToStandardize)
    ? pipe(normalizeAndRemoveAccents, removeSpecialCharacters)(propToStandardize)
    : propToStandardize;
}

function _findMatchingCandidateId(standardizedMatchingUserCandidates: $TSFixMe, standardizedUser: $TSFixMe, maxAcceptableRatio: $TSFixMe) {
  return (
    _(['firstName', 'middleName', 'thirdName'])
      .map(_findCandidatesMatchingWithUser(standardizedMatchingUserCandidates, standardizedUser, maxAcceptableRatio))
      .filter(_containsOneElement)
      .flatten()
      .map('id')
      .first() || null
  );
}

// A given name refers to either a first name, middle name or third name
function _findCandidatesMatchingWithUser(matchingUserCandidatesStandardized: $TSFixMe, standardizedUser: $TSFixMe, maxAcceptableRatio: $TSFixMe) {
  return (candidateGivenName: $TSFixMe) => matchingUserCandidatesStandardized
    .filter(_candidateHasSimilarFirstName(standardizedUser, candidateGivenName, maxAcceptableRatio))
    .filter(_candidateHasSimilarLastName(standardizedUser, maxAcceptableRatio));
}

function _candidateHasSimilarFirstName(
  // @ts-expect-error TS(7031): Binding element 'userFirstName' implicitly has an ... Remove this comment to see the full error message
  { firstName: userFirstName },
  candidateGivenName: $TSFixMe,
  maxAcceptableRatio = MAX_ACCEPTABLE_RATIO
) {
  return (candidate: $TSFixMe) => candidate[candidateGivenName] &&
  areTwoStringsCloseEnough(userFirstName, candidate[candidateGivenName], maxAcceptableRatio);
}

function _candidateHasSimilarLastName({
  lastName
}: $TSFixMe, maxAcceptableRatio = MAX_ACCEPTABLE_RATIO) {
  return (candidate: $TSFixMe) => {
    const candidatesLastName = [candidate.lastName, candidate.preferredLastName].filter(
      (candidateLastName) => candidateLastName
    );
    return isOneStringCloseEnoughFromMultipleStrings(lastName, candidatesLastName, maxAcceptableRatio);
  };
}

// TODO Export all functions generating random codes to an appropriate service
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_generateC... Remove this comment to see the full error message
const _generateCode = () => {
  return randomString.generate({ length: 4, charset: 'numeric' });
};

async function generateUsernameUntilAvailable({
  firstPart,
  secondPart,
  userRepository
}: $TSFixMe) {
  let randomPart = secondPart;

  let username;
  let isUsernameAvailable;

  do {
    username = firstPart + randomPart;
    isUsernameAvailable = true;

    try {
      await userRepository.isUsernameAvailable(username);
    } catch (error) {
      if (error instanceof AlreadyRegisteredUsernameError) {
        isUsernameAvailable = false;
        randomPart = _generateCode();
      } else {
        throw error;
      }
    }
  } while (!isUsernameAvailable);

  return username;
}

async function createUsernameByUser({
  user: { firstName, lastName, birthdate },
  userRepository
}: $TSFixMe) {
  const standardizeUser = _standardizeUser({ firstName, lastName });
  const [, month, day] = birthdate.split('-');

  const firstPart = standardizeUser.firstName + '.' + standardizeUser.lastName;
  const secondPart = day + month;

  return await generateUsernameUntilAvailable({ firstPart, secondPart, userRepository });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  generateUsernameUntilAvailable,
  createUsernameByUser,
  findMatchingCandidateIdForGivenUser,
  findMatchingSupOrganizationLearnerIdForGivenOrganizationIdAndUser,
  findMatchingOrganizationLearnerIdForGivenOrganizationIdAndUser,
  checkIfStudentHasAnAlreadyReconciledAccount,
};
