// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'pick'.
const pick = require('lodash/pick');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, databaseBuilder, expect, knex } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'authentica... Remove this comment to see the full error message
const authenticationMethodRepository = require('../../../../lib/infrastructure/repositories/authentication-method-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignRe... Remove this comment to see the full error message
const campaignRepository = require('../../../../lib/infrastructure/repositories/campaign-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationLearnerRepository = require('../../../../lib/infrastructure/repositories/organization-learner-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userReposi... Remove this comment to see the full error message
const userRepository = require('../../../../lib/infrastructure/repositories/user-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userToCrea... Remove this comment to see the full error message
const userToCreateRepository = require('../../../../lib/infrastructure/repositories/user-to-create-repository');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'encryption... Remove this comment to see the full error message
const encryptionService = require('../../../../lib/domain/services/encryption-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mailServic... Remove this comment to see the full error message
const mailService = require('../../../../lib/domain/services/mail-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'obfuscatio... Remove this comment to see the full error message
const obfuscationService = require('../../../../lib/domain/services/obfuscation-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userReconc... Remove this comment to see the full error message
const userReconciliationService = require('../../../../lib/domain/services/user-reconciliation-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userServic... Remove this comment to see the full error message
const userService = require('../../../../lib/domain/services/user-service');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignCo... Remove this comment to see the full error message
  CampaignCodeError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
  EntityValidationError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
  NotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationLearnerAlreadyLinkedToUserError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createAndR... Remove this comment to see the full error message
const createAndReconcileUserToOrganizationLearner = require('../../../../lib/domain/usecases/create-and-reconcile-user-to-organization-learner');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCases | create-and-reconcile-user-to-organization-learner', function () {
  const pickUserAttributes = ['firstName', 'lastName', 'email', 'username', 'cgu'];
  const locale = 'fr';

  let campaignCode: $TSFixMe;
  let organizationId: $TSFixMe;
  let password: $TSFixMe;
  let organizationLearner: $TSFixMe;
  let userAttributes: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When there is no campaign with the given code', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a campaign code error', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(createAndReconcileUserToOrganizationLearner)({
        campaignCode: 'NOTEXIST',
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
      expect(error).to.be.instanceof(CampaignCodeError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When no organizationLearner found', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      campaignCode = databaseBuilder.factory.buildCampaign().code;
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a Not Found error', async function () {
      // given
      userAttributes = {
        firstName: 'firstname',
        lastName: 'lastname',
        birthdate: '2008-01-01',
      };

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(createAndReconcileUserToOrganizationLearner)({
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
      expect(error).to.be.instanceof(NotFoundError);
      expect((error as $TSFixMe).message).to.equal('There are no organization learners found');
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When one organizationLearner matched on names', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      organizationId = databaseBuilder.factory.buildOrganization().id;
      campaignCode = databaseBuilder.factory.buildCampaign({
        organizationId,
      }).code;

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('authentication-methods').delete();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When association is already done', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should nor create nor associate organizationLearner', async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;
        organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
          organizationId,
          userId,
        });
        userAttributes = {
          firstName: organizationLearner.firstName,
          lastName: organizationLearner.lastName,
          birthdate: organizationLearner.birthdate,
        };

        await databaseBuilder.commit();

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(createAndReconcileUserToOrganizationLearner)({
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

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When creation is with email', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        password = 'Password123';

        organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
          organizationId,
          userId: null,
        });
        userAttributes = {
          firstName: organizationLearner.firstName,
          lastName: organizationLearner.lastName,
          birthdate: organizationLearner.birthdate,
          email: '',
        };

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('When a field is not valid', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw EntityValidationError', async function () {
          // given
          const expectedValidationError = new EntityValidationError({
            invalidAttributes: [
              {
                attribute: 'email',
                message: 'EMPTY_EMAIL',
              },
              {
                attribute: 'password',
                message: 'Votre mot de passe n’est pas renseigné.',
              },
            ],
          });

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(createAndReconcileUserToOrganizationLearner)({
            campaignCode,
            locale,
            password: '',
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
          expect((error as $TSFixMe).invalidAttributes).to.deep.equal(expectedValidationError.invalidAttributes);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('When email is not available', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw EntityValidationError', async function () {
          // given
          const email = 'user@organization.org';
          databaseBuilder.factory.buildUser({
            email,
          });
          userAttributes.email = email;

          const expectedValidationError = new EntityValidationError({
            invalidAttributes: [
              {
                attribute: 'email',
                message: 'Cette adresse e-mail est déjà enregistrée, connectez-vous.',
              },
            ],
          });

          await databaseBuilder.commit();

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(createAndReconcileUserToOrganizationLearner)({
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
          expect((error as $TSFixMe).invalidAttributes).to.deep.equal(expectedValidationError.invalidAttributes);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('When email is available', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should create user and associate organizationLearner', async function () {
          // given
          const email = 'user@organization.org';
          userAttributes.email = email;

          // when
          const result = await createAndReconcileUserToOrganizationLearner({
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
            userService,
          });

          // then
          expect(pick(result, pickUserAttributes)).to.deep.equal({
            firstName: userAttributes.firstName,
            lastName: userAttributes.lastName,
            email,
            username: null,
            cgu: false,
          });
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When creation is with username', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        password = 'Password123';

        organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
          organizationId,
          userId: null,
        });
        userAttributes = {
          firstName: organizationLearner.firstName,
          lastName: organizationLearner.lastName,
          birthdate: organizationLearner.birthdate,
          withUsername: true,
        };

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('When username is not available', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw EntityValidationError', async function () {
          // given
          const username = 'abc.def0112';
          databaseBuilder.factory.buildUser({
            username,
          });
          userAttributes.username = username;

          const expectedValidationError = new EntityValidationError({
            invalidAttributes: [
              {
                attribute: 'username',
                message: 'Cet identifiant n’est plus disponible, merci de recharger la page.',
              },
            ],
          });

          await databaseBuilder.commit();

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(createAndReconcileUserToOrganizationLearner)({
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
          expect((error as $TSFixMe).invalidAttributes).to.deep.equal(expectedValidationError.invalidAttributes);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('When username is available', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should create user and associate organizationLearner', async function () {
          // given
          const username =
            organizationLearner.firstName.toLowerCase() + '.' + organizationLearner.lastName.toLowerCase() + '0112';
          userAttributes.username = username;

          const expectedUser = {
            firstName: userAttributes.firstName,
            lastName: userAttributes.lastName,
            username,
            email: undefined,
            cgu: false,
          };

          // when
          const result = await createAndReconcileUserToOrganizationLearner({
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
            userService,
          });

          // then
          expect(pick(result, pickUserAttributes)).to.deep.equal(expectedUser);
        });
      });
    });
  });
});
