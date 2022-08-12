// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, databaseBuilder, expect, knex } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignRe... Remove this comment to see the full error message
const campaignRepository = require('../../../../lib/infrastructure/repositories/campaign-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationLearnerRepository = require('../../../../lib/infrastructure/repositories/organization-learner-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userReposi... Remove this comment to see the full error message
const userRepository = require('../../../../lib/infrastructure/repositories/user-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userToCrea... Remove this comment to see the full error message
const userToCreateRepository = require('../../../../lib/infrastructure/repositories/user-to-create-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'studentRep... Remove this comment to see the full error message
const studentRepository = require('../../../../lib/infrastructure/repositories/student-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'authentica... Remove this comment to see the full error message
const authenticationMethodRepository = require('../../../../lib/infrastructure/repositories/authentication-method-repository');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'obfuscatio... Remove this comment to see the full error message
const obfuscationService = require('../../../../lib/domain/services/obfuscation-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('../../../../lib/domain/services/token-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userReconc... Remove this comment to see the full error message
const userReconciliationService = require('../../../../lib/domain/services/user-reconciliation-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userServic... Remove this comment to see the full error message
const userService = require('../../../../lib/domain/services/user-service');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../../../lib/domain/models/AuthenticationMethod');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignCo... Remove this comment to see the full error message
  CampaignCodeError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
  NotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ObjectVali... Remove this comment to see the full error message
  ObjectValidationError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationLearnerAlreadyLinkedToUserError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const createUserAndReconcileToOrganizationLearnerByExternalUser = require('../../../../lib/domain/usecases/create-user-and-reconcile-to-organization-learner-from-external-user');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCases | create-user-and-reconcile-to-organization-learner-from-external-user', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When there is no campaign with the given code', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a campaign code error', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(createUserAndReconcileToOrganizationLearnerByExternalUser)({
        campaignCode: 'NOTEXIST',
        campaignRepository,
      });

      // then
      expect(error).to.be.instanceof(CampaignCodeError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When the token is invalid', function () {
    let campaignCode: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      campaignCode = databaseBuilder.factory.buildCampaign().code;
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When the firstName is empty', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an ObjectValidationError', async function () {
        // given
        const externalUser = {
          lastName: 'Jackson',
          samlId: 'samlId',
        };
        const token = tokenService.createIdTokenForUserReconciliation(externalUser);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(createUserAndReconcileToOrganizationLearnerByExternalUser)({
          campaignCode,
          token,
          tokenService,
          campaignRepository,
        });

        // then
        expect(error).to.be.instanceof(ObjectValidationError);
        expect((error as $TSFixMe).message).to.eq('Missing claim(s) in IdToken');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When the lastName is empty', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an ObjectValidationError', async function () {
        // given
        const externalUser = {
          firstName: 'Saml',
          samlId: 'samlId',
        };
        const token = tokenService.createIdTokenForUserReconciliation(externalUser);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(createUserAndReconcileToOrganizationLearnerByExternalUser)({
          campaignCode,
          token,
          tokenService,
          campaignRepository,
        });

        // then
        expect(error).to.be.instanceof(ObjectValidationError);
        expect((error as $TSFixMe).message).to.eq('Missing claim(s) in IdToken');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When the samlId is empty', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an ObjectValidationError', async function () {
        // given
        const externalUser = {
          firstName: 'Saml',
          lastName: 'Jackson',
        };
        const token = tokenService.createIdTokenForUserReconciliation(externalUser);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(createUserAndReconcileToOrganizationLearnerByExternalUser)({
          campaignCode,
          token,
          tokenService,
          campaignRepository,
        });

        // then
        expect(error).to.be.instanceof(ObjectValidationError);
        expect((error as $TSFixMe).message).to.eq('Missing claim(s) in IdToken');
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When no organizationLearner is found', function () {
    let campaignCode: $TSFixMe;
    let token: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      campaignCode = databaseBuilder.factory.buildCampaign().code;
      await databaseBuilder.commit();
      const externalUser = {
        firstName: 'Saml',
        lastName: 'Jackson',
        samlId: 'samlId',
      };
      token = tokenService.createIdTokenForUserReconciliation(externalUser);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a Not Found error', async function () {
      // given
      const birthdate = '2008-01-01';

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(createUserAndReconcileToOrganizationLearnerByExternalUser)({
        birthdate,
        campaignCode,
        token,
        campaignRepository,
        tokenService,
        userReconciliationService,
        organizationLearnerRepository,
      });

      // then
      expect(error).to.be.instanceof(NotFoundError);
      expect((error as $TSFixMe).message).to.equal('There are no organization learners found');
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When an organizationLearner match the token data and birthdate', function () {
    const firstName = 'Saml';
    const lastName = 'Jackson';
    const samlId = 'SamlId';

    let campaignCode: $TSFixMe;
    let organizationId: $TSFixMe;
    let token: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      organizationId = databaseBuilder.factory.buildOrganization().id;
      campaignCode = databaseBuilder.factory.buildCampaign({ organizationId }).code;
      await databaseBuilder.commit();

      const externalUser = { firstName, lastName, samlId };
      token = tokenService.createIdTokenForUserReconciliation(externalUser);
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('authentication-methods').delete();
      await knex('organization-learners').delete();
      await knex('campaigns').delete();
      await knex('users').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create the external user, reconcile it and create GAR authentication method', async function () {
      // given
      const organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        firstName,
        lastName,
        organizationId,
      });
      organizationLearner.userId = undefined;
      await databaseBuilder.commit();

      const usersBefore = await knex('users');

      // when
      await createUserAndReconcileToOrganizationLearnerByExternalUser({
        birthdate: organizationLearner.birthdate,
        campaignCode,
        campaignRepository,
        token,
        obfuscationService,
        tokenService,
        userReconciliationService,
        userService,
        authenticationMethodRepository,
        organizationLearnerRepository,
        studentRepository,
        userRepository,
        userToCreateRepository,
      });

      // then
      const usersAfter = await knex('users');
      expect(usersBefore.length + 1).to.equal(usersAfter.length);

      const authenticationMethodInDB = await knex('authentication-methods');
      expect(authenticationMethodInDB[0].externalIdentifier).to.equal(samlId);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'When the external user is already reconciled by another account without samlId authentication method',
      function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw a OrganizationLearnerAlreadyLinkedToUserError', async function () {
          // given
          const organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
            firstName,
            lastName,
            organizationId,
          });
          await databaseBuilder.commit();

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(createUserAndReconcileToOrganizationLearnerByExternalUser)({
            birthdate: organizationLearner.birthdate,
            campaignCode,
            token,
            obfuscationService,
            tokenService,
            userReconciliationService,
            campaignRepository,
            organizationLearnerRepository,
            userRepository,
          });

          // then
          expect(error).to.be.instanceOf(OrganizationLearnerAlreadyLinkedToUserError);
        });
      }
    );

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'When the external user is already reconciled by another account with samlId authentication method',
      function () {
        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('When reconciled in other organization', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should update existing account with the new samlId', async function () {
            // given
            const organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
              firstName,
              lastName,
              organizationId,
              nationalStudentId: 'coucou',
            });
            const otherAccount = databaseBuilder.factory.buildUser({
              firstName: firstName,
              lastName: lastName,
              birthdate: organizationLearner.birthdate,
            });
            databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
              externalIdentifier: '12345678',
              userId: otherAccount.id,
            });

            const otherOrganization = databaseBuilder.factory.buildOrganization({ type: 'SCO' });
            databaseBuilder.factory.buildOrganizationLearner({
              organizationId: otherOrganization.id,
              firstName: organizationLearner.firstName,
              lastName: organizationLearner.lastName,
              birthdate: organizationLearner.birthdate,
              nationalStudentId: organizationLearner.nationalStudentId,
              userId: otherAccount.id,
            });
            organizationLearner.userId = undefined;
            await databaseBuilder.commit();

            // when
            await createUserAndReconcileToOrganizationLearnerByExternalUser({
              campaignCode,
              token,
              birthdate: organizationLearner.birthdate,
              obfuscationService,
              tokenService,
              userReconciliationService,
              authenticationMethodRepository,
              campaignRepository,
              organizationLearnerRepository,
              studentRepository,
              userRepository,
            });

            // then
            const organizationLearnerInDB = await knex('organization-learners').where({
              id: organizationLearner.id,
            });
            expect(organizationLearnerInDB[0].userId).to.equal(otherAccount.id);

            const authenticationMethodInDB = await knex('authentication-methods').where({
              identityProvider: AuthenticationMethod.identityProviders.GAR,
              userId: otherAccount.id,
            });
            expect(authenticationMethodInDB[0].externalIdentifier).to.equal(samlId);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('When reconciled in the same organization', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should update existing account with the new samlId', async function () {
            // given
            const birthdate = '10-10-2010';
            const otherAccount = databaseBuilder.factory.buildUser({
              firstName: firstName,
              lastName: lastName,
              birthdate: birthdate,
            });
            databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
              externalIdentifier: '12345678',
              userId: otherAccount.id,
            });

            const organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
              firstName,
              lastName,
              birthdate,
              organizationId,
              userId: otherAccount.id,
            });

            await databaseBuilder.commit();

            // when
            await createUserAndReconcileToOrganizationLearnerByExternalUser({
              campaignCode,
              token,
              birthdate: organizationLearner.birthdate,
              obfuscationService,
              tokenService,
              userReconciliationService,
              authenticationMethodRepository,
              campaignRepository,
              organizationLearnerRepository,
              studentRepository,
              userRepository,
            });

            // then
            const organizationLearnerInDB = await knex('organization-learners').where({
              id: organizationLearner.id,
            });
            expect(organizationLearnerInDB[0].userId).to.equal(otherAccount.id);

            const authenticationMethodInDB = await knex('authentication-methods').where({
              identityProvider: AuthenticationMethod.identityProviders.GAR,
              userId: otherAccount.id,
            });
            expect(authenticationMethodInDB[0].externalIdentifier).to.equal(samlId);
          });
        });
      }
    );

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When the external user is already created', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not create again the user', async function () {
        // given
        const organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
          firstName,
          lastName,
          organizationId,
        });
        organizationLearner.userId = undefined;
        const alreadyCreatedUser = databaseBuilder.factory.buildUser({ firstName, lastName });
        databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
          externalIdentifier: samlId,
          userId: alreadyCreatedUser.id,
        });
        await databaseBuilder.commit();
        const usersBefore = await knex('users');

        // when
        await createUserAndReconcileToOrganizationLearnerByExternalUser({
          birthdate: organizationLearner.birthdate,
          campaignCode,
          token,
          obfuscationService,
          tokenService,
          userReconciliationService,
          campaignRepository,
          organizationLearnerRepository,
          studentRepository,
          userRepository,
        });

        // then
        const usersAfter = await knex('users');
        expect(usersAfter.length).to.equal(usersBefore.length);
      });
    });
  });
});
