// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isNil'.
const isNil = require('lodash/isNil');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
  AlreadyRegisteredEmailError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
  AlreadyRegisteredUsernameError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignCo... Remove this comment to see the full error message
  CampaignCodeError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
  EntityValidationError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationLearnerAlreadyLinkedToUserError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require('../models/User');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'passwordVa... Remove this comment to see the full error message
const passwordValidator = require('../validators/password-validator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userValida... Remove this comment to see the full error message
const userValidator = require('../validators/user-validator');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getCampaig... Remove this comment to see the full error message
const { getCampaignUrl } = require('../../infrastructure/utils/url-builder');

function _encryptPassword(userPassword: $TSFixMe, encryptionService: $TSFixMe) {
  const encryptedPassword = encryptionService.hashPassword(userPassword);

  if (encryptedPassword === userPassword) {
    throw new Error('Erreur lors de l‘encryption du mot passe de l‘utilisateur');
  }

  return encryptedPassword;
}

function _createDomainUser(userAttributes: $TSFixMe) {
  return new User({
    firstName: userAttributes.firstName,
    lastName: userAttributes.lastName,
    email: userAttributes.email,
    username: userAttributes.username,
    cgu: false,
  });
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _manageEmailAvailabilityError(error: $TSFixMe) {
  return _manageError(
    error,
    AlreadyRegisteredEmailError,
    'email',
    'Cette adresse e-mail est déjà enregistrée, connectez-vous.'
  );
}

function _manageUsernameAvailabilityError(error: $TSFixMe) {
  return _manageError(
    error,
    AlreadyRegisteredUsernameError,
    'username',
    'Cet identifiant n’est plus disponible, merci de recharger la page.'
  );
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _manageError(error: $TSFixMe, errorType: $TSFixMe, attribute: $TSFixMe, message: $TSFixMe) {
  if (error instanceof errorType) {
    throw new EntityValidationError({
      invalidAttributes: [{ attribute, message }],
    });
  }
  throw error;
}

function _emptyOtherMode(isUsernameMode: $TSFixMe, userAttributes: $TSFixMe) {
  return isUsernameMode ? { ...userAttributes, email: undefined } : { ...userAttributes, username: undefined };
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _validatePassword(password: $TSFixMe) {
  let result;
  try {
    passwordValidator.validate(password);
  } catch (err) {
    result = err;
  }
  return result;
}

// @ts-expect-error TS(2393): Duplicate function implementation.
async function _validateData({
  isUsernameMode,
  password,
  userAttributes,
  userRepository
}: $TSFixMe) {
  const validationErrors = [];

  try {
    userValidator.validate({ user: userAttributes, cguRequired: false });
  } catch (err) {
    validationErrors.push(err);
  }

  validationErrors.push(_validatePassword(password));

  if (isUsernameMode) {
    try {
      await userRepository.isUsernameAvailable(userAttributes.username);
    } catch (err) {
      validationErrors.push(_manageUsernameAvailabilityError(err));
    }
  } else {
    try {
      await userRepository.checkIfEmailIsAvailable(userAttributes.email);
    } catch (err) {
      validationErrors.push(_manageEmailAvailabilityError(err));
    }
  }

  const relevantErrors = validationErrors.filter((error) => error instanceof Error);
  if (relevantErrors.length > 0) {
    throw EntityValidationError.fromMultipleEntityValidationErrors(relevantErrors);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createAndReconcileUserToOrganizationLearner({
  campaignCode,
  locale,
  password,
  userAttributes,
  authenticationMethodRepository,
  campaignRepository,
  organizationLearnerRepository,
  userRepository,
  userToCreateRepository,
  encryptionService,
  mailService,
  obfuscationService,
  userReconciliationService,
  userService
}: $TSFixMe) {
  const campaign = await campaignRepository.getByCode(campaignCode);
  if (!campaign) {
    throw new CampaignCodeError();
  }

  const matchedOrganizationLearner =
    await userReconciliationService.findMatchingOrganizationLearnerIdForGivenOrganizationIdAndUser({
      organizationId: campaign.organizationId,
      reconciliationInfo: userAttributes,
      organizationLearnerRepository,
      userRepository,
      obfuscationService,
    });

  if (!isNil(matchedOrganizationLearner.userId)) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new OrganizationLearnerAlreadyLinkedToUserError(
      'Un compte existe déjà pour l‘élève dans le même établissement.'
    );
  }

  const isUsernameMode = userAttributes.withUsername;
  const cleanedUserAttributes = _emptyOtherMode(isUsernameMode, userAttributes);

  await _validateData({
    isUsernameMode,
    password,
    userAttributes: cleanedUserAttributes,
    userRepository,
  });

  const hashedPassword = await _encryptPassword(password, encryptionService);
  const domainUser = _createDomainUser(cleanedUserAttributes);

  const userId = await userService.createAndReconcileUserToOrganizationLearner({
    hashedPassword,
    organizationLearnerId: matchedOrganizationLearner.id,
    user: domainUser,
    authenticationMethodRepository,
    organizationLearnerRepository,
    userToCreateRepository,
  });

  const createdUser = await userRepository.get(userId);
  if (!isUsernameMode) {
    const redirectionUrl = getCampaignUrl(locale, campaignCode);
    await mailService.sendAccountCreationEmail(createdUser.email, locale, redirectionUrl);
  }
  return createdUser;
};
