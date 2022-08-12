// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, domainBuilder, expect, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require('../../../../lib/domain/models/User');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidTem... Remove this comment to see the full error message
  InvalidTemporaryKeyError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PasswordRe... Remove this comment to see the full error message
  PasswordResetDemandNotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
  UserNotFoundError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getUserByR... Remove this comment to see the full error message
const getUserByResetPasswordDemand = require('../../../../lib/domain/usecases/get-user-by-reset-password-demand');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-user-by-reset-password-demand', function () {
  const temporaryKey = 'ABCDEF123';
  const email = 'user@example.net';

  let resetPasswordService: $TSFixMe;
  let tokenService: $TSFixMe;
  let userRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    resetPasswordService = {
      verifyDemand: sinon.stub(),
    };
    tokenService = {
      decodeIfValid: sinon.stub(),
    };
    userRepository = {
      getByEmail: sinon.stub(),
    };

    resetPasswordService.verifyDemand.resolves({ email });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return a User with email', async function () {
    // given
    const user = domainBuilder.buildUser({ email });
    userRepository.getByEmail.resolves(user);

    // when
    const result = await getUserByResetPasswordDemand({
      temporaryKey,
      resetPasswordService,
      tokenService,
      userRepository,
    });

    // then
    expect(result).to.be.an.instanceOf(User);
    expect(resetPasswordService.verifyDemand).to.have.been.calledWith(temporaryKey);
    expect(tokenService.decodeIfValid).to.have.been.calledWith(temporaryKey);
    expect(userRepository.getByEmail).to.have.been.calledWith(email);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw InvalidTemporaryKeyError if TemporaryKey is invalid', async function () {
    // given
    tokenService.decodeIfValid.rejects(new InvalidTemporaryKeyError());

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(getUserByResetPasswordDemand)({
      temporaryKey,
      resetPasswordService,
      tokenService,
      userRepository,
    });

    // then
    expect(error).to.be.an.instanceOf(InvalidTemporaryKeyError);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw PasswordResetDemandNotFoundError if ResetPasswordDemand does not exist', async function () {
    // given
    resetPasswordService.verifyDemand.throws(new PasswordResetDemandNotFoundError());

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(getUserByResetPasswordDemand)({
      temporaryKey,
      resetPasswordService,
      tokenService,
      userRepository,
    });

    // then
    expect(error).to.be.an.instanceOf(PasswordResetDemandNotFoundError);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw UserNotFoundError if user with the email does not exist', async function () {
    // given
    userRepository.getByEmail.throws(new UserNotFoundError());

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(getUserByResetPasswordDemand)({
      temporaryKey,
      resetPasswordService,
      tokenService,
      userRepository,
    });

    // then
    expect(error).to.be.an.instanceOf(UserNotFoundError);
  });
});
