// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainBuil... Remove this comment to see the full error message
const { domainBuilder, expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'addPixAuth... Remove this comment to see the full error message
const addPixAuthenticationMethodByEmail = require('../../../../lib/domain/usecases/add-pix-authentication-method-by-email');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../../../lib/domain/models/AuthenticationMethod');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | add-pix-authentication-method-by-email', function () {
  let userRepository: $TSFixMe, authenticationMethodRepository: $TSFixMe;
  let passwordGenerator: $TSFixMe;
  let encryptionService: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    userRepository = {
      checkIfEmailIsAvailable: sinon.stub(),
      updateUserDetailsForAdministration: sinon.stub(),
    };
    authenticationMethodRepository = {
      hasIdentityProviderPIX: sinon.stub(),
      create: sinon.stub(),
    };
    passwordGenerator = {
      generateComplexPassword: sinon.stub(),
    };
    encryptionService = {
      hashPassword: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should check if email is available', async function () {
    // given
    const email = 'newEmail@example.net';
    const generatedPassword = 'Pix12345';
    const hashedPassword = 'ABCDEF123';
    const user = domainBuilder.buildUser({});
    domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({ userId: user.id });

    passwordGenerator.generateComplexPassword.returns(generatedPassword);
    encryptionService.hashPassword.resolves(hashedPassword);

    // when
    await addPixAuthenticationMethodByEmail({
      userId: user.id,
      email,
      passwordGenerator,
      encryptionService,
      userRepository,
      authenticationMethodRepository,
    });

    // then
    expect(userRepository.checkIfEmailIsAvailable).to.be.calledWith(email);
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user have not a Pix authentication method', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should add Pix authentication method', async function () {
      // given
      const email = 'newEmail@example.net';
      const generatedPassword = 'Pix12345';
      const hashedPassword = 'ABCDEF123';
      const user = domainBuilder.buildUser({});
      domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({ userId: user.id });

      passwordGenerator.generateComplexPassword.returns(generatedPassword);
      encryptionService.hashPassword.withArgs(generatedPassword).resolves(hashedPassword);

      // when
      await addPixAuthenticationMethodByEmail({
        userId: user.id,
        email,
        passwordGenerator,
        encryptionService,
        authenticationMethodRepository,
        userRepository,
      });

      // then
      const authenticationMethodFromPix = new AuthenticationMethod({
        userId: user.id,
        identityProvider: AuthenticationMethod.identityProviders.PIX,
        authenticationComplement: new AuthenticationMethod.PixAuthenticationComplement({
          password: hashedPassword,
          shouldChangePassword: false,
        }),
      });
      expect(authenticationMethodRepository.create).to.have.been.calledWith({
        authenticationMethod: authenticationMethodFromPix,
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should update user with new email', async function () {
    // given
    const email = 'newEmail@example.net';
    const generatedPassword = 'Pix12345';
    const hashedPassword = 'ABCDEF123';
    const user = domainBuilder.buildUser({ cgu: true });
    domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({ userId: user.id });

    passwordGenerator.generateComplexPassword.returns(generatedPassword);
    encryptionService.hashPassword.resolves(hashedPassword);

    // when
    await addPixAuthenticationMethodByEmail({
      userId: user.id,
      email,
      passwordGenerator,
      encryptionService,
      authenticationMethodRepository,
      userRepository,
    });

    // then
    expect(userRepository.updateUserDetailsForAdministration).to.have.been.calledWith(user.id, { email });
  });
});
