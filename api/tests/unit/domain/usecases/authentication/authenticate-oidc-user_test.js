const { expect, sinon, catchErr, domainBuilder } = require('../../../../test-helper');
const { UnexpectedOidcStateError, DifferentExternalIdentifierError } = require('../../../../../lib/domain/errors');
const logger = require('../../../../../lib/infrastructure/logger');

const authenticateOidcUser = require('../../../../../lib/domain/usecases/authentication/authenticate-oidc-user');
const AuthenticationSessionContent = require('../../../../../lib/domain/models/AuthenticationSessionContent');
const AuthenticationMethod = require('../../../../../lib/domain/models/AuthenticationMethod');
const moment = require('moment');
const OidcIdentityProviders = require('../../../../../lib/domain/constants/oidc-identity-providers');
const { featureToggles } = require('../../../../../lib/config');

describe('Unit | UseCase | authenticate-oidc-user', function () {
  let oidcAuthenticationService;
  let authenticationSessionService;
  let authenticationMethodRepository;
  let userRepository;
  const externalIdentityId = '094b83ac-2e20-4aa8-b438-0bc91748e4a6';

  beforeEach(function () {
    featureToggles.isSsoAccountReconciliationEnabled = true;
    oidcAuthenticationService = {
      identityProvider: OidcIdentityProviders.POLE_EMPLOI.code,
      createAccessToken: sinon.stub(),
      saveIdToken: sinon.stub(),
      createAuthenticationComplement: sinon.stub(),
      exchangeCodeForTokens: sinon.stub(),
      getUserInfo: sinon.stub(),
    };

    authenticationMethodRepository = {
      create: sinon.stub(),
      updateAuthenticationComplementByUserIdAndIdentityProvider: sinon.stub(),
      findOneByUserIdAndIdentityProvider: sinon.stub(),
    };

    authenticationSessionService = {
      save: sinon.stub(),
    };

    userRepository = {
      findByExternalIdentifier: sinon.stub(),
      updateLastLoggedAt: sinon.stub(),
    };
  });

  afterEach(async function () {
    featureToggles.isSsoAccountReconciliationEnabled = false;
  });

  context('When the request state does not match the response state', function () {
    it('should throw an UnexpectedOidcStateError', async function () {
      // given
      const stateSent = 'stateSent';
      const stateReceived = 'stateReceived';
      sinon.stub(logger, 'error');

      // when
      const error = await catchErr(authenticateOidcUser)({
        stateReceived,
        stateSent,
      });

      // then
      expect(error).to.be.an.instanceOf(UnexpectedOidcStateError);
      expect(logger.error).to.have.been.calledWith(
        `State sent ${stateSent} did not match the state received ${stateReceived}`
      );
    });
  });

  it('should retrieve authentication token', async function () {
    // given
    _fakeOidcAPI({ oidcAuthenticationService, externalIdentityId });

    // when
    await authenticateOidcUser({
      code: 'code',
      redirectUri: 'redirectUri',
      stateReceived: 'state',
      stateSent: 'state',
      oidcAuthenticationService,
      authenticationSessionService,
      authenticationMethodRepository,
      userRepository,
    });

    // then
    expect(oidcAuthenticationService.exchangeCodeForTokens).to.have.been.calledOnceWithExactly({
      code: 'code',
      redirectUri: 'redirectUri',
    });
  });

  it('should retrieve user info', async function () {
    // given
    const { sessionContent } = _fakeOidcAPI({ oidcAuthenticationService, externalIdentityId });

    // when
    await authenticateOidcUser({
      stateReceived: 'state',
      stateSent: 'state',
      oidcAuthenticationService,
      authenticationSessionService,
      authenticationMethodRepository,
      userRepository,
    });

    // then
    expect(oidcAuthenticationService.getUserInfo).to.have.been.calledWith({
      idToken: sessionContent.idToken,
      accessToken: sessionContent.accessToken,
    });
  });

  it('should retrieve user with matching external id and identity provider', async function () {
    // given
    _fakeOidcAPI({ oidcAuthenticationService, externalIdentityId });

    // when
    await authenticateOidcUser({
      stateReceived: 'state',
      stateSent: 'state',
      oidcAuthenticationService,
      authenticationSessionService,
      authenticationMethodRepository,
      userRepository,
    });

    // then
    expect(userRepository.findByExternalIdentifier).to.have.been.calledWith({
      externalIdentityId,
      identityProvider: oidcAuthenticationService.identityProvider,
    });
  });

  context('When user does not have an account', function () {
    it('should save the authentication session and return the authentication key', async function () {
      // given
      const sessionContent = _fakeOidcAPI({ oidcAuthenticationService, externalIdentityId });
      const key = 'aaa-bbb-ccc';
      authenticationSessionService.save.resolves(key);
      userRepository.findByExternalIdentifier.resolves(null);

      // when
      const result = await authenticateOidcUser({
        stateReceived: 'state',
        stateSent: 'state',
        oidcAuthenticationService,
        authenticationSessionService,
        authenticationMethodRepository,
        userRepository,
      });

      // then
      expect(authenticationSessionService.save).to.have.been.calledWith(sessionContent);
      expect(result).to.deep.equal({ authenticationKey: key, isAuthenticationComplete: false });
    });

    it('should not create an access token, save the id token in storage, or update the last logged date', async function () {
      // given
      _fakeOidcAPI({ oidcAuthenticationService, externalIdentityId });
      userRepository.findByExternalIdentifier.resolves(null);

      // when
      await authenticateOidcUser({
        stateReceived: 'state',
        stateSent: 'state',
        oidcAuthenticationService,
        authenticationSessionService,
        authenticationMethodRepository,
        userRepository,
      });

      // then
      expect(oidcAuthenticationService.saveIdToken).to.not.have.been.called;
      expect(oidcAuthenticationService.createAccessToken).to.not.have.been.called;
      expect(userRepository.updateLastLoggedAt).to.not.have.been.called;
    });
  });

  context('When user has an account', function () {
    context('When the feature toggle is not active', function () {
      beforeEach(function () {
        featureToggles.isSsoAccountReconciliationEnabled = false;
      });

      context('When the provider does not have an authentication complement', function () {
        it('should not update or create an authentication method', async function () {
          // given
          _fakeOidcAPI({ oidcAuthenticationService, externalIdentityId });
          oidcAuthenticationService.createAuthenticationComplement.returns(null);

          // when
          await authenticateOidcUser({
            authenticatedUserId: 1,
            stateReceived: 'state',
            stateSent: 'state',
            oidcAuthenticationService,
            authenticationSessionService,
            authenticationMethodRepository,
            userRepository,
          });

          // then
          expect(authenticationMethodRepository.create).not.to.have.been.called;
          expect(
            authenticationMethodRepository.updateAuthenticationComplementByUserIdAndIdentityProvider
          ).not.to.have.been.called;
        });
      });

      context('When the user does not have an oidc authentication method', function () {
        it('should add oidc authentication method to user', async function () {
          // given
          const { sessionContent } = _fakeOidcAPI({ oidcAuthenticationService, externalIdentityId });
          const authenticationComplement = new AuthenticationMethod.OidcAuthenticationComplement({
            accessToken: sessionContent.accessToken,
            refreshToken: sessionContent.refreshToken,
            expiredDate: moment().add(sessionContent.expiresIn, 's').toDate(),
          });
          oidcAuthenticationService.createAuthenticationComplement.returns(authenticationComplement);

          // when
          await authenticateOidcUser({
            authenticatedUserId: 1,
            stateReceived: 'state',
            stateSent: 'state',
            oidcAuthenticationService,
            authenticationSessionService,
            authenticationMethodRepository,
            userRepository,
          });

          // then
          const expectedAuthenticationMethod = new AuthenticationMethod({
            identityProvider: oidcAuthenticationService.identityProvider,
            externalIdentifier: externalIdentityId,
            authenticationComplement,
            userId: 1,
          });
          expect(authenticationMethodRepository.create).to.have.been.calledWith({
            authenticationMethod: expectedAuthenticationMethod,
          });
        });
      });

      context('When the user does have an oidc authentication method', function () {
        context('When the external identifier does not match the oidc authentication method', function () {
          it('should throw a DifferentExternalIdentifierError error', async function () {
            // given
            const { sessionContent } = _fakeOidcAPI({ oidcAuthenticationService, externalIdentityId });
            const authenticationComplement = new AuthenticationMethod.OidcAuthenticationComplement({
              accessToken: sessionContent.accessToken,
              refreshToken: sessionContent.refreshToken,
              expiredDate: moment().add(sessionContent.expiresIn, 's').toDate(),
            });
            oidcAuthenticationService.createAuthenticationComplement.returns(authenticationComplement);
            authenticationMethodRepository.findOneByUserIdAndIdentityProvider.resolves(
              domainBuilder.buildAuthenticationMethod.withPoleEmploiAsIdentityProvider({
                externalIdentifier: 'other_external_identifier',
              })
            );

            // when
            const error = await catchErr(authenticateOidcUser)({
              authenticatedUserId: 1,
              stateReceived: 'state',
              stateSent: 'state',
              oidcAuthenticationService,
              authenticationSessionService,
              authenticationMethodRepository,
              userRepository,
            });

            // then
            expect(error).to.be.instanceOf(DifferentExternalIdentifierError);
          });
        });

        it('should update authentication method', async function () {
          // given
          const { sessionContent } = _fakeOidcAPI({ oidcAuthenticationService, externalIdentityId });
          const authenticationComplement = new AuthenticationMethod.OidcAuthenticationComplement({
            accessToken: sessionContent.accessToken,
            refreshToken: sessionContent.refreshToken,
            expiredDate: moment().add(sessionContent.expiresIn, 's').toDate(),
          });
          oidcAuthenticationService.createAuthenticationComplement.returns(authenticationComplement);
          authenticationMethodRepository.findOneByUserIdAndIdentityProvider.resolves(
            domainBuilder.buildAuthenticationMethod.withPoleEmploiAsIdentityProvider({
              externalIdentifier: externalIdentityId,
            })
          );

          // when
          await authenticateOidcUser({
            authenticatedUserId: 1,
            stateReceived: 'state',
            stateSent: 'state',
            oidcAuthenticationService,
            authenticationSessionService,
            authenticationMethodRepository,
            userRepository,
          });

          // then
          expect(
            authenticationMethodRepository.updateAuthenticationComplementByUserIdAndIdentityProvider
          ).to.have.been.calledWith({
            authenticationComplement,
            userId: 1,
            identityProvider: oidcAuthenticationService.identityProvider,
          });
        });
      });
    });

    context('When the feature toggle is active', function () {
      context('When the provider does not have an authentication complement', function () {
        it('should not update authentication method', async function () {
          // given
          _fakeOidcAPI({ oidcAuthenticationService, externalIdentityId });
          oidcAuthenticationService.createAuthenticationComplement.returns(null);

          // when
          await authenticateOidcUser({
            authenticatedUserId: 1,
            stateReceived: 'state',
            stateSent: 'state',
            oidcAuthenticationService,
            authenticationSessionService,
            authenticationMethodRepository,
            userRepository,
          });

          // then
          expect(
            authenticationMethodRepository.updateAuthenticationComplementByUserIdAndIdentityProvider
          ).not.to.have.been.called;
        });
      });

      context('When the provider has an authentication complement', function () {
        it('should update authentication method', async function () {
          // given
          const { sessionContent } = _fakeOidcAPI({ oidcAuthenticationService, externalIdentityId });
          const authenticationComplement = new AuthenticationMethod.OidcAuthenticationComplement({
            accessToken: sessionContent.accessToken,
            refreshToken: sessionContent.refreshToken,
            expiredDate: moment().add(sessionContent.expiresIn, 's').toDate(),
          });
          oidcAuthenticationService.createAuthenticationComplement.returns(authenticationComplement);

          // when
          await authenticateOidcUser({
            authenticatedUserId: 1,
            stateReceived: 'state',
            stateSent: 'state',
            oidcAuthenticationService,
            authenticationSessionService,
            authenticationMethodRepository,
            userRepository,
          });

          // then
          expect(
            authenticationMethodRepository.updateAuthenticationComplementByUserIdAndIdentityProvider
          ).to.have.been.calledWith({
            authenticationComplement,
            userId: 1,
            identityProvider: oidcAuthenticationService.identityProvider,
          });
        });
      });
    });

    it('should return an access token, the logout url uuid and update the last logged date with the existing external user id', async function () {
      // given
      const { sessionContent } = _fakeOidcAPI({ oidcAuthenticationService, externalIdentityId });
      userRepository.findByExternalIdentifier
        .withArgs({ externalIdentityId, identityProvider: oidcAuthenticationService.identityProvider })
        .resolves({ id: 10 });
      oidcAuthenticationService.createAuthenticationComplement.returns(null);
      oidcAuthenticationService.createAccessToken.withArgs(10).returns('accessTokenForExistingExternalUser');
      oidcAuthenticationService.saveIdToken
        .withArgs({ idToken: sessionContent.idToken, userId: 10 })
        .resolves('logoutUrlUUID');

      // when
      const accessToken = await authenticateOidcUser({
        authenticatedUserId: undefined,
        stateReceived: 'state',
        stateSent: 'state',
        oidcAuthenticationService,
        authenticationSessionService,
        authenticationMethodRepository,
        userRepository,
      });

      // then
      sinon.assert.calledOnce(oidcAuthenticationService.createAccessToken);
      sinon.assert.calledOnceWithExactly(userRepository.updateLastLoggedAt, { userId: 10 });
      expect(accessToken).to.deep.equal({
        pixAccessToken: 'accessTokenForExistingExternalUser',
        logoutUrlUUID: 'logoutUrlUUID',
        isAuthenticationComplete: true,
      });
    });
  });

  context('When user is logged with their pix account but also has a separate oidc account', function () {
    it('should update the oidc authentication method', async function () {
      // given
      const { sessionContent } = _fakeOidcAPI({ oidcAuthenticationService, externalIdentityId });
      userRepository.findByExternalIdentifier
        .withArgs({ externalIdentityId, identityProvider: oidcAuthenticationService.identityProvider })
        .resolves({ id: 10 });
      const authenticationComplement = new AuthenticationMethod.OidcAuthenticationComplement({
        accessToken: sessionContent.accessToken,
        refreshToken: sessionContent.refreshToken,
        expiredDate: moment().add(sessionContent.expiresIn, 's').toDate(),
      });
      oidcAuthenticationService.createAuthenticationComplement.returns(authenticationComplement);

      // when
      await authenticateOidcUser({
        authenticatedUserId: 1,
        stateReceived: 'state',
        stateSent: 'state',
        oidcAuthenticationService,
        authenticationSessionService,
        authenticationMethodRepository,
        userRepository,
      });

      // then
      expect(
        authenticationMethodRepository.updateAuthenticationComplementByUserIdAndIdentityProvider
      ).to.have.been.calledWith({
        authenticationComplement,
        userId: 10,
        identityProvider: oidcAuthenticationService.identityProvider,
      });
    });
  });
});

function _fakeOidcAPI({ oidcAuthenticationService, externalIdentityId }) {
  const sessionContent = new AuthenticationSessionContent({
    accessToken: 'accessToken',
    idToken: 'idToken',
    expiresIn: 120,
    refreshToken: 'refreshToken',
  });
  const userInfo = {
    family_name: 'Morris',
    given_name: 'Tuck',
    externalIdentityId,
  };

  oidcAuthenticationService.exchangeCodeForTokens.resolves(sessionContent);
  oidcAuthenticationService.getUserInfo
    .withArgs({ idToken: sessionContent.idToken, accessToken: sessionContent.accessToken })
    .resolves(userInfo);

  return { userInfo, sessionContent };
}
