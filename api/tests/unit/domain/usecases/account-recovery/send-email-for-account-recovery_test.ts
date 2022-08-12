// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, catchErr } = require('../../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const sendEmailForAccountRecovery = require('../../../../../lib/domain/usecases/account-recovery/send-email-for-account-recovery.js');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
const { AlreadyRegisteredEmailError } = require('../../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AccountRec... Remove this comment to see the full error message
const AccountRecoveryDemand = require('../../../../../lib/domain/models/AccountRecoveryDemand');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | Account-recovery | account-recovery | send-email-for-account-recovery', function () {
  let userRepository: $TSFixMe;
  let organizationLearnerRepository: $TSFixMe;
  let accountRecoveryDemandRepository: $TSFixMe;
  let scoAccountRecoveryService: $TSFixMe;
  let mailService: $TSFixMe;
  const userReconciliationService = {};

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    userRepository = {
      checkIfEmailIsAvailable: sinon.stub(),
      get: sinon.stub(),
    };
    organizationLearnerRepository = {
      getOrganizationLearnerInformation: sinon.stub(),
    };
    accountRecoveryDemandRepository = {
      save: sinon.stub(),
    };
    scoAccountRecoveryService = {
      retrieveOrganizationLearner: sinon.stub(),
    };
    mailService = {
      sendAccountRecoveryEmail: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when email already exists', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw AlreadyRegisteredEmailError', async function () {
      // given
      userRepository.checkIfEmailIsAvailable.rejects(new AlreadyRegisteredEmailError());
      const newEmail = 'new_email@example.net';

      const studentInformation = {
        email: newEmail,
      };

      scoAccountRecoveryService.retrieveOrganizationLearner
        .withArgs({
          accountRecoveryDemandRepository,
          studentInformation,
          organizationLearnerRepository,
          userRepository,
          userReconciliationService,
        })
        .resolves({
          username: 'nanou.monchose0705',
          email: 'nanou.monchose@example.net',
        });

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(sendEmailForAccountRecovery)({
        studentInformation,
        organizationLearnerRepository,
        userRepository,
        accountRecoveryDemandRepository,
        mailService,
        scoAccountRecoveryService,
        userReconciliationService,
      });

      // then
      expect(error).to.be.an.instanceOf(AlreadyRegisteredEmailError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when email is available', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save the account recovery demand', async function () {
      // given
      const userId = 1;
      const oldEmail = 'old_email@example.net';
      const newEmail = 'NEW_EMAIL@example.net';
      const temporaryKey = '1234ADC';

      userRepository.checkIfEmailIsAvailable.resolves(true);
      accountRecoveryDemandRepository.save.resolves();
      mailService.sendAccountRecoveryEmail.resolves();

      const studentInformation = {
        email: newEmail,
      };

      scoAccountRecoveryService.retrieveOrganizationLearner
        .withArgs({
          accountRecoveryDemandRepository,
          studentInformation,
          organizationLearnerRepository,
          userRepository,
          userReconciliationService,
        })
        .resolves({
          userId,
          username: 'nanou.monchose0705',
          email: oldEmail,
        });

      // when
      await sendEmailForAccountRecovery({
        studentInformation,
        temporaryKey,
        organizationLearnerRepository,
        userRepository,
        accountRecoveryDemandRepository,
        mailService,
        scoAccountRecoveryService,
        userReconciliationService,
      });

      // then
      const expectedAccountRecoveryDemand = new AccountRecoveryDemand({
        userId,
        oldEmail,
        newEmail: 'new_email@example.net',
        temporaryKey,
        used: false,
      });
      expect(accountRecoveryDemandRepository.save).to.have.been.calledWithExactly(expectedAccountRecoveryDemand);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should send an account recovery email with organization learner first name', async function () {
      // given
      const userId = 1;
      const oldEmail = 'old_email@example.net';
      const newEmail = 'NEW_EMAIL@example.net';
      const temporaryKey = '1234ADC';
      userRepository.checkIfEmailIsAvailable.resolves(true);
      accountRecoveryDemandRepository.save.resolves();

      const studentInformation = {
        email: newEmail,
      };

      scoAccountRecoveryService.retrieveOrganizationLearner
        .withArgs({
          accountRecoveryDemandRepository,
          studentInformation,
          organizationLearnerRepository,
          userRepository,
          userReconciliationService,
        })
        .resolves({
          userId,
          firstName: 'Lorie',
          email: oldEmail,
        });

      // when
      await sendEmailForAccountRecovery({
        studentInformation,
        temporaryKey,
        organizationLearnerRepository,
        userRepository,
        accountRecoveryDemandRepository,
        mailService,
        scoAccountRecoveryService,
        userReconciliationService,
      });

      // then
      expect(mailService.sendAccountRecoveryEmail).to.have.been.calledWithExactly({
        firstName: 'Lorie',
        email: newEmail,
        temporaryKey,
      });
    });
  });
});
