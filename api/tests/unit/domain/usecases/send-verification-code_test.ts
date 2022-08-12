// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
  AlreadyRegisteredEmailError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidPas... Remove this comment to see the full error message
  InvalidPasswordForUpdateEmailError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
  UserNotAuthorizedToUpdateEmailError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../../../lib/domain/models/AuthenticationMethod');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'codeUtils'... Remove this comment to see the full error message
const codeUtils = require('../../../../lib/infrastructure/utils/code-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getI18n'.
const { getI18n } = require('../../../tooling/i18n/i18n');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | send-verification-code', function () {
  let authenticationMethodRepository: $TSFixMe;
  let userEmailRepository: $TSFixMe;
  let userRepository: $TSFixMe;
  let encryptionService: $TSFixMe;
  let mailService: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    userEmailRepository = {
      saveEmailModificationDemand: sinon.stub(),
    };
    userRepository = {
      checkIfEmailIsAvailable: sinon.stub(),
      get: sinon.stub(),
    };
    encryptionService = {
      checkPassword: sinon.stub(),
    };
    mailService = {
      sendVerificationCodeEmail: sinon.stub(),
    };
    authenticationMethodRepository = {
      findOneByUserIdAndIdentityProvider: sinon.stub(),
    };

    sinon.stub(codeUtils, 'generateNumericalString');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should store the generated code in temporary storage', async function () {
    // given
    const userId = 1;
    const newEmail = 'user@example.net';
    const code = '999999';
    const password = 'pix123';
    const passwordHash = 'ABCD';
    const locale = 'fr';
    const i18n = getI18n();

    userRepository.get.withArgs(userId).resolves({ email: 'oldEmail@example.net' });
    userRepository.checkIfEmailIsAvailable.withArgs(newEmail).resolves(newEmail);
    authenticationMethodRepository.findOneByUserIdAndIdentityProvider
      .withArgs({
        userId,
        identityProvider: AuthenticationMethod.identityProviders.PIX,
      })
      .resolves(
        domainBuilder.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
          hashedPassword: passwordHash,
        })
      );
    encryptionService.checkPassword.withArgs({ password, passwordHash }).resolves();
    codeUtils.generateNumericalString.withArgs(6).returns(code);

    // when
    await usecases.sendVerificationCode({
      i18n,
      locale,
      newEmail,
      password,
      userId,
      authenticationMethodRepository,
      userEmailRepository,
      userRepository,
      encryptionService,
      mailService,
    });

    // then
    expect(userEmailRepository.saveEmailModificationDemand).to.have.been.calledWithExactly({ userId, code, newEmail });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should send verification code email', async function () {
    // given
    const userId = 1;
    const newEmail = 'new_email@example.net';
    const password = 'pix123';
    const passwordHash = 'ABCD';
    const code = '999999';
    const locale = 'fr';
    const i18n = getI18n();
    const translate = getI18n().__;

    userRepository.get.withArgs(userId).resolves({ email: 'oldEmail@example.net' });
    userRepository.checkIfEmailIsAvailable.withArgs(newEmail).resolves(newEmail);
    authenticationMethodRepository.findOneByUserIdAndIdentityProvider
      .withArgs({
        userId,
        identityProvider: AuthenticationMethod.identityProviders.PIX,
      })
      .resolves(
        domainBuilder.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
          hashedPassword: passwordHash,
        })
      );
    encryptionService.checkPassword.withArgs({ password, passwordHash }).resolves();
    codeUtils.generateNumericalString.withArgs(6).returns(code);

    // when
    await usecases.sendVerificationCode({
      i18n,
      locale,
      newEmail,
      password,
      userId,
      authenticationMethodRepository,
      userEmailRepository,
      userRepository,
      encryptionService,
      mailService,
    });

    // then
    expect(mailService.sendVerificationCodeEmail).to.have.been.calledWith({
      code,
      locale,
      email: newEmail,
      translate,
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw AlreadyRegisteredEmailError if email already exists', async function () {
    // given
    const userId = 1;
    const newEmail = 'new_email@example.net';
    const password = 'pix123';
    const locale = 'fr';

    userRepository.get.withArgs(userId).resolves({ email: 'oldEmail@example.net' });
    userRepository.checkIfEmailIsAvailable.rejects(new AlreadyRegisteredEmailError());

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(usecases.sendVerificationCode)({
      locale,
      newEmail,
      password,
      userId,
      authenticationMethodRepository,
      userEmailRepository,
      userRepository,
      encryptionService,
      mailService,
    });

    // then
    expect(error).to.be.an.instanceOf(AlreadyRegisteredEmailError);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw InvalidPasswordForUpdateEmailError if the password is invalid', async function () {
    // given
    const userId = 1;
    const newEmail = 'new_email@example.net';
    const password = 'pix123';
    const passwordHash = 'ABCD';
    const locale = 'fr';

    userRepository.get.withArgs(userId).resolves({ email: 'oldEmail@example.net' });
    userRepository.checkIfEmailIsAvailable.withArgs(newEmail).resolves(newEmail);
    authenticationMethodRepository.findOneByUserIdAndIdentityProvider
      .withArgs({
        userId,
        identityProvider: AuthenticationMethod.identityProviders.PIX,
      })
      .resolves(
        domainBuilder.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
          hashedPassword: passwordHash,
        })
      );
    encryptionService.checkPassword.withArgs({ password, passwordHash }).rejects();

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(usecases.sendVerificationCode)({
      locale,
      newEmail,
      password,
      userId,
      authenticationMethodRepository,
      userEmailRepository,
      userRepository,
      encryptionService,
      mailService,
    });

    // then
    expect(error).to.be.an.instanceOf(InvalidPasswordForUpdateEmailError);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw UserNotAuthorizedToUpdateEmailError if user does not have an email', async function () {
    // given
    userRepository.get.resolves({});
    const userId = 1;
    const newEmail = 'new_email@example.net';
    const password = 'pix123';
    const locale = 'fr';

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(usecases.sendVerificationCode)({
      locale,
      newEmail,
      password,
      userId,
      authenticationMethodRepository,
      userEmailRepository,
      userRepository,
      encryptionService,
      mailService,
    });

    // then
    expect(error).to.be.an.instanceOf(UserNotAuthorizedToUpdateEmailError);
  });
});
