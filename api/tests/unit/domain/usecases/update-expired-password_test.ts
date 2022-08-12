// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, domainBuilder, catchErr } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ForbiddenA... Remove this comment to see the full error message
const { ForbiddenAccess, UserNotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../../../lib/domain/models/AuthenticationMethod');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const updateExpiredPassword = require('../../../../lib/domain/usecases/update-expired-password');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../../../lib/infrastructure/logger');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | update-expired-password', function () {
  const passwordResetToken = 'PASSWORD_RESET_TOKEN';
  const newPassword = 'Password02';
  const hashedPassword = 'ABCDEF123';

  let user: $TSFixMe;

  let encryptionService: $TSFixMe, tokenService: $TSFixMe;
  let authenticationMethodRepository: $TSFixMe, userRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    user = domainBuilder.buildUser({ username: 'armand.talo1806' });
    const authenticationMethod = domainBuilder.buildAuthenticationMethod.withPixAsIdentityProviderAndRawPassword({
      userId: user.id,
      rawPassword: 'oneTimePassword',
      shouldChangePassword: true,
    });
    user.authenticationMethods = [authenticationMethod];

    userRepository = {
      getById: sinon.stub(),
    };
    encryptionService = {
      hashPassword: sinon.stub(),
    };
    tokenService = {
      extractUserId: sinon.stub(),
    };
    authenticationMethodRepository = {
      updateExpiredPassword: sinon.stub(),
      findOneByUserIdAndIdentityProvider: sinon.stub(),
    };

    tokenService.extractUserId.resolves(user.id);
    userRepository.getById.resolves(user);
    authenticationMethodRepository.findOneByUserIdAndIdentityProvider.resolves(authenticationMethod);
    encryptionService.hashPassword.resolves(hashedPassword);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should update user password with a hashed password and return username', async function () {
    // when
    const login = await updateExpiredPassword({
      passwordResetToken,
      newPassword,
      tokenService,
      encryptionService,
      authenticationMethodRepository,
      userRepository,
    });

    // then
    expect(tokenService.extractUserId).to.have.been.calledOnceWith(passwordResetToken);
    expect(userRepository.getById).to.have.been.calledOnceWith(user.id);
    expect(encryptionService.hashPassword).to.have.been.calledOnceWith(newPassword);
    expect(authenticationMethodRepository.findOneByUserIdAndIdentityProvider).to.have.been.calledOnceWith({
      userId: user.id,
      identityProvider: AuthenticationMethod.identityProviders.PIX,
    });
    expect(authenticationMethodRepository.updateExpiredPassword).to.have.been.calledOnceWith({
      userId: user.id,
      hashedPassword,
    });
    expect(login).to.equal('armand.talo1806');
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user does not have a username', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return user email', async function () {
      // given
      const user = domainBuilder.buildUser({ username: null, email: 'armand.talo@example.net' });
      userRepository.getById.resolves(user);

      // when
      const login = await updateExpiredPassword({
        passwordResetToken,
        newPassword,
        tokenService,
        encryptionService,
        authenticationMethodRepository,
        userRepository,
      });

      // then
      expect(login).to.equal('armand.talo@example.net');
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when userId not exist', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw UserNotFoundError', async function () {
      // given
      userRepository.getById.rejects(new UserNotFoundError());

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(updateExpiredPassword)({
        passwordResetToken,
        tokenService,
        userRepository,
      });

      // then
      expect(error).to.be.instanceOf(UserNotFoundError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should log error', async function () {
      // given
      userRepository.getById.rejects(new UserNotFoundError());
      sinon.stub(logger, 'warn');

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      await catchErr(updateExpiredPassword)({
        passwordResetToken,
        tokenService,
        userRepository,
      });

      // then
      expect(logger.warn).to.have.been.calledWith('Trying to change his password with incorrect user id');
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When changing password is not required', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw ForbiddenAccess', async function () {
      // given
      const authenticationMethod = domainBuilder.buildAuthenticationMethod.withPixAsIdentityProviderAndRawPassword({
        userId: 100,
        shouldChangePassword: false,
      });
      const user = domainBuilder.buildUser({ id: 100, authenticationMethods: [authenticationMethod] });

      tokenService.extractUserId.resolves(user.id);
      userRepository.getById.resolves(user);
      authenticationMethodRepository.findOneByUserIdAndIdentityProvider.resolves(authenticationMethod);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(updateExpiredPassword)({
        passwordResetToken,
        tokenService,
        authenticationMethodRepository,
        userRepository,
      });

      // then
      expect(error).to.be.instanceOf(ForbiddenAccess);
    });
  });
});
