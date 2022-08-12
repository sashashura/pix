// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, expect, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require('../../../../lib/domain/models/User');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PasswordRe... Remove this comment to see the full error message
  PasswordResetDemandNotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
  UserNotAuthorizedToUpdatePasswordError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'validation... Remove this comment to see the full error message
const validationErrorSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/validation-error-serializer');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const updateUserPassword = require('../../../../lib/domain/usecases/update-user-password');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | update-user-password', function () {
  const userId = 1;
  const user = new User({
    id: userId,
    email: 'maryz@acme.xh',
  });
  const password = '123ASXCG';
  const temporaryKey = 'good-temporary-key';

  let encryptionService: $TSFixMe;
  let resetPasswordService: $TSFixMe;
  let authenticationMethodRepository: $TSFixMe;
  let userRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    encryptionService = {
      hashPassword: sinon.stub(),
    };
    resetPasswordService = {
      hasUserAPasswordResetDemandInProgress: sinon.stub(),
      invalidateOldResetPasswordDemand: sinon.stub(),
    };
    authenticationMethodRepository = {
      updateChangedPassword: sinon.stub(),
    };
    userRepository = {
      get: sinon.stub(),
    };

    sinon.stub(validationErrorSerializer, 'serialize');

    encryptionService.hashPassword.resolves();
    resetPasswordService.hasUserAPasswordResetDemandInProgress.withArgs(user.email, temporaryKey).resolves();
    resetPasswordService.invalidateOldResetPasswordDemand.resolves();

    authenticationMethodRepository.updateChangedPassword.resolves();
    userRepository.get.resolves(user);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should get user by his id', async function () {
    // when
    await updateUserPassword({
      password,
      userId,
      temporaryKey,
      encryptionService,
      resetPasswordService,
      authenticationMethodRepository,
      userRepository,
    });

    // then
    expect(userRepository.get).to.have.been.calledWith(userId);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw a UserNotAuthorizedToUpdatePasswordError when user does not have an email', async function () {
    // given
    userRepository.get.resolves({ email: undefined });

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(updateUserPassword)({
      password,
      userId,
      temporaryKey,
      encryptionService,
      resetPasswordService,
      authenticationMethodRepository,
      userRepository,
    });

    // then
    expect(error).to.be.instanceOf(UserNotAuthorizedToUpdatePasswordError);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should check if user has a current password reset demand', async function () {
    // when
    await updateUserPassword({
      password,
      userId,
      temporaryKey,
      encryptionService,
      resetPasswordService,
      authenticationMethodRepository,
      userRepository,
    });

    // then
    expect(resetPasswordService.hasUserAPasswordResetDemandInProgress).to.have.been.calledWith(user.email);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should update user password with a hashed password', async function () {
    const hashedPassword = 'ABCD1234';
    encryptionService.hashPassword.resolves(hashedPassword);

    // when
    await updateUserPassword({
      password,
      userId,
      temporaryKey,
      encryptionService,
      resetPasswordService,
      authenticationMethodRepository,
      userRepository,
    });

    // then
    expect(encryptionService.hashPassword).to.have.been.calledWith(password);
    expect(authenticationMethodRepository.updateChangedPassword).to.have.been.calledWith({
      userId,
      hashedPassword,
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should invalidate current password reset demand (mark as being used)', async function () {
    // when
    await updateUserPassword({
      password,
      userId,
      temporaryKey,
      encryptionService,
      resetPasswordService,
      authenticationMethodRepository,
      userRepository,
    });

    // then
    expect(resetPasswordService.invalidateOldResetPasswordDemand).to.have.been.calledWith(user.email);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('When user has not a current password reset demand', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return PasswordResetDemandNotFoundError', async function () {
      // given
      resetPasswordService.hasUserAPasswordResetDemandInProgress
        .withArgs(user.email, temporaryKey)
        .rejects(new PasswordResetDemandNotFoundError());

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(updateUserPassword)({
        password,
        userId,
        temporaryKey,
        encryptionService,
        resetPasswordService,
        authenticationMethodRepository,
        userRepository,
      });

      // then
      expect(error).to.be.an.instanceOf(PasswordResetDemandNotFoundError);
    });
  });
});
