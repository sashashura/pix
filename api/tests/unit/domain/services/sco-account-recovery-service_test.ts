// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'retrieveOr... Remove this comment to see the full error message
  retrieveOrganizationLearner,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'retrieveAn... Remove this comment to see the full error message
  retrieveAndValidateAccountRecoveryDemand,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/services/sco-account-recovery-service');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AccountRec... Remove this comment to see the full error message
  AccountRecoveryDemandExpired,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
  AlreadyRegisteredEmailError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MultipleOr... Remove this comment to see the full error message
  MultipleOrganizationLearnersWithDifferentNationalStudentIdError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
  UserNotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserHasAlr... Remove this comment to see the full error message
  UserHasAlreadyLeftSCO,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'features'.
const { features } = require('../../../../lib/config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Service | sco-account-recovery-service', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#retrieveOrganizationLearner', function () {
    let organizationLearnerRepository: $TSFixMe;
    let userRepository: $TSFixMe;
    let userReconciliationService: $TSFixMe;
    let accountRecoveryDemandRepository: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      organizationLearnerRepository = {
        getLatestOrganizationLearner: sinon.stub(),
        findByUserId: sinon.stub(),
      };
      userRepository = {
        get: sinon.stub(),
      };
      userReconciliationService = {
        findMatchingCandidateIdForGivenUser: sinon.stub(),
      };
      accountRecoveryDemandRepository = {
        findByUserId: sinon.stub(),
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user is not found when matching with INE and birthDate', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a user not found error', async function () {
        // given
        const studentInformation = {
          ineIna: '123456789AA',
          firstName: 'Nanou',
          lastName: 'Monchose',
          birthdate: '2004-05-07',
        };

        organizationLearnerRepository.getLatestOrganizationLearner
          .withArgs({ nationalStudentId: studentInformation.ineIna, birthdate: studentInformation.birthdate })
          .resolves();

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(retrieveOrganizationLearner)({
          studentInformation,
          organizationLearnerRepository,
          userRepository,
          userReconciliationService,
        });

        // then
        expect(error).to.be.instanceOf(UserNotFoundError);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user is not reconciled to any organization', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an user not found error', async function () {
        // given
        const studentInformation = {
          ineIna: '123456789AA',
          firstName: 'Nanou',
          lastName: 'Monchose',
          birthdate: '2004-05-07',
        };

        const organizationLearner = domainBuilder.buildOrganizationLearner({
          userId: undefined,
          birthdate: studentInformation.birthdate,
          nationalStudentId: studentInformation.ineIna,
        });

        organizationLearnerRepository.getLatestOrganizationLearner
          .withArgs({ nationalStudentId: studentInformation.ineIna, birthdate: studentInformation.birthdate })
          .resolves(organizationLearner);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(retrieveOrganizationLearner)({
          studentInformation,
          organizationLearnerRepository,
          userRepository,
          userReconciliationService,
        });

        // then
        expect(error).to.be.instanceOf(UserNotFoundError);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user is reconciled to several organizations', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when all organization learners have the same INE, some are empty', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the last reconciled user account information', async function () {
          // given
          const studentInformation = {
            ineIna: '123456789AA',
            firstName: 'Nanou',
            lastName: 'Monchose',
            birthdate: '2004-05-07',
          };
          const expectedUser = domainBuilder.buildUser({
            id: 9,
            firstName: studentInformation.firstName,
            lastName: studentInformation.lastName,
            birthdate: studentInformation.birthdate,
            username: 'nanou.monchose0705',
            email: 'nanou.monchose@example.net',
          });
          const firstOrganization = domainBuilder.buildOrganization({ id: 8, name: 'Collège Beauxbâtons' });
          const secondOrganization = domainBuilder.buildOrganization({ id: 7, name: 'Lycée Poudlard' });
          const thirdOrganization = domainBuilder.buildOrganization({ id: 9, name: 'Lycée The Night Watch' });
          const firstOrganizationLearner = domainBuilder.buildOrganizationLearner({
            id: 2,
            userId: expectedUser.id,
            organization: firstOrganization,
            updatedAt: new Date('2000-01-01T15:00:00Z'),
            ...studentInformation,
            nationalStudentId: studentInformation.ineIna,
          });
          const secondOrganizationLearner = domainBuilder.buildOrganizationLearner({
            id: 3,
            userId: expectedUser.id,
            organization: secondOrganization,
            updatedAt: new Date('2004-01-01T15:00:00Z'),
            ...studentInformation,
            nationalStudentId: studentInformation.ineIna,
          });
          const lastOrganizationLearner = domainBuilder.buildOrganizationLearner({
            id: 4,
            userId: expectedUser.id,
            organization: thirdOrganization,
            updatedAt: new Date('2005-01-01T15:00:00Z'),
            ...studentInformation,
          });
          const accountRecoveryDemand = domainBuilder.buildAccountRecoveryDemand({
            userId: expectedUser.id,
            organizationLearnerId: lastOrganizationLearner.id,
          });

          organizationLearnerRepository.getLatestOrganizationLearner
            .withArgs({ birthdate: studentInformation.birthdate, nationalStudentId: studentInformation.ineIna })
            .resolves(lastOrganizationLearner);

          userReconciliationService.findMatchingCandidateIdForGivenUser
            .withArgs([lastOrganizationLearner], {
              firstName: studentInformation.firstName,
              lastName: studentInformation.lastName,
            })
            .resolves(lastOrganizationLearner.id);

          organizationLearnerRepository.findByUserId
            .withArgs({ userId: expectedUser.id })
            .resolves([firstOrganizationLearner, secondOrganizationLearner, lastOrganizationLearner]);

          accountRecoveryDemandRepository.findByUserId.withArgs(expectedUser.id).resolves([accountRecoveryDemand]);

          userRepository.get.withArgs(expectedUser.id).resolves(expectedUser);

          // when
          const result = await retrieveOrganizationLearner({
            accountRecoveryDemandRepository,
            studentInformation,
            organizationLearnerRepository,
            userRepository,
            userReconciliationService,
          });

          // then
          const expectedResult = {
            firstName: 'Nanou',
            lastName: 'Monchose',
            username: 'nanou.monchose0705',
            email: 'nanou.monchose@example.net',
            id: 4,
            userId: 9,
            organizationId: 9,
          };
          expect(result).to.deep.equal(expectedResult);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when at least one organization learner has a different INE with some empty', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw an error', async function () {
          // given
          const studentInformation = {
            ineIna: '123456789AA',
            firstName: 'Nanou',
            lastName: 'Monchose',
            birthdate: '2004-05-07',
          };
          const user = domainBuilder.buildUser({
            id: 9,
            firstName: studentInformation.firstName,
            lastName: studentInformation.lastName,
            birthdate: studentInformation.birthdate,
            username: 'nanou.monchose0705',
            email: 'nanou.monchose@example.net',
          });

          const firstOrganizationLearner = domainBuilder.buildOrganizationLearner({
            id: 6,
            userId: user.id,
            ...studentInformation,
            nationalStudentId: studentInformation.ineIna,
          });
          const secondOrganizationLearner = domainBuilder.buildOrganizationLearner({
            id: 9,
            userId: user.id,
            nationalStudentId: '111111111AA',
            firstName: 'Nanou',
            lastName: 'Monchose',
            birthdate: '2004-05-07',
          });
          const thirdOrganizationLearner = domainBuilder.buildOrganizationLearner({
            id: 9,
            userId: user.id,
            firstName: 'Nanou',
            lastName: 'Monchose',
            birthdate: '2004-05-07',
          });
          const accountRecoveryDemand = domainBuilder.buildAccountRecoveryDemand({
            userId: user.id,
            organizationLearnerId: secondOrganizationLearner.id,
          });

          organizationLearnerRepository.getLatestOrganizationLearner
            .withArgs({ birthdate: studentInformation.birthdate, nationalStudentId: studentInformation.ineIna })
            .resolves(firstOrganizationLearner);

          userReconciliationService.findMatchingCandidateIdForGivenUser
            .withArgs([firstOrganizationLearner], {
              firstName: studentInformation.firstName,
              lastName: studentInformation.lastName,
            })
            .resolves(firstOrganizationLearner.id);

          organizationLearnerRepository.findByUserId
            .withArgs({ userId: user.id })
            .resolves([firstOrganizationLearner, secondOrganizationLearner, thirdOrganizationLearner]);

          accountRecoveryDemandRepository.findByUserId.withArgs(user.id).resolves([accountRecoveryDemand]);

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const result = await catchErr(retrieveOrganizationLearner)({
            accountRecoveryDemandRepository,
            studentInformation,
            organizationLearnerRepository,
            userRepository,
            userReconciliationService,
          });

          // then
          expect(result).to.be.instanceof(MultipleOrganizationLearnersWithDifferentNationalStudentIdError);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user is reconciled to a single organization', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return user account information', async function () {
        // given
        const studentInformation = {
          ineIna: '123456789AA',
          firstName: 'Nanou',
          lastName: 'Monchose',
          birthdate: '2004-05-07',
        };
        const expectedUser = domainBuilder.buildUser({
          id: 9,
          firstName: 'Manuela',
          lastName: studentInformation.lastName,
          birthdate: studentInformation.birthdate,
          username: 'nanou.monchose0705',
          email: 'nanou.monchose@example.net',
        });
        const organization = domainBuilder.buildOrganization({ id: 8, name: 'Collège Beauxbâtons' });
        const organizationLearner = domainBuilder.buildOrganizationLearner({
          id: 2,
          userId: expectedUser.id,
          organization: organization,
          updatedAt: new Date('2000-01-01T15:00:00Z'),
          ...studentInformation,
          firstName: expectedUser.firstName,
          nationalStudentId: studentInformation.ineIna,
        });
        const accountRecoveryDemand = domainBuilder.buildAccountRecoveryDemand({
          userId: expectedUser.id,
          organizationLearnerId: organizationLearner.id,
        });

        organizationLearnerRepository.getLatestOrganizationLearner
          .withArgs({ birthdate: studentInformation.birthdate, nationalStudentId: studentInformation.ineIna })
          .resolves(organizationLearner);

        userReconciliationService.findMatchingCandidateIdForGivenUser
          .withArgs([organizationLearner], {
            firstName: studentInformation.firstName,
            lastName: studentInformation.lastName,
          })
          .resolves(organizationLearner.id);

        organizationLearnerRepository.findByUserId
          .withArgs({ userId: expectedUser.id })
          .resolves([organizationLearner]);

        accountRecoveryDemandRepository.findByUserId.withArgs(expectedUser.id).resolves([accountRecoveryDemand]);

        userRepository.get.withArgs(expectedUser.id).resolves(expectedUser);

        // when
        const result = await retrieveOrganizationLearner({
          accountRecoveryDemandRepository,
          studentInformation,
          organizationLearnerRepository,
          userRepository,
          userReconciliationService,
        });

        // then
        const expectedResult = {
          firstName: 'Manuela',
          lastName: 'Monchose',
          username: 'nanou.monchose0705',
          email: 'nanou.monchose@example.net',
          id: 2,
          userId: 9,
          organizationId: 8,
        };
        expect(result).to.deep.equal(expectedResult);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when firstName or lastName does not match organization learner', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an user not found error', async function () {
        // given
        const studentInformation = {
          ineIna: '123456789AA',
          firstName: 'Nanou',
          lastName: 'Monchose',
          birthdate: '2004-05-07',
        };

        const organizationLearner = domainBuilder.buildOrganizationLearner({
          userId: 1,
          firstName: 'John',
          lastName: studentInformation.lastName,
          birthdate: studentInformation.birthdate,
          nationalStudentId: studentInformation.ineIna,
        });

        organizationLearnerRepository.getLatestOrganizationLearner
          .withArgs({ birthdate: studentInformation.birthdate, nationalStudentId: studentInformation.ineIna })
          .resolves(organizationLearner);

        userReconciliationService.findMatchingCandidateIdForGivenUser
          .withArgs([organizationLearner], {
            firstName: studentInformation.firstName,
            lastName: studentInformation.lastName,
          })
          .resolves(undefined);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(retrieveOrganizationLearner)({
          studentInformation,
          organizationLearnerRepository,
          userRepository,
          userReconciliationService,
        });

        // then
        expect(error).an.instanceOf(UserNotFoundError);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user had already left SCO', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an error', async function () {
        // given
        const studentInformation = {
          ineIna: '123456789AA',
          firstName: 'Nanou',
          lastName: 'Monchose',
          birthdate: '2004-05-07',
        };
        const expectedUser = domainBuilder.buildUser({
          id: 9,
          firstName: 'Manuela',
          lastName: studentInformation.lastName,
          birthdate: studentInformation.birthdate,
          username: 'nanou.monchose0705',
          email: 'nanou.monchose@example.net',
        });
        const organization = domainBuilder.buildOrganization({ id: 8, name: 'Collège Beauxbâtons' });
        const organizationLearner = domainBuilder.buildOrganizationLearner({
          id: 2,
          userId: expectedUser.id,
          organization: organization,
          updatedAt: new Date('2000-01-01T15:00:00Z'),
          ...studentInformation,
          firstName: expectedUser.firstName,
          nationalStudentId: studentInformation.ineIna,
        });
        const accountRecoveryDemandNotUsed = domainBuilder.buildAccountRecoveryDemand({
          userId: expectedUser.id,
          organizationLearnerId: organizationLearner.id,
        });
        const accountRecoveryDemandUsed = domainBuilder.buildAccountRecoveryDemand({
          userId: expectedUser.id,
          organizationLearnerId: organizationLearner.id,
          used: true,
        });

        organizationLearnerRepository.getLatestOrganizationLearner
          .withArgs({ birthdate: studentInformation.birthdate, nationalStudentId: studentInformation.ineIna })
          .resolves(organizationLearner);

        userReconciliationService.findMatchingCandidateIdForGivenUser
          .withArgs([organizationLearner], {
            firstName: studentInformation.firstName,
            lastName: studentInformation.lastName,
          })
          .resolves(organizationLearner.id);

        organizationLearnerRepository.findByUserId
          .withArgs({ userId: expectedUser.id })
          .resolves([organizationLearner]);
        userRepository.get.withArgs(expectedUser.id).resolves(expectedUser);

        accountRecoveryDemandRepository.findByUserId
          .withArgs(expectedUser.id)
          .resolves([accountRecoveryDemandNotUsed, accountRecoveryDemandUsed]);

        userRepository.get.resolves({
          username: expectedUser.username,
          email: expectedUser.email,
        });

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(retrieveOrganizationLearner)({
          accountRecoveryDemandRepository,
          studentInformation,
          organizationLearnerRepository,
          userRepository,
          userReconciliationService,
        });

        // then
        expect(error).to.be.an.instanceOf(UserHasAlreadyLeftSCO);
        expect((error as $TSFixMe).message).to.be.equal('User has already left SCO.');
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#retrieveAndValidateAccountRecoveryDemand', function () {
    let userRepository: $TSFixMe;
    let accountRecoveryDemandRepository: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      userRepository = {
        checkIfEmailIsAvailable: sinon.stub(),
      };
      accountRecoveryDemandRepository = {
        findByUserId: sinon.stub(),
        findByTemporaryKey: sinon.stub(),
      };
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return account recovery detail', async function () {
      // given
      const createdAt = new Date();
      const newEmail = 'philippe@example.net';
      const userId = '1234';
      const organizationLearnerId = '12';
      const accountRecoveryId = '34';
      const expectedResult = {
        id: accountRecoveryId,
        userId,
        newEmail,
        organizationLearnerId,
      };

      accountRecoveryDemandRepository.findByTemporaryKey.resolves({ ...expectedResult, createdAt });
      userRepository.checkIfEmailIsAvailable.withArgs(newEmail).resolves();
      accountRecoveryDemandRepository.findByUserId.withArgs(userId).resolves([{ used: false }]);

      // when
      const result = await retrieveAndValidateAccountRecoveryDemand({
        userRepository,
        accountRecoveryDemandRepository,
      });

      // then
      expect(result).to.be.deep.equal(expectedResult);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw error AlreadyRegisteredEmailError when it is not available', async function () {
      // given
      const newEmail = 'philippe@example.net';

      accountRecoveryDemandRepository.findByTemporaryKey.resolves({ newEmail });
      userRepository.checkIfEmailIsAvailable.withArgs(newEmail).rejects(new AlreadyRegisteredEmailError());

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(retrieveAndValidateAccountRecoveryDemand)({
        userRepository,
        accountRecoveryDemandRepository,
      });

      // then
      expect(error).to.be.instanceOf(AlreadyRegisteredEmailError);
      expect((error as $TSFixMe).message).to.be.equal('Cette adresse e-mail est déjà utilisée.');
      expect((error as $TSFixMe).code).to.be.equal('ACCOUNT_WITH_EMAIL_ALREADY_EXISTS');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw error UserHasAlreadyLeftSCO when user already left SCO', async function () {
      // given
      const userId = '1234';

      accountRecoveryDemandRepository.findByTemporaryKey.resolves({ userId });
      userRepository.checkIfEmailIsAvailable.resolves();
      accountRecoveryDemandRepository.findByUserId.withArgs(userId).resolves([{ used: true }]);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(retrieveAndValidateAccountRecoveryDemand)({
        userRepository,
        accountRecoveryDemandRepository,
      });

      // then
      expect(error).to.be.instanceOf(UserHasAlreadyLeftSCO);
      expect((error as $TSFixMe).message).to.be.equal('User has already left SCO.');
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('should throw error AccountRecoveryDemandExpired when demand has expired', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('based on default expiration value', async function () {
        // given
        const userId = '1234';
        const createdAt = new Date();
        const createdTenDaysAgo = 10;
        createdAt.setDate(createdAt.getDate() - createdTenDaysAgo);

        accountRecoveryDemandRepository.findByTemporaryKey.resolves({ userId, createdAt });
        userRepository.checkIfEmailIsAvailable.resolves();
        accountRecoveryDemandRepository.findByUserId.withArgs(userId).resolves([{ used: false }]);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(retrieveAndValidateAccountRecoveryDemand)({
          userRepository,
          accountRecoveryDemandRepository,
        });

        // then
        expect(error).to.be.instanceOf(AccountRecoveryDemandExpired);
        expect((error as $TSFixMe).message).to.be.equal('This account recovery demand has expired.');
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('based on environment variable', async function () {
        // given
        features.scoAccountRecoveryKeyLifetimeMinutes = 1;
        const userId = '1234';
        const createdTwoMinutesAgo = moment().subtract(2, 'minutes').toDate();
        accountRecoveryDemandRepository.findByTemporaryKey.resolves({ userId, createdAt: createdTwoMinutesAgo });
        userRepository.checkIfEmailIsAvailable.resolves();
        accountRecoveryDemandRepository.findByUserId.withArgs(userId).resolves([{ used: false }]);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(retrieveAndValidateAccountRecoveryDemand)({
          userRepository,
          accountRecoveryDemandRepository,
        });

        // then
        expect(error).to.be.instanceOf(AccountRecoveryDemandExpired);
        expect((error as $TSFixMe).message).to.be.equal('This account recovery demand has expired.');
      });
    });
  });
});
