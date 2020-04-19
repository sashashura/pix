const { AlreadyRegisteredEmailError, InvalidRecaptchaTokenError, EntityValidationError } = require('../errors');
const User = require('../models/User');

const userValidator = require('../validators/user-validator');

function  _manageEmailAvailabilityError(error) {
  return _manageError(error, AlreadyRegisteredEmailError, 'email', 'Cette adresse e-mail est déjà enregistrée, connectez-vous.');
}

function  _manageReCaptchaTokenError(error) {
  return _manageError(error, InvalidRecaptchaTokenError, 'recaptchaToken', 'Merci de cocher la case ci-dessous :');
}

function _manageError(error, errorType, attribute, message) {
  if (error instanceof errorType) {
    return new EntityValidationError({
      invalidAttributes: [{ attribute, message }]
    });
  }

  throw error;
}

async function _validateData(user, reCaptchaToken, userRepository, userValidator, reCaptchaValidator) {
  let userValidatorError;
  try {
    userValidator.validate({ user });
  } catch (err) {
    userValidatorError = err;
  }
  const promises = [reCaptchaValidator.verify(reCaptchaToken).catch(_manageReCaptchaTokenError)];
  if (user.email) {
    promises.push(userRepository.isEmailAvailable(user.email).catch(_manageEmailAvailabilityError));
  }

  const validationErrors = await Promise.all(promises);
  validationErrors.push(userValidatorError);

  if (validationErrors.some((error) => error instanceof Error)) {
    const relevantErrors = validationErrors.filter((error) => error instanceof Error);
    throw EntityValidationError.fromMultipleEntityValidationErrors(relevantErrors);
  }
}

function _checkEncryptedPassword(userPassword, encryptedPassword) {
  if (encryptedPassword === userPassword) {
    throw new Error('Erreur lors de l‘encryption du mot passe de l‘utilisateur');
  }

  return encryptedPassword;
}

module.exports = async function createUser({
  user,
  reCaptchaToken,
  userRepository,
  reCaptchaValidator,
  encryptionService,
  mailService,
}) {
  return _validateData(user, reCaptchaToken, userRepository, userValidator, reCaptchaValidator)
    .then(() => encryptionService.hashPassword(user.password))
    .then((encryptedPassword) => _checkEncryptedPassword(user.password, encryptedPassword))
    .then((encryptedPassword) => {
      const userWithEncryptedPassword = new User(user);
      userWithEncryptedPassword.password = encryptedPassword;
      return userWithEncryptedPassword;
    })
    .then(userRepository.create)
    .then(async (savedUser) => {
      await mailService.sendAccountCreationEmail(savedUser.email);
      return savedUser;
    });
};
