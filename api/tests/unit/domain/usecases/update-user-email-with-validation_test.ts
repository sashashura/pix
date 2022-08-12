// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
  AlreadyRegisteredEmailError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidVer... Remove this comment to see the full error message
  InvalidVerificationCodeError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
  UserNotAuthorizedToUpdateEmailError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EmailModif... Remove this comment to see the full error message
  EmailModificationDemandNotFoundOrExpiredError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EmailModif... Remove this comment to see the full error message
const EmailModificationDemand = require('../../../../lib/domain/models/EmailModificationDemand');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const updateUserEmailWithValidation = require('../../../../lib/domain/usecases/update-user-email-with-validation');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | update-user-email-with-validation', function () {
  let userEmailRepository: $TSFixMe;
  let userRepository: $TSFixMe;
  let clock;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    userEmailRepository = {
      getEmailModificationDemandByUserId: sinon.stub(),
    };
    userRepository = {
      checkIfEmailIsAvailable: sinon.stub(),
      get: sinon.stub(),
      updateWithEmailConfirmed: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should update email and set date for confirmed email', async function () {
    // given
    const userId = domainBuilder.buildUser().id;
    const email = 'oldEmail@example.net';
    const newEmail = 'new_email@example.net';
    const code = '999999';
    const emailModificationDemand = new EmailModificationDemand({
      code,
      newEmail,
    });

    const now = new Date();
    clock = sinon.useFakeTimers(now);

    userRepository.get.withArgs(userId).resolves({ email });
    userEmailRepository.getEmailModificationDemandByUserId.withArgs(userId).resolves(emailModificationDemand);
    userRepository.checkIfEmailIsAvailable.withArgs(newEmail).resolves();

    // when
    await updateUserEmailWithValidation({
      userId,
      code,
      userEmailRepository,
      userRepository,
    });

    // then
    expect(userRepository.updateWithEmailConfirmed).to.have.been.calledWith({
      id: userId,
      userAttributes: { email: newEmail, emailConfirmedAt: now },
    });
    clock.restore();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should get email modification demand in temporary storage', async function () {
    // given
    const userId = domainBuilder.buildUser().id;
    const email = 'oldEmail@example.net';
    const newEmail = 'new_email@example.net';
    const code = '999999';
    const emailModificationDemand = new EmailModificationDemand({
      code,
      newEmail,
    });

    userRepository.get.withArgs(userId).resolves({ email });
    userEmailRepository.getEmailModificationDemandByUserId.withArgs(userId).resolves(emailModificationDemand);

    // when
    await updateUserEmailWithValidation({
      userId,
      code,
      userEmailRepository,
      userRepository,
    });

    // then
    expect(userEmailRepository.getEmailModificationDemandByUserId).to.have.been.calledWithExactly(userId);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw UserNotAuthorizedToUpdateEmailError if user does not have an email', async function () {
    // given
    userRepository.get.resolves({});
    const userId = 1;
    const code = '999999';

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(updateUserEmailWithValidation)({
      userId,
      code,
      userRepository,
      userEmailRepository,
    });

    // then
    expect(error).to.be.an.instanceOf(UserNotAuthorizedToUpdateEmailError);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw AlreadyRegisteredEmailError if email already exists', async function () {
    // given
    const userId = domainBuilder.buildUser().id;
    const email = 'oldEmail@example.net';
    const newEmail = 'new_email@example.net';
    const code = '999999';
    const emailModificationDemand = new EmailModificationDemand({
      code,
      newEmail,
    });

    userRepository.get.withArgs(userId).resolves({ email });
    userEmailRepository.getEmailModificationDemandByUserId.withArgs(userId).resolves(emailModificationDemand);
    userRepository.checkIfEmailIsAvailable.withArgs(newEmail).rejects(new AlreadyRegisteredEmailError());

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(updateUserEmailWithValidation)({
      userId,
      code,
      userEmailRepository,
      userRepository,
    });

    // then
    expect(error).to.be.an.instanceOf(AlreadyRegisteredEmailError);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw InvalidVerificationCodeError if the code send does not match with then code saved in temporary storage', async function () {
    // given
    const userId = domainBuilder.buildUser().id;
    const email = 'oldEmail@example.net';
    const newEmail = 'new_email@example.net';
    const code = '999999';
    const anotherCode = '444444';
    const emailModificationDemand = new EmailModificationDemand({
      code: anotherCode,
      newEmail,
    });

    userRepository.get.withArgs(userId).resolves({ email });
    userEmailRepository.getEmailModificationDemandByUserId.withArgs(userId).resolves(emailModificationDemand);

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(updateUserEmailWithValidation)({
      userId,
      code,
      userEmailRepository,
      userRepository,
    });

    // then
    expect(error).to.be.an.instanceOf(InvalidVerificationCodeError);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw EmailModificationDemandNotFoundOrExpiredError if no email modification demand match or is expired', async function () {
    // given
    const userId = domainBuilder.buildUser().id;
    const anotherUserId = domainBuilder.buildUser().id;
    const email = 'oldEmail@example.net';
    const code = '999999';

    userRepository.get.withArgs(userId).resolves({ email });
    userEmailRepository.getEmailModificationDemandByUserId.withArgs(anotherUserId).resolves(null);

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(updateUserEmailWithValidation)({
      userId,
      code,
      userEmailRepository,
      userRepository,
    });

    // then
    expect(error).to.be.an.instanceOf(EmailModificationDemandNotFoundOrExpiredError);
  });
});
