// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, expect, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
const { AlreadyRegisteredEmailError, EntityValidationError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'passwordVa... Remove this comment to see the full error message
const passwordValidator = require('../../../../lib/domain/validators/password-validator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userValida... Remove this comment to see the full error message
const userValidator = require('../../../../lib/domain/validators/user-validator');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require('../../../../lib/domain/models/User');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const createUser = require('../../../../lib/domain/usecases/create-user');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | create-user', function () {
  const userId = 123;
  const userEmail = 'test@example.net';
  const password = 'Password123';
  const user = new User({ email: userEmail });
  const hashedPassword = 'ABCDEF1234';
  const locale = 'fr-fr';
  const savedUser = new User({ id: userId, email: userEmail });

  let campaignCode: $TSFixMe;
  let authenticationMethodRepository: $TSFixMe;
  let userRepository: $TSFixMe;
  let userToCreateRepository: $TSFixMe;
  let campaignRepository: $TSFixMe;
  let encryptionService: $TSFixMe;
  let mailService: $TSFixMe;
  let userService: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    authenticationMethodRepository = {};
    userRepository = {
      checkIfEmailIsAvailable: sinon.stub(),
    };
    userToCreateRepository = {
      create: sinon.stub(),
    };
    campaignRepository = {
      getByCode: sinon.stub(),
    };

    encryptionService = {
      hashPassword: sinon.stub(),
    };
    mailService = {
      sendAccountCreationEmail: sinon.stub(),
    };
    userService = {
      createUserWithPassword: sinon.stub(),
    };

    sinon.stub(userValidator, 'validate');
    sinon.stub(passwordValidator, 'validate');

    userRepository.checkIfEmailIsAvailable.resolves();
    userToCreateRepository.create.resolves(savedUser);

    userValidator.validate.returns();
    passwordValidator.validate.returns();

    encryptionService.hashPassword.resolves(hashedPassword);
    mailService.sendAccountCreationEmail.resolves();
    userService.createUserWithPassword.resolves(savedUser);

    campaignCode = 'AZERTY123';
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('step validation of data', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should check the non existence of email in UserRepository', async function () {
      // given
      userRepository.checkIfEmailIsAvailable.resolves();

      // when
      await createUser({
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
        userService,
      });

      // then
      expect(userRepository.checkIfEmailIsAvailable).to.have.been.calledWith(userEmail);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should validate the user', async function () {
      // when
      await createUser({
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
        userService,
      });

      //then
      expect(userValidator.validate).to.have.been.calledWith({ user });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should validate the password', async function () {
      // when
      await createUser({
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
        userService,
      });

      // then
      expect(passwordValidator.validate).to.have.been.calledWith(password);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user email is already used', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject with an error EntityValidationError on email already registered', async function () {
        // given
        const emailExistError = new AlreadyRegisteredEmailError('email already exists');
        const expectedValidationError = new EntityValidationError({
          invalidAttributes: [
            {
              attribute: 'email',
              message: 'ALREADY_REGISTERED_EMAIL',
            },
          ],
        });

        userRepository.checkIfEmailIsAvailable.rejects(emailExistError);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(createUser)({
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
          userService,
        });

        // then
        expect(error).to.be.instanceOf(EntityValidationError);
        expect((error as $TSFixMe).invalidAttributes).to.deep.equal(expectedValidationError.invalidAttributes);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user validator fails', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject with an error EntityValidationError containing the entityValidationError', async function () {
        // given
        const expectedValidationError = new EntityValidationError({
          invalidAttributes: [
            {
              attribute: 'firstName',
              message: 'Votre prénom n’est pas renseigné.',
            },
            {
              attribute: 'password',
              message: 'Votre mot de passe n’est pas renseigné.',
            },
          ],
        });

        userValidator.validate.throws(expectedValidationError);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(createUser)({
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
          userService,
        });

        // then
        expect(error).to.be.instanceOf(EntityValidationError);
        expect((error as $TSFixMe).invalidAttributes).to.deep.equal(expectedValidationError.invalidAttributes);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user email is already in use, user validator fails', function () {
      const entityValidationError = new EntityValidationError({
        invalidAttributes: [
          {
            attribute: 'firstName',
            message: 'Votre prénom n’est pas renseigné.',
          },
          {
            attribute: 'password',
            message: 'Votre mot de passe n’est pas renseigné.',
          },
        ],
      });
      const emailExistError = new AlreadyRegisteredEmailError('email already exists');

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject with an error EntityValidationError containing the entityValidationError and the AlreadyRegisteredEmailError', async function () {
        // given
        userRepository.checkIfEmailIsAvailable.rejects(emailExistError);
        userValidator.validate.throws(entityValidationError);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(createUser)({
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
          userService,
        });

        // then
        expect(error).to.be.instanceOf(EntityValidationError);
        expect((error as $TSFixMe).invalidAttributes).to.have.lengthOf(3);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has accepted terms of service', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should update the validation date', async function () {
        // given
        const user = new User({
          email: userEmail,
          cgu: true,
        });

        // when
        await createUser({
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
          userService,
        });

        // then
        expect(user.lastTermsOfServiceValidatedAt).to.be.an.instanceOf(Date);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has not accepted terms of service', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not update the validation date', async function () {
        // given
        const user = new User({
          email: userEmail,
          cgu: false,
        });

        // when
        await createUser({
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
          userService,
        });

        // then
        expect(user.lastTermsOfServiceValidatedAt).not.to.be.an.instanceOf(Date);
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context("when user's email is not defined", function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not check the absence of email in UserRepository', async function () {
      // given
      const user = { email: null };

      // when
      await createUser({
        user,
        password,
        campaignCode,
        locale,
        authenticationMethodRepository,
        campaignRepository,
        userRepository,
        encryptionService,
        mailService,
        userService,
      });

      // then
      expect(userRepository.checkIfEmailIsAvailable).to.not.have.been.called;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user is valid', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('step hash password and save user', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should encrypt the password', async function () {
        // when
        await createUser({
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
          userService,
        });

        // then
        expect(encryptionService.hashPassword).to.have.been.calledWith(password);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw Error when hash password function fails', async function () {
        // given
        encryptionService.hashPassword.rejects(new Error());

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(createUser)({
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
          userService,
        });

        // then
        expect(error).to.be.instanceOf(Error);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should save the user with a properly encrypted password', async function () {
        // when
        await createUser({
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
          userService,
        });

        // then
        expect(userService.createUserWithPassword).to.have.been.calledWith({
          user,
          hashedPassword,
          userToCreateRepository,
          authenticationMethodRepository,
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('step send account creation email to user', function () {
      const user = new User({ email: userEmail });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should send the account creation email', async function () {
        // given
        campaignRepository.getByCode.resolves({ organizationId: 1 });
        const expectedRedirectionUrl = `https://app.pix.fr/campagnes/${campaignCode}`;

        // when
        await createUser({
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
          userService,
        });

        // then
        expect(mailService.sendAccountCreationEmail).to.have.been.calledWith(userEmail, locale, expectedRedirectionUrl);
      });

      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('when campaignCode is null', function () {
        campaignCode = null;

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should send the account creation email with null redirectionUrl', async function () {
          // given
          const expectedRedirectionUrl = null;

          // when
          await createUser({
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
            userService,
          });

          // then
          expect(mailService.sendAccountCreationEmail).to.have.been.calledWith(
            userEmail,
            locale,
            expectedRedirectionUrl
          );
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('when campaignCode is not valid', function () {
        campaignCode = 'NOT-VALID';

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should send the account creation email with null redirectionUrl', async function () {
          // given
          const expectedRedirectionUrl = null;
          campaignRepository.getByCode.resolves(null);

          // when
          await createUser({
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
            userService,
          });

          // then
          expect(mailService.sendAccountCreationEmail).to.have.been.calledWith(
            userEmail,
            locale,
            expectedRedirectionUrl
          );
        });
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return saved user', async function () {
      // when
      const createdUser = await createUser({
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
        userService,
      });

      // then
      expect(createdUser).to.deep.equal(savedUser);
    });
  });
});
