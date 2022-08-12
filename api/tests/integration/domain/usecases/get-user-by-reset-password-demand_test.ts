// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, expect, databaseBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'resetPassw... Remove this comment to see the full error message
const resetPasswordService = require('../../../../lib/domain/services/reset-password-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('../../../../lib/domain/services/token-service');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userReposi... Remove this comment to see the full error message
const userRepository = require('../../../../lib/infrastructure/repositories/user-repository');

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
describe('Integration | UseCases | get-user-by-reset-password-demand', function () {
  const email = 'user@example.net';

  let temporaryKey;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    databaseBuilder.factory.buildUser({ email });
    await databaseBuilder.commit();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return an user', async function () {
    // given
    temporaryKey = resetPasswordService.generateTemporaryKey();
    databaseBuilder.factory.buildResetPasswordDemand({ email, temporaryKey });
    await databaseBuilder.commit();

    // when
    const foundUser = await getUserByResetPasswordDemand({
      temporaryKey,
      resetPasswordService,
      tokenService,
      userRepository,
    });

    // then
    expect(foundUser).to.be.an.instanceOf(User);
    expect(foundUser.email).to.equal(email);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throws InvalidTemporaryKeyError if temporaryKey is invalid', async function () {
    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(getUserByResetPasswordDemand)({
      temporaryKey: 'INVALIDKEY',
      resetPasswordService,
      tokenService,
      userRepository,
    });

    // then
    expect(error).to.be.an.instanceOf(InvalidTemporaryKeyError);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throws PasswordResetDemandNotFoundError if resetPasswordDemand does not exist', async function () {
    // given
    const unknownTemporaryKey = resetPasswordService.generateTemporaryKey();

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(getUserByResetPasswordDemand)({
      temporaryKey: unknownTemporaryKey,
      resetPasswordService,
      tokenService,
      userRepository,
    });

    // then
    expect(error).to.be.an.instanceOf(PasswordResetDemandNotFoundError);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throws UserNotFoundError if user with email does not exist', async function () {
    // given
    temporaryKey = resetPasswordService.generateTemporaryKey();
    databaseBuilder.factory.buildResetPasswordDemand({ temporaryKey });

    await databaseBuilder.commit();

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
