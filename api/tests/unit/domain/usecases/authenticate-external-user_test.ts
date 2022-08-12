// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'authentica... Remove this comment to see the full error message
const authenticateExternalUser = require('../../../../lib/domain/usecases/authenticate-external-user');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MissingOrI... Remove this comment to see the full error message
  MissingOrInvalidCredentialsError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
  UserNotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PasswordNo... Remove this comment to see the full error message
  PasswordNotMatching,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Unexpected... Remove this comment to see the full error message
  UnexpectedUserAccountError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserShould... Remove this comment to see the full error message
  UserShouldChangePasswordError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserAlread... Remove this comment to see the full error message
  UserAlreadyExistsWithAuthenticationMethodError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../../../lib/domain/models/AuthenticationMethod');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | UseCase | authenticate-external-user', function () {
  let tokenService: $TSFixMe;
  let pixAuthenticationService: $TSFixMe;
  let obfuscationService: $TSFixMe;
  let authenticationMethodRepository: $TSFixMe;
  let userRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    tokenService = {
      createAccessTokenForSaml: sinon.stub(),
      extractExternalUserFromIdToken: sinon.stub(),
      createPasswordResetToken: sinon.stub(),
    };
    pixAuthenticationService = {
      getUserByUsernameAndPassword: sinon.stub(),
    };
    obfuscationService = {
      getUserAuthenticationMethodWithObfuscation: sinon.stub(),
    };
    authenticationMethodRepository = {
      create: sinon.stub(),
    };
    userRepository = {
      getBySamlId: sinon.stub(),
      getForObfuscation: sinon.stub(),
      updateLastLoggedAt: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when credentials are valid', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should resolve a valid JWT token when authentication succeeds (should not change password)', async function () {
      // given
      const password = 'Azerty123*';
      const user = createUserWithValidCredentials({
        password,
        pixAuthenticationService,
        userRepository,
      });

      const externalUserToken = 'external user token';
      _stubToEnableAddGarAuthenticationMethod({
        user,
        externalUserToken,
        tokenService,
        userRepository,
        authenticationMethodRepository,
      });

      const expectedToken = 'expected returned token';
      tokenService.createAccessTokenForSaml.withArgs(user.id).resolves(expectedToken);

      // when
      const token = await authenticateExternalUser({
        username: user.email,
        password,
        externalUserToken,
        expectedUserId: user.id,
        tokenService,
        pixAuthenticationService,
        obfuscationService,
        authenticationMethodRepository,
        userRepository,
      });

      // then
      expect(token).to.be.deep.equal(expectedToken);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save last login date when authentication succeeds', async function () {
      // given
      const password = 'Azerty123*';
      const user = createUserWithValidCredentials({
        password,
        pixAuthenticationService,
        userRepository,
      });

      const externalUserToken = 'external user token';
      _stubToEnableAddGarAuthenticationMethod({
        user,
        externalUserToken,
        tokenService,
        userRepository,
        authenticationMethodRepository,
      });

      const expectedToken = 'expected returned token';
      tokenService.createAccessTokenForSaml.withArgs(user.id).resolves(expectedToken);

      // when
      await authenticateExternalUser({
        username: user.email,
        password,
        externalUserToken,
        expectedUserId: user.id,
        tokenService,
        pixAuthenticationService,
        obfuscationService,
        authenticationMethodRepository,
        userRepository,
      });

      // then
      expect(userRepository.updateLastLoggedAt).to.have.been.calledWith({ userId: user.id });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should throw an UnexpectedUserAccountError (with expected user's username or email) when the authenticated user does not match the expected one", async function () {
      // given
      const password = 'Azerty123*';
      const user = createUserWithValidCredentials({
        password,
        pixAuthenticationService,
        userRepository,
      });

      const emailObfuscated = 'j*****@e*****.n**';
      const authenticatedByAndValue = { value: emailObfuscated };

      const expectedUserId = user.id + 1;
      const expectedUser = domainBuilder.buildUser({ id: expectedUserId });
      obfuscationService.getUserAuthenticationMethodWithObfuscation
        .withArgs(expectedUser)
        .resolves(authenticatedByAndValue);

      userRepository.getForObfuscation.withArgs(expectedUserId).resolves(expectedUser);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(authenticateExternalUser)({
        username: user.email,
        password,
        externalUserToken: 'an external user token',
        expectedUserId,
        tokenService,
        pixAuthenticationService,
        obfuscationService,
        authenticationMethodRepository,
        userRepository,
      });

      // then
      expect(error).to.be.an.instanceof(UnexpectedUserAccountError);
      expect((error as $TSFixMe).message).to.equal("Ce compte utilisateur n'est pas celui qui est attendu.");
      expect((error as $TSFixMe).code).to.equal('UNEXPECTED_USER_ACCOUNT');
      expect((error as $TSFixMe).meta.value).to.equal(emailObfuscated);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when adding GAR authentication method', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an error if user from external user token is not the same as found user from credentials', async function () {
        // given
        const password = 'Azerty123*';
        const userFromCredentials = createUserWithValidCredentials({
          password,
          pixAuthenticationService,
          userRepository,
        });

        const externalUserToken = 'EXTERNAL_USER_TOKEN';
        const samlId = 'samlId';
        tokenService.extractExternalUserFromIdToken.withArgs(externalUserToken).returns({ samlId });

        const userFromExternalUserToken = domainBuilder.buildUser({ id: userFromCredentials.id + 1 });
        userRepository.getBySamlId.withArgs(samlId).resolves(userFromExternalUserToken);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(authenticateExternalUser)({
          username: userFromCredentials.email,
          password,
          externalUserToken: externalUserToken,
          expectedUserId: userFromCredentials.id,
          tokenService,
          pixAuthenticationService,
          authenticationMethodRepository,
          userRepository,
        });

        // then
        expect(error).to.be.instanceOf(UserAlreadyExistsWithAuthenticationMethodError);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should add GAR authentication method', async function () {
        // given
        const password = 'Azerty123*';
        const user = createUserWithValidCredentials({
          password,
          pixAuthenticationService,
          userRepository,
        });

        const externalUserToken = 'external user token';
        const samlId = 'samlId';
        _stubToEnableAddGarAuthenticationMethod({
          user,
          externalUserToken,
          samlId,
          firstName: 'Hervé',
          lastName: 'Le Terrier',
          tokenService,
          userRepository,
          authenticationMethodRepository,
        });

        // when
        await authenticateExternalUser({
          username: user.email,
          password,
          externalUserToken,
          expectedUserId: user.id,
          tokenService,
          pixAuthenticationService,
          authenticationMethodRepository,
          userRepository,
        });

        // then
        const expectedAuthenticationMethod = new AuthenticationMethod({
          identityProvider: AuthenticationMethod.identityProviders.GAR,
          externalIdentifier: samlId,
          userId: user.id,
          authenticationComplement: new AuthenticationMethod.GARAuthenticationComplement({
            firstName: 'Hervé',
            lastName: 'Le Terrier',
          }),
        });
        expect(authenticationMethodRepository.create).to.have.been.calledWith({
          authenticationMethod: expectedAuthenticationMethod,
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user should change password', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should also add GAR authentication method', async function () {
        // given
        const oneTimePassword = 'Azerty123*';
        const user = createUserWithValidCredentialsWhoShouldChangePassword({
          oneTimePassword,
          pixAuthenticationService,
          userRepository,
        });

        const externalUserToken = 'EXTERNAL_USER_TOKEN';
        const externalIdentifier = 'EXTERNAL_IDENTIFIER';
        _stubToEnableAddGarAuthenticationMethod({
          user,
          externalUserToken,
          samlId: externalIdentifier,
          firstName: 'Monique',
          lastName: 'Samoëns',
          tokenService,
          userRepository,
          authenticationMethodRepository,
        });

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        await catchErr(authenticateExternalUser)({
          username: user.email,
          password: oneTimePassword,
          externalUserToken,
          expectedUserId: user.id,
          tokenService,
          pixAuthenticationService,
          authenticationMethodRepository,
          userRepository,
        });

        // then
        const expectedAuthenticationMethod = new AuthenticationMethod({
          identityProvider: AuthenticationMethod.identityProviders.GAR,
          externalIdentifier,
          userId: user.id,
          authenticationComplement: new AuthenticationMethod.GARAuthenticationComplement({
            firstName: 'Monique',
            lastName: 'Samoëns',
          }),
        });
        expect(authenticationMethodRepository.create).to.have.been.calledWith({
          authenticationMethod: expectedAuthenticationMethod,
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should create and return password reset token', async function () {
        // given
        tokenService.createPasswordResetToken.returns('token');
        const oneTimePassword = 'Azerty123*';
        const user = createUserWithValidCredentialsWhoShouldChangePassword({
          oneTimePassword,
          pixAuthenticationService,
          userRepository,
        });

        const externalUserToken = 'EXTERNAL_USER_TOKEN';
        const externalIdentifier = 'EXTERNAL_IDENTIFIER';
        _stubToEnableAddGarAuthenticationMethod({
          user,
          externalUserToken,
          samlId: externalIdentifier,
          tokenService,
          userRepository,
          authenticationMethodRepository,
        });

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(authenticateExternalUser)({
          username: user.email,
          password: oneTimePassword,
          externalUserToken,
          expectedUserId: user.id,
          tokenService,
          pixAuthenticationService,
          authenticationMethodRepository,
          userRepository,
        });

        // then
        expect(error).to.be.an.instanceOf(UserShouldChangePasswordError);
        expect((error as $TSFixMe).message).to.equal('Erreur, vous devez changer votre mot de passe.');
        expect((error as $TSFixMe).meta).to.equal('token');
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when credentials are invalid', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject when user not found', async function () {
      // given
      const unknownUserEmail = 'foo@example.net';
      const password = 'Azerty123*';

      pixAuthenticationService.getUserByUsernameAndPassword
        .withArgs({
          username: unknownUserEmail,
          password,
          userRepository,
        })
        .rejects(new UserNotFoundError());

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(authenticateExternalUser)({
        username: unknownUserEmail,
        password,
        tokenService,
        pixAuthenticationService,
        userRepository,
      });

      // then
      expect(error).to.be.an.instanceOf(MissingOrInvalidCredentialsError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject when password does not match', async function () {
      // given
      const email = 'foo@example.net';
      const invalidPassword = 'oups123*';

      pixAuthenticationService.getUserByUsernameAndPassword
        .withArgs({
          username: email,
          password: invalidPassword,
          userRepository,
        })
        .rejects(new PasswordNotMatching());

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(authenticateExternalUser)({
        username: email,
        password: invalidPassword,
        tokenService,
        pixAuthenticationService,
        userRepository,
      });

      // then
      expect(error).to.be.an.instanceOf(MissingOrInvalidCredentialsError);
    });
  });
});

function createUserWithValidCredentials({
  password,
  pixAuthenticationService,
  userRepository
}: $TSFixMe) {
  const userId = 1;
  const email = 'john.doe@example.net';
  const pixAuthenticationMethod = AuthenticationMethod.buildPixAuthenticationMethod({ password, userId });
  const user = domainBuilder.buildUser({
    id: userId,
    email,
    authenticationMethods: [pixAuthenticationMethod],
  });
  pixAuthenticationService.getUserByUsernameAndPassword
    .withArgs({
      username: email,
      password,
      userRepository,
    })
    .resolves(user);

  return user;
}

function createUserWithValidCredentialsWhoShouldChangePassword({
  oneTimePassword,
  pixAuthenticationService,
  userRepository
}: $TSFixMe) {
  const email = 'john.doe@example.net';
  const emailAuthenticationMethod = domainBuilder.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
    hashedPassword: oneTimePassword,
    shouldChangePassword: true,
  });

  const user = domainBuilder.buildUser({
    email,
    authenticationMethods: [emailAuthenticationMethod],
  });

  pixAuthenticationService.getUserByUsernameAndPassword
    .withArgs({
      username: email,
      password: oneTimePassword,
      userRepository,
    })
    .resolves(user);

  return user;
}

function _stubToEnableAddGarAuthenticationMethod({
  user,
  externalUserToken,
  samlId = 'samlId',
  tokenService,
  userRepository,
  authenticationMethodRepository,
  firstName = 'Hervé',
  lastName = 'Le Terrier'
}: $TSFixMe) {
  tokenService.extractExternalUserFromIdToken.withArgs(externalUserToken).returns({ samlId, firstName, lastName });
  userRepository.getBySamlId.withArgs(samlId).resolves(user);
  authenticationMethodRepository.create.resolves();
}
