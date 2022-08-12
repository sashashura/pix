// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const authenticateUser = require('../../../../lib/domain/usecases/authenticate-user');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require('../../../../lib/domain/models/User');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AdminMembe... Remove this comment to see the full error message
const AdminMember = require('../../../../lib/domain/models/AdminMember');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
  UserNotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MissingOrI... Remove this comment to see the full error message
  MissingOrInvalidCredentialsError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ForbiddenA... Remove this comment to see the full error message
  ForbiddenAccess,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserShould... Remove this comment to see the full error message
  UserShouldChangePasswordError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'endTestScr... Remove this comment to see the full error message
const endTestScreenRemovalService = require('../../../../lib/domain/services/end-test-screen-removal-service');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const appMessages = require('../../../../lib/domain/constants');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | UseCase | authenticate-user', function () {
  let refreshTokenService: $TSFixMe;
  let userRepository: $TSFixMe;
  let adminMemberRepository: $TSFixMe;
  let pixAuthenticationService: $TSFixMe;

  const userEmail = 'user@example.net';
  const password = 'Password1234';

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    refreshTokenService = {
      createRefreshTokenFromUserId: sinon.stub(),
      createAccessTokenFromRefreshToken: sinon.stub(),
    };
    userRepository = {
      getByUsernameOrEmailWithRoles: sinon.stub(),
      updateLastLoggedAt: sinon.stub(),
    };
    adminMemberRepository = {
      get: sinon.stub(),
    };
    pixAuthenticationService = {
      getUserByUsernameAndPassword: sinon.stub(),
    };
    sinon.stub(endTestScreenRemovalService, 'isEndTestScreenRemovalEnabledForSomeCertificationCenter');
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('check acces by pix scope', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when scope is pix-orga', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should rejects an error when user is not linked to any organizations', async function () {
        // given
        const scope = appMessages.PIX_ORGA.SCOPE;
        const user = new User({ email: userEmail, memberships: [] });
        pixAuthenticationService.getUserByUsernameAndPassword.resolves(user);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(authenticateUser)({
          username: userEmail,
          password,
          scope,
          pixAuthenticationService,
          userRepository,
        });

        // then
        expect(error).to.be.an.instanceOf(ForbiddenAccess);
        expect((error as $TSFixMe).message).to.be.equal(appMessages.PIX_ORGA.NOT_LINKED_ORGANIZATION_MSG);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when scope is pix-admin', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an error when user has no role and is therefore not an admin member', async function () {
        // given
        const scope = appMessages.PIX_ADMIN.SCOPE;
        const user = new User({ email: userEmail });
        pixAuthenticationService.getUserByUsernameAndPassword.resolves(user);
        adminMemberRepository.get.withArgs({ userId: user.id }).resolves();

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(authenticateUser)({
          username: userEmail,
          password,
          scope,
          pixAuthenticationService,
          userRepository,
          adminMemberRepository,
        });

        // then
        expect(error).to.be.an.instanceOf(ForbiddenAccess);
        expect((error as $TSFixMe).message).to.be.equal(appMessages.PIX_ADMIN.NOT_ALLOWED_MSG);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an error when user has a role but admin membership is disabled', async function () {
        // given
        const scope = appMessages.PIX_ADMIN.SCOPE;
        const user = new User({ email: userEmail });
        const adminMember = new AdminMember({
          id: 567,
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: 'CERTIF',
          createdAt: undefined,
          updatedAt: undefined,
          disabledAt: new Date(),
        });
        pixAuthenticationService.getUserByUsernameAndPassword.resolves(user);
        adminMemberRepository.get.withArgs({ userId: user.id }).resolves(adminMember);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(authenticateUser)({
          username: userEmail,
          password,
          scope,
          pixAuthenticationService,
          userRepository,
          adminMemberRepository,
        });

        // then
        expect(error).to.be.an.instanceOf(ForbiddenAccess);
        expect((error as $TSFixMe).message).to.be.equal(appMessages.PIX_ADMIN.NOT_ALLOWED_MSG);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should resolve a valid JWT access token when admin member is not disabled and has a valid role', async function () {
        // given
        const scope = appMessages.PIX_ADMIN.SCOPE;
        const source = 'pix';
        const user = new User({ id: 123, email: userEmail });
        const adminMember = new AdminMember({
          id: 567,
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: 'CERTIF',
          createdAt: undefined,
          updatedAt: undefined,
          disabledAt: null,
        });

        pixAuthenticationService.getUserByUsernameAndPassword.resolves(user);
        adminMemberRepository.get.withArgs({ userId: user.id }).resolves(adminMember);

        const refreshToken = '';
        const accessToken = '';
        const expirationDelaySeconds = '';

        refreshTokenService.createRefreshTokenFromUserId
          .withArgs({
            userId: user.id,
            source,
          })
          .returns(refreshToken);
        refreshTokenService.createAccessTokenFromRefreshToken
          .withArgs({ refreshToken })
          .resolves({ accessToken, expirationDelaySeconds });

        // when
        const result = await authenticateUser({
          username: userEmail,
          password,
          scope,
          source,
          pixAuthenticationService,
          userRepository,
          adminMemberRepository,
          refreshTokenService,
        });

        // then
        expect(pixAuthenticationService.getUserByUsernameAndPassword).to.have.been.calledWithExactly({
          username: userEmail,
          password,
          userRepository,
        });
        expect(result).to.deep.equal({ accessToken, refreshToken, expirationDelaySeconds });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when scope is pix-certif', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when user is not linked to any certification centers', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should rejects an error when feature toggle is disabled for all certification center', async function () {
          // given
          const scope = appMessages.PIX_CERTIF.SCOPE;
          const user = domainBuilder.buildUser({ email: userEmail, certificationCenterMemberships: [] });
          pixAuthenticationService.getUserByUsernameAndPassword.resolves(user);
          endTestScreenRemovalService.isEndTestScreenRemovalEnabledForSomeCertificationCenter.resolves(false);

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(authenticateUser)({
            username: userEmail,
            password,
            scope,
            pixAuthenticationService,
            userRepository,
          });

          // then
          expect(error).to.be.an.instanceOf(ForbiddenAccess);
          expect((error as $TSFixMe).message).to.be.equal(appMessages.PIX_CERTIF.NOT_LINKED_CERTIFICATION_MSG);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should resolves a valid JWT access token when feature toggle is enabled', async function () {
          // given
          const scope = appMessages.PIX_CERTIF.SCOPE;
          const accessToken = 'jwt.access.token';
          const refreshToken = 'jwt.refresh.token';
          const expirationDelaySeconds = 1;
          const source = 'pix';
          const user = domainBuilder.buildUser({
            email: userEmail,
            certificationCenterMemberships: [Symbol('certificationCenterMembership')],
          });

          endTestScreenRemovalService.isEndTestScreenRemovalEnabledForSomeCertificationCenter.resolves(true);
          pixAuthenticationService.getUserByUsernameAndPassword.resolves(user);
          refreshTokenService.createRefreshTokenFromUserId
            .withArgs({
              userId: user.id,
              source,
            })
            .returns(refreshToken);
          refreshTokenService.createAccessTokenFromRefreshToken
            .withArgs({ refreshToken })
            .resolves({ accessToken, expirationDelaySeconds });

          // when
          await authenticateUser({
            username: userEmail,
            password,
            scope,
            source,
            pixAuthenticationService,
            refreshTokenService,
            userRepository,
            endTestScreenRemovalService,
          });

          // then
          expect(pixAuthenticationService.getUserByUsernameAndPassword).to.have.been.calledWithExactly({
            username: userEmail,
            password,
            userRepository,
          });
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should resolves a valid JWT access token when authentication succeeded', async function () {
    // given
    const accessToken = 'jwt.access.token';
    const refreshToken = 'jwt.refresh.token';
    const source = 'pix';
    const expirationDelaySeconds = 1;
    const user = domainBuilder.buildUser({ email: userEmail });

    pixAuthenticationService.getUserByUsernameAndPassword.resolves(user);
    refreshTokenService.createRefreshTokenFromUserId
      .withArgs({
        userId: user.id,
        source,
      })
      .returns(refreshToken);
    refreshTokenService.createAccessTokenFromRefreshToken
      .withArgs({ refreshToken })
      .resolves({ accessToken, expirationDelaySeconds });

    // when
    const result = await authenticateUser({
      username: userEmail,
      password,
      source,
      pixAuthenticationService,
      refreshTokenService,
      userRepository,
    });

    // then
    expect(pixAuthenticationService.getUserByUsernameAndPassword).to.have.been.calledWithExactly({
      username: userEmail,
      password,
      userRepository,
    });
    expect(result).to.deep.equal({ accessToken, refreshToken, expirationDelaySeconds });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should save the last date of login when authentication succeeded', async function () {
    // given
    const accessToken = 'jwt.access.token';
    const source = 'pix';
    const expirationDelaySeconds = 1;
    const user = domainBuilder.buildUser({ email: userEmail });

    pixAuthenticationService.getUserByUsernameAndPassword.resolves(user);
    refreshTokenService.createAccessTokenFromRefreshToken.resolves({ accessToken, expirationDelaySeconds });

    // when
    await authenticateUser({
      username: userEmail,
      password,
      source,
      pixAuthenticationService,
      refreshTokenService,
      userRepository,
    });

    // then
    expect(userRepository.updateLastLoggedAt).to.have.been.calledWithExactly({ userId: user.id });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should rejects an error when given username (email) does not match an existing one', async function () {
    // given
    const unknownUserEmail = 'unknown_user_email@example.net';
    pixAuthenticationService.getUserByUsernameAndPassword.rejects(new UserNotFoundError());

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(authenticateUser)({
      username: unknownUserEmail,
      password,
      userRepository,
    });

    // then
    expect(error).to.be.an.instanceOf(MissingOrInvalidCredentialsError);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should rejects an error when given password does not match the found user’s one', async function () {
    // given
    pixAuthenticationService.getUserByUsernameAndPassword.rejects(new MissingOrInvalidCredentialsError());

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(authenticateUser)({
      username: userEmail,
      password,
      userRepository,
    });

    // then
    expect(error).to.be.an.instanceOf(MissingOrInvalidCredentialsError);
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user should change password', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw UserShouldChangePasswordError', async function () {
      // given
      const tokenService = { createPasswordResetToken: sinon.stub() };

      const user = domainBuilder.buildUser({ username: 'jean.neymar2008' });
      const authenticationMethod = domainBuilder.buildAuthenticationMethod.withPixAsIdentityProviderAndRawPassword({
        userId: user.id,
        rawPassword: 'Password1234',
        shouldChangePassword: true,
      });
      user.authenticationMethods = [authenticationMethod];

      pixAuthenticationService.getUserByUsernameAndPassword
        .withArgs({
          username: 'jean.neymar2008',
          password: 'Password1234',
          userRepository,
        })
        .resolves(user);
      tokenService.createPasswordResetToken.withArgs(user.id).returns('RESET_PASSWORD_TOKEN');

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(authenticateUser)({
        username: 'jean.neymar2008',
        password: 'Password1234',
        userRepository,
        pixAuthenticationService,
        endTestScreenRemovalService,
        tokenService,
      });

      // then
      expect(error).to.be.an.instanceOf(UserShouldChangePasswordError);
      expect((error as $TSFixMe).message).to.equal('Erreur, vous devez changer votre mot de passe.');
      expect((error as $TSFixMe).meta).to.equal('RESET_PASSWORD_TOKEN');
    });
  });
});
