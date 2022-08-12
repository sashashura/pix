// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr } = require('../../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
  AuthenticationKeyExpired,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserAlread... Remove this comment to see the full error message
  UserAlreadyExistsWithAuthenticationMethodError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const createOidcUser = require('../../../../lib/domain/usecases/create-oidc-user');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | create-user-from-external-identity-provider', function () {
  let authenticationMethodRepository: $TSFixMe, userToCreateRepository: $TSFixMe, userRepository: $TSFixMe;
  let authenticationSessionService: $TSFixMe, oidcAuthenticationService: $TSFixMe;
  let authenticationServiceRegistry: $TSFixMe;
  let clock: $TSFixMe;
  const now = new Date('2021-01-02');

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    clock = sinon.useFakeTimers(now);

    authenticationMethodRepository = {
      findOneByExternalIdentifierAndIdentityProvider: sinon.stub(),
    };

    authenticationSessionService = {
      getByKey: sinon.stub(),
    };

    oidcAuthenticationService = {
      getUserInfo: sinon.stub(),
      createUserAccount: sinon.stub(),
      createAccessToken: sinon.stub(),
      saveIdToken: sinon.stub(),
    };

    authenticationServiceRegistry = {
      lookupAuthenticationService: sinon.stub(),
    };

    userRepository = {
      updateLastLoggedAt: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    clock.restore();
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when authentication key is expired', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an AuthenticationKeyExpired', async function () {
      // given
      const authenticationKey = 'authenticationKey';
      authenticationSessionService.getByKey.withArgs(authenticationKey).resolves(null);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(createOidcUser)({
        authenticationKey,
        authenticationMethodRepository,
        userToCreateRepository,
        authenticationSessionService,
      });

      // then
      expect(error).to.be.instanceOf(AuthenticationKeyExpired);
      expect((error as $TSFixMe).message).to.be.equal('This authentication key has expired.');
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when there is already an authentication method for this external id', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw UserAlreadyExistsWithAuthenticationMethodError', async function () {
      // given
      authenticationSessionService.getByKey.withArgs('AUTHENTICATION_KEY').resolves({
        sessionContent: { idToken: 'idToken', accessToken: 'accessToken' },
        userInfo: { firstName: 'Jean', lastName: 'Heymar', externalIdentityId: 'duGAR' },
      });
      authenticationServiceRegistry.lookupAuthenticationService
        .withArgs('SOME_IDP')
        .resolves(oidcAuthenticationService);
      authenticationMethodRepository.findOneByExternalIdentifierAndIdentityProvider
        .withArgs({ externalIdentifier: 'duGAR', identityProvider: 'SOME_IDP' })
        .resolves({ userId: 'FOUND_USER_ID' });

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(createOidcUser)({
        identityProvider: 'SOME_IDP',
        authenticationKey: 'AUTHENTICATION_KEY',
        authenticationServiceRegistry,
        authenticationSessionService,
        authenticationMethodRepository,
        userToCreateRepository,
      });

      // then
      expect(error).to.be.instanceOf(UserAlreadyExistsWithAuthenticationMethodError);
      expect((error as $TSFixMe).message).to.equal('Authentication method already exists for this external identifier.');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should create user account and return an access token, the logout url uuid and update the last logged date with the existing external user id', async function () {
    // given
    const idToken = 'idToken';
    const expectedUser = {
      firstName: 'Jean',
      lastName: 'Heymar',
      cgu: true,
      lastTermsOfServiceValidatedAt: now,
    };
    authenticationSessionService.getByKey.withArgs('AUTHENTICATION_KEY').resolves({
      sessionContent: { idToken, accessToken: 'accessToken' },
      userInfo: { firstName: 'Jean', lastName: 'Heymar', externalIdentityId: 'externalId' },
    });
    authenticationServiceRegistry.lookupAuthenticationService.withArgs('SOME_IDP').resolves(oidcAuthenticationService);
    authenticationMethodRepository.findOneByExternalIdentifierAndIdentityProvider
      .withArgs({ externalIdentifier: 'externalId', identityProvider: 'SOME_IDP' })
      .resolves(null);
    oidcAuthenticationService.createUserAccount.resolves({ userId: 10, idToken });
    oidcAuthenticationService.createAccessToken.withArgs(10).returns('accessTokenForExistingExternalUser');
    oidcAuthenticationService.saveIdToken.withArgs({ idToken, userId: 10 }).resolves('logoutUrlUUID');

    // when
    const result = await createOidcUser({
      identityProvider: 'SOME_IDP',
      authenticationKey: 'AUTHENTICATION_KEY',
      authenticationServiceRegistry,
      authenticationSessionService,
      authenticationMethodRepository,
      userToCreateRepository,
      userRepository,
    });

    // then
    expect(oidcAuthenticationService.createUserAccount).to.have.been.calledWithMatch({
      user: expectedUser,
      sessionContent: { idToken, accessToken: 'accessToken' },
      externalIdentityId: 'externalId',
      userToCreateRepository,
      authenticationMethodRepository,
    });
    sinon.assert.calledOnce(oidcAuthenticationService.createAccessToken);
    sinon.assert.calledOnce(oidcAuthenticationService.saveIdToken);
    sinon.assert.calledOnceWithExactly(userRepository.updateLastLoggedAt, { userId: 10 });
    expect(result).to.deep.equal({
      accessToken: 'accessTokenForExistingExternalUser',
      logoutUrlUUID: 'logoutUrlUUID',
    });
  });
});
