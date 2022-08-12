// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'passwordVa... Remove this comment to see the full error message
const passwordValidator = require('../../../../lib/domain/validators/password-validator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userValida... Remove this comment to see the full error message
const userValidator = require('../../../../lib/domain/validators/user-validator');

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
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
  NotFoundError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | create-and-reconcile-user-to-organization-learner', function () {
  const organizationId = 1;
  const organizationLearnerId = 1;
  const password = 'P@ssw0rd';
  const locale = 'fr-fr';

  let campaignCode: $TSFixMe;
  let userAttributes: $TSFixMe;

  let authenticationMethodRepository: $TSFixMe;
  let campaignRepository: $TSFixMe;
  let organizationLearnerRepository: $TSFixMe;
  let userRepository: $TSFixMe;

  let encryptionService: $TSFixMe;
  let mailService: $TSFixMe;
  let obfuscationService: $TSFixMe;
  let userReconciliationService: $TSFixMe;
  let userService: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    campaignCode = 'ABCD12';
    userAttributes = {
      firstName: 'Joe',
      lastName: 'Poe',
      birthdate: '1992-02-02',
    };

    authenticationMethodRepository = {};
    campaignRepository = {
      getByCode: sinon.stub(),
    };
    organizationLearnerRepository = {};
    userRepository = {
      create: sinon.stub(),
      checkIfEmailIsAvailable: sinon.stub(),
      isUsernameAvailable: sinon.stub(),
      get: sinon.stub(),
    };

    encryptionService = {
      hashPassword: sinon.stub(),
    };
    mailService = {
      sendAccountCreationEmail: sinon.stub(),
    };
    userReconciliationService = {
      findMatchingOrganizationLearnerIdForGivenOrganizationIdAndUser: sinon.stub(),
    };
    userService = {
      createAndReconcileUserToOrganizationLearner: sinon.stub(),
    };

    sinon.stub(passwordValidator, 'validate');
    sinon.stub(userValidator, 'validate');

    campaignRepository.getByCode
      .withArgs(campaignCode)
      .resolves(domainBuilder.buildCampaign({ organization: { id: organizationId } }));
    userRepository.isUsernameAvailable.resolves();
    userRepository.checkIfEmailIsAvailable.resolves();

    mailService.sendAccountCreationEmail.resolves();

    passwordValidator.validate.returns();
    userValidator.validate.returns();
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When there is no campaign with the given code', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a campaign code error', async function () {
      // given
      campaignRepository.getByCode.withArgs(campaignCode).resolves(null);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(usecases.createAndReconcileUserToOrganizationLearner)({
        campaignCode,
        locale,
        password,
        userAttributes,
        authenticationMethodRepository,
        campaignRepository,
        organizationLearnerRepository,
        userRepository,
        encryptionService,
        mailService,
        obfuscationService,
        userReconciliationService,
        userService,
      });

      // then
      expect(result).to.be.instanceof(CampaignCodeError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When no organizationLearner found', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a Not Found error', async function () {
      // given
      userReconciliationService.findMatchingOrganizationLearnerIdForGivenOrganizationIdAndUser.throws(
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
        new NotFoundError('Error message')
      );

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(usecases.createAndReconcileUserToOrganizationLearner)({
        campaignCode,
        locale,
        password,
        userAttributes,
        authenticationMethodRepository,
        campaignRepository,
        organizationLearnerRepository,
        userRepository,
        encryptionService,
        mailService,
        obfuscationService,
        userReconciliationService,
        userService,
      });

      // then
      expect(result).to.be.instanceof(NotFoundError);
      expect((result as $TSFixMe).message).to.equal('Error message');
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When one organizationLearner matched on names', function () {
    const encryptedPassword = 'P@ssw0rd3ncryp73d';
    let createdUser: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      createdUser = domainBuilder.buildUser();

      userReconciliationService.findMatchingOrganizationLearnerIdForGivenOrganizationIdAndUser.resolves(
        organizationLearnerId
      );
      encryptionService.hashPassword.resolves(encryptedPassword);

      userService.createAndReconcileUserToOrganizationLearner.resolves(createdUser.id);
      userRepository.get.withArgs(createdUser.id).resolves(createdUser);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When creation is with email', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        userAttributes.email = createdUser.email;
        userAttributes.withUsername = false;
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('When fields are not valid', function () {
        const userInvalidAttribute = {
          attribute: 'firstName',
          message: 'Votre prénom n’est pas renseigné.',
        };
        const passwordInvalidAttribute = {
          attribute: 'password',
          message: 'Votre mot de passe n’est pas renseigné.',
        };

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw EntityValidationError', async function () {
          // given
          userValidator.validate.throws(
            new EntityValidationError({
              invalidAttributes: [userInvalidAttribute],
            })
          );
          passwordValidator.validate.throws(
            new EntityValidationError({
              invalidAttributes: [passwordInvalidAttribute],
            })
          );

          const expectedInvalidAttributes = [userInvalidAttribute, passwordInvalidAttribute];

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(usecases.createAndReconcileUserToOrganizationLearner)({
            campaignCode,
            locale,
            password,
            userAttributes,
            authenticationMethodRepository,
            campaignRepository,
            organizationLearnerRepository,
            userRepository,
            encryptionService,
            mailService,
            obfuscationService,
            userReconciliationService,
            userService,
          });

          // then
          expect(error).to.be.instanceOf(EntityValidationError);
          expect((error as $TSFixMe).invalidAttributes).to.deep.equal(expectedInvalidAttributes);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('When email is not available', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw EntityValidationError', async function () {
          // given
          userRepository.checkIfEmailIsAvailable.rejects(new AlreadyRegisteredEmailError());

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(usecases.createAndReconcileUserToOrganizationLearner)({
            campaignCode,
            locale,
            password,
            userAttributes,
            authenticationMethodRepository,
            campaignRepository,
            organizationLearnerRepository,
            userRepository,
            encryptionService,
            mailService,
            obfuscationService,
            userReconciliationService,
            userService,
          });

          // then
          expect(error).to.be.instanceOf(EntityValidationError);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('When email is available', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          userRepository.get.resolves(createdUser);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should create user and associate organizationLearner', async function () {
          // when
          const result = await usecases.createAndReconcileUserToOrganizationLearner({
            campaignCode,
            locale,
            password,
            userAttributes,
            authenticationMethodRepository,
            campaignRepository,
            organizationLearnerRepository,
            userRepository,
            encryptionService,
            mailService,
            obfuscationService,
            userReconciliationService,
            userService,
          });

          // then
          expect(result).to.deep.equal(createdUser);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should call mailService', async function () {
          // given
          const expectedRedirectionUrl = `https://app.pix.fr/campagnes/${campaignCode}`;

          // when
          await usecases.createAndReconcileUserToOrganizationLearner({
            campaignCode,
            locale,
            password,
            userAttributes,
            authenticationMethodRepository,
            campaignRepository,
            organizationLearnerRepository,
            userRepository,
            encryptionService,
            mailService,
            obfuscationService,
            userReconciliationService,
            userService,
          });

          // then
          expect(mailService.sendAccountCreationEmail).to.have.been.calledWith(
            userAttributes.email,
            locale,
            expectedRedirectionUrl
          );
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('But association is already done', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should nor create nor associate organizationLearner', async function () {
            // given
            userService.createAndReconcileUserToOrganizationLearner.throws(
              // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
              new OrganizationLearnerAlreadyLinkedToUserError()
            );

            // when
            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const error = await catchErr(usecases.createAndReconcileUserToOrganizationLearner)({
              campaignCode,
              locale,
              password,
              userAttributes,
              authenticationMethodRepository,
              campaignRepository,
              organizationLearnerRepository,
              userRepository,
              encryptionService,
              mailService,
              obfuscationService,
              userReconciliationService,
              userService,
            });

            // then
            expect(error).to.be.instanceOf(OrganizationLearnerAlreadyLinkedToUserError);
          });
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When creation is with username', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        userAttributes.username = 'joepoe';
        userAttributes.withUsername = true;
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('When username is not available', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw EntityValidationError', async function () {
          // given
          userRepository.isUsernameAvailable.rejects(new AlreadyRegisteredUsernameError());

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(usecases.createAndReconcileUserToOrganizationLearner)({
            campaignCode,
            locale,
            password,
            userAttributes,
            authenticationMethodRepository,
            campaignRepository,
            organizationLearnerRepository,
            userRepository,
            encryptionService,
            mailService,
            obfuscationService,
            userReconciliationService,
            userService,
          });

          // then
          expect(error).to.be.instanceOf(EntityValidationError);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('When username is available', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should create user and associate organizationLearner', async function () {
          // when
          const result = await usecases.createAndReconcileUserToOrganizationLearner({
            campaignCode,
            locale,
            password,
            userAttributes,
            authenticationMethodRepository,
            campaignRepository,
            organizationLearnerRepository,
            userRepository,
            encryptionService,
            mailService,
            obfuscationService,
            userReconciliationService,
            userService,
          });

          // then
          expect(result).to.deep.equal(createdUser);
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('But association is already done', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should nor create nor associate organizationLearner', async function () {
            // given
            userService.createAndReconcileUserToOrganizationLearner.throws(
              // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
              new OrganizationLearnerAlreadyLinkedToUserError()
            );

            // when
            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const error = await catchErr(usecases.createAndReconcileUserToOrganizationLearner)({
              campaignCode,
              locale,
              password,
              userAttributes,
              authenticationMethodRepository,
              campaignRepository,
              organizationLearnerRepository,
              userRepository,
              encryptionService,
              mailService,
              obfuscationService,
              userReconciliationService,
              userService,
            });

            // then
            expect(error).to.be.instanceOf(OrganizationLearnerAlreadyLinkedToUserError);
          });
        });
      });
    });
  });
});
