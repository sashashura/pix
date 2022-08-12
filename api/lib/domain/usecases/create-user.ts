// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
const { AlreadyRegisteredEmailError, EntityValidationError } = require('../errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userValida... Remove this comment to see the full error message
const userValidator = require('../validators/user-validator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'passwordVa... Remove this comment to see the full error message
const passwordValidator = require('../validators/password-validator');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getCampaig... Remove this comment to see the full error message
const { getCampaignUrl } = require('../../infrastructure/utils/url-builder');

function _manageEmailAvailabilityError(error: $TSFixMe) {
  return _manageError(error, AlreadyRegisteredEmailError, 'email', 'ALREADY_REGISTERED_EMAIL');
}

function _manageError(error: $TSFixMe, errorType: $TSFixMe, attribute: $TSFixMe, message: $TSFixMe) {
  if (error instanceof errorType) {
    return new EntityValidationError({
      invalidAttributes: [{ attribute, message }],
    });
  }
  throw error;
}

function _validatePassword(password: $TSFixMe) {
  let result;
  try {
    passwordValidator.validate(password);
  } catch (err) {
    result = err;
  }
  return result;
}

async function _validateData({
  password,
  user,
  userRepository
}: $TSFixMe) {
  let userValidatorError;
  try {
    userValidator.validate({ user });
  } catch (err) {
    userValidatorError = err;
  }

  const passwordValidatorError = _validatePassword(password);

  const validationErrors = [];
  if (user.email) {
    validationErrors.push(
      await userRepository.checkIfEmailIsAvailable(user.email).catch(_manageEmailAvailabilityError)
    );
  }
  validationErrors.push(userValidatorError);
  validationErrors.push(passwordValidatorError);

  if (validationErrors.some((error) => error instanceof Error)) {
    const relevantErrors = validationErrors.filter((error) => error instanceof Error);
    throw EntityValidationError.fromMultipleEntityValidationErrors(relevantErrors);
  }

  return true;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createUser({
  user,
  password,
  campaignCode,
  locale,
  authenticationMethodRepository,
  campaignRepository,
  userRepository,
  userToCreateRepository,
  encryptionService,
  mailService,
  userService
}: $TSFixMe) {
  const isValid = await _validateData({
    password,
    user,
    userRepository,
  });

  const userHasValidatedPixTermsOfService = user.cgu === true;
  if (userHasValidatedPixTermsOfService) {
    user.lastTermsOfServiceValidatedAt = new Date();
  }

  if (isValid) {
    const hashedPassword = await encryptionService.hashPassword(password);

    const savedUser = await userService.createUserWithPassword({
      user,
      hashedPassword,
      userToCreateRepository,
      authenticationMethodRepository,
    });

    let redirectionUrl = null;

    if (campaignCode) {
      const campaign = await campaignRepository.getByCode(campaignCode);
      if (campaign) {
        redirectionUrl = getCampaignUrl(locale, campaignCode);
      }
    }

    await mailService.sendAccountCreationEmail(savedUser.email, locale, redirectionUrl);

    return savedUser;
  }
};
