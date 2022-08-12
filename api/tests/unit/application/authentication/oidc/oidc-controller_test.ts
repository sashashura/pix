// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, hFake, catchErr } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'authentica... Remove this comment to see the full error message
const authenticationServiceRegistry = require('../../../../../lib/domain/services/authentication/authentication-service-registry');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'oidcContro... Remove this comment to see the full error message
const oidcController = require('../../../../../lib/application/authentication/oidc/oidc-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../../../../lib/config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Unauthoriz... Remove this comment to see the full error message
const { UnauthorizedError } = require('../../../../../lib/application/http-errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Controller | Authentication | OIDC', function () {
  const identityProvider = 'OIDC';

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getRedirectLogoutUrl', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when identity provider is POLE_EMPLOI', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call pole emploi authentication service to generate the redirect logout url', async function () {
        // given
        const request = {
          auth: { credentials: { userId: '123' } },
          query: {
            identity_provider: identityProvider,
            redirect_uri: 'http://example.net/',
            logout_url_uuid: '1f3dbb71-f399-4c1c-85ae-0a863c78aeea',
          },
        };
        const oidcAuthenticationService = {
          getRedirectLogoutUrl: sinon.stub(),
        };
        sinon
          .stub(authenticationServiceRegistry, 'lookupAuthenticationService')
          .withArgs(identityProvider)
          .returns(oidcAuthenticationService);

        // when
        await oidcController.getRedirectLogoutUrl(request, hFake);

        // then
        expect(authenticationServiceRegistry.lookupAuthenticationService).to.have.been.calledWith(identityProvider);
        expect(oidcAuthenticationService.getRedirectLogoutUrl).to.have.been.calledWith({
          userId: '123',
          logoutUrlUUID: '1f3dbb71-f399-4c1c-85ae-0a863c78aeea',
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getAuthenticationUrl', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call oidc authentication service to generate url', async function () {
      // given
      const request = { query: { identity_provider: identityProvider, redirect_uri: 'http:/exemple.net/' } };
      const getAuthenticationUrlStub = sinon.stub();
      const oidcAuthenticationService = {
        getAuthenticationUrl: getAuthenticationUrlStub,
      };
      sinon
        .stub(authenticationServiceRegistry, 'lookupAuthenticationService')
        .withArgs(identityProvider)
        .returns(oidcAuthenticationService);
      getAuthenticationUrlStub.returns('an authentication url');

      // when
      await oidcController.getAuthenticationUrl(request, hFake);

      //then
      expect(oidcAuthenticationService.getAuthenticationUrl).to.have.been.calledWith({
        redirectUri: 'http:/exemple.net/',
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#authenticateUser', function () {
    const code = 'ABCD';
    const redirectUri = 'http://redirectUri.fr';
    const stateSent = 'state';
    const stateReceived = 'state';

    const pixAccessToken = 'pixAccessToken';

    let request: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      request = {
        auth: { credentials: { userId: 123 } },
        deserializedPayload: {
          identityProvider,
          code,
          redirectUri,
          stateSent,
          stateReceived,
        },
      };

      sinon.stub(usecases, 'authenticateOidcUser');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should authenticate the user with payload parameters', async function () {
      // given
      const oidcAuthenticationService = {};
      sinon
        .stub(authenticationServiceRegistry, 'lookupAuthenticationService')
        .withArgs(identityProvider)
        .returns(oidcAuthenticationService);

      usecases.authenticateOidcUser.resolves({
        pixAccessToken,
        logoutUrlUUID: '0208f50b-f612-46aa-89a0-7cdb5fb0d312',
        isAuthenticationComplete: true,
      });

      // when
      await oidcController.authenticateUser(request, hFake);

      // then
      expect(usecases.authenticateOidcUser).to.have.been.calledWith({
        authenticatedUserId: undefined,
        code,
        redirectUri,
        stateReceived,
        stateSent,
        oidcAuthenticationService,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return PIX access token and logout url uuid when authentication is complete', async function () {
      // given
      const oidcAuthenticationService = {};
      sinon
        .stub(authenticationServiceRegistry, 'lookupAuthenticationService')
        .withArgs(identityProvider)
        .returns(oidcAuthenticationService);
      usecases.authenticateOidcUser.resolves({
        pixAccessToken,
        logoutUrlUUID: '0208f50b-f612-46aa-89a0-7cdb5fb0d312',
        isAuthenticationComplete: true,
      });

      // when
      const response = await oidcController.authenticateUser(request, hFake);

      // then
      const expectedResult = {
        access_token: pixAccessToken,
        logout_url_uuid: '0208f50b-f612-46aa-89a0-7cdb5fb0d312',
      };
      expect(response).to.deep.equal(expectedResult);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return UnauthorizedError if pix access token does not exist', async function () {
      // given
      const oidcAuthenticationService = {};
      sinon
        .stub(authenticationServiceRegistry, 'lookupAuthenticationService')
        .withArgs(identityProvider)
        .returns(oidcAuthenticationService);
      const authenticationKey = 'aaa-bbb-ccc';
      usecases.authenticateOidcUser.resolves({ authenticationKey });

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(oidcController.authenticateUser)(request, hFake);

      // then
      expect(error).to.be.an.instanceOf(UnauthorizedError);
      expect((error as $TSFixMe).message).to.equal("L'utilisateur n'a pas de compte Pix");
      expect((error as $TSFixMe).code).to.equal('SHOULD_VALIDATE_CGU');
      expect((error as $TSFixMe).meta).to.deep.equal({ authenticationKey });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when isSsoAccountReconciliationEnabled is false', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should send the authenticated user id for pole emploi', async function () {
        // given
        settings.featureToggles.isSsoAccountReconciliationEnabled = false;
        const identityProvider = 'POLE_EMPLOI';
        const oidcAuthenticationService = {};
        sinon
          .stub(authenticationServiceRegistry, 'lookupAuthenticationService')
          .withArgs(identityProvider)
          .returns(oidcAuthenticationService);
        request.deserializedPayload.identityProvider = identityProvider;

        usecases.authenticateOidcUser.resolves({
          pixAccessToken,
          logoutUrlUUID: '0208f50b-f612-46aa-89a0-7cdb5fb0d312',
          isAuthenticationComplete: true,
        });

        // when
        await oidcController.authenticateUser(request, hFake);

        // then
        expect(usecases.authenticateOidcUser).to.have.been.calledWith({
          authenticatedUserId: 123,
          code,
          redirectUri,
          stateReceived,
          stateSent,
          oidcAuthenticationService,
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when isSsoAccountReconciliationEnabled is true', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not send the authenticated user id for pole emploi when toggle is enabled', async function () {
        // given
        settings.featureToggles.isSsoAccountReconciliationEnabled = true;
        const identityProvider = 'POLE_EMPLOI';
        const oidcAuthenticationService = {};
        sinon
          .stub(authenticationServiceRegistry, 'lookupAuthenticationService')
          .withArgs(identityProvider)
          .returns(oidcAuthenticationService);
        request.deserializedPayload.identityProvider = identityProvider;

        usecases.authenticateOidcUser.resolves({
          pixAccessToken,
          logoutUrlUUID: '0208f50b-f612-46aa-89a0-7cdb5fb0d312',
          isAuthenticationComplete: true,
        });

        // when
        await oidcController.authenticateUser(request, hFake);

        // then
        expect(usecases.authenticateOidcUser).to.have.been.calledWith({
          authenticatedUserId: undefined,
          code,
          redirectUri,
          stateReceived,
          stateSent,
          oidcAuthenticationService,
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createUser', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create oidc user and return access token and logout url UUID', async function () {
      // given
      const request = {
        deserializedPayload: { identityProvider, authenticationKey: 'abcde' },
      };
      const accessToken = 'access.token';
      sinon
        .stub(usecases, 'createOidcUser')
        .withArgs({ authenticationKey: 'abcde', identityProvider })
        .resolves({ accessToken, logoutUrlUUID: 'logoutUrlUUID' });

      // when
      const result = await oidcController.createUser(request, hFake);

      //then
      expect(result.source.access_token).to.equal(accessToken);
      expect(result.source.logout_url_uuid).to.equal('logoutUrlUUID');
    });
  });
});
