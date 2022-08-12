// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../../../../lib/config');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'OidcAuthen... Remove this comment to see the full error message
const OidcAuthenticationService = require('../../../../../lib/domain/services/authentication/oidc-authentication-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'jsonwebtok... Remove this comment to see the full error message
const jsonwebtoken = require('jsonwebtoken');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'httpAgent'... Remove this comment to see the full error message
const httpAgent = require('../../../../../lib/infrastructure/http/http-agent');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationSessionContent = require('../../../../../lib/domain/models/AuthenticationSessionContent');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
  AuthenticationTokenRetrievalError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidExt... Remove this comment to see the full error message
  InvalidExternalAPIResponseError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../../../../lib/infrastructure/DomainTransaction');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserToCrea... Remove this comment to see the full error message
const UserToCreate = require('../../../../../lib/domain/models/UserToCreate');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../../../../lib/domain/models/AuthenticationMethod');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../../../../lib/infrastructure/logger');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Services | oidc-authentication-service', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createAccessToken', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create access token with user id, source and identityProvider', function () {
      // given
      const userId = 42;
      const accessToken = Symbol('valid access token');
      const source = Symbol('an oidc source');
      const identityProvider = Symbol('name of identityProvider');
      settings.authentication.secret = 'a secret';
      const payload = {
        user_id: userId,
        source,
        identity_provider: identityProvider,
      };
      const secret = 'a secret';
      const jwtOptions = { expiresIn: 1 };
      sinon.stub(jsonwebtoken, 'sign').withArgs(payload, secret, jwtOptions).returns(accessToken);

      const oidcAuthenticationService = new OidcAuthenticationService({ source, identityProvider, jwtOptions });

      // when
      const result = oidcAuthenticationService.createAccessToken(userId);

      // then
      expect(result).to.equal(accessToken);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createAuthenticationComplement', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null', function () {
      // given
      const oidcAuthenticationService = new OidcAuthenticationService({});

      // when
      const result = oidcAuthenticationService.createAuthenticationComplement();

      // then
      expect(result).to.be.null;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#saveIdToken', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null', async function () {
      // given
      const oidcAuthenticationService = new OidcAuthenticationService({});

      // when
      const result = await oidcAuthenticationService.saveIdToken();

      // then
      expect(result).to.be.null;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#exchangeCodeForTokens', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return id token', async function () {
      // given
      const clientId = 'OIDC_CLIENT_ID';
      const tokenUrl = 'http://oidc.net/api/token';
      const clientSecret = 'OIDC_CLIENT_SECRET';
      const accessToken = Symbol('access token');
      const expiresIn = Symbol(60);
      const idToken = Symbol('idToken');
      const refreshToken = Symbol('refreshToken');

      const oidcAuthenticationSessionContent = new AuthenticationSessionContent({
        idToken,
        accessToken,
        expiresIn,
        refreshToken,
      });

      sinon.stub(httpAgent, 'post');
      httpAgent.post.resolves({
        isSuccessful: true,
        data: {
          id_token: oidcAuthenticationSessionContent.idToken,
          access_token: oidcAuthenticationSessionContent.accessToken,
          refresh_token: oidcAuthenticationSessionContent.refreshToken,
          expires_in: oidcAuthenticationSessionContent.expiresIn,
        },
      });

      const oidcAuthenticationService = new OidcAuthenticationService({ clientSecret, clientId, tokenUrl });

      // when
      const result = await oidcAuthenticationService.exchangeCodeForTokens({
        code: 'AUTH_CODE',
        redirectUri: 'pix.net/connexion/oidc',
      });

      // then
      const expectedData = `client_secret=OIDC_CLIENT_SECRET&grant_type=authorization_code&code=AUTH_CODE&client_id=OIDC_CLIENT_ID&redirect_uri=pix.net%2Fconnexion%2Foidc`;
      const expectedHeaders = { 'content-type': 'application/x-www-form-urlencoded' };

      expect(httpAgent.post).to.have.been.calledWith({
        url: 'http://oidc.net/api/token',
        payload: expectedData,
        headers: expectedHeaders,
      });
      expect(result).to.be.an.instanceOf(AuthenticationSessionContent);
      expect(result).to.deep.equal(oidcAuthenticationSessionContent);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when tokens retrieval fails', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should log error and throw AuthenticationTokenRetrievalError', async function () {
        // given
        const clientId = 'OIDC_CLIENT_ID';
        const tokenUrl = 'http://oidc.net/api/token';
        const clientSecret = 'OIDC_CLIENT_SECRET';

        sinon.stub(httpAgent, 'post');
        httpAgent.post.resolves({
          isSuccessful: false,
          code: 400,
          data: {
            error: 'invalid_client',
            error_description: 'Invalid authentication method for accessing this endpoint.',
          },
        });

        const oidcAuthenticationService = new OidcAuthenticationService({ clientSecret, clientId, tokenUrl });

        // when
        const error = await catchErr(
          oidcAuthenticationService.exchangeCodeForTokens,
          oidcAuthenticationService
        )({
          code: 'AUTH_CODE',
          redirectUri: 'pix.net/connexion/oidc',
        });

        // then
        expect(error).to.be.an.instanceOf(AuthenticationTokenRetrievalError);
        expect((error as $TSFixMe).message).to.equal('{"error":"invalid_client","error_description":"Invalid authentication method for accessing this endpoint."}');
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getAuthenticationUrl', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return authentication url', async function () {
      // given
      const authenticationUrl = 'http://authenticationurl.net';
      const clientId = 'OIDC_CLIENT_ID';
      const authenticationUrlParameters = [
        { key: 'realm', value: '/individu' },
        { key: 'scope', value: `openid profile` },
      ];
      const redirectUri = 'https://example.org/please-redirect-to-me';

      const oidcAuthenticationService = new OidcAuthenticationService({
        authenticationUrl,
        clientId,
        authenticationUrlParameters,
      });

      // when
      const { redirectTarget } = oidcAuthenticationService.getAuthenticationUrl({ redirectUri });

      // then
      // @ts-expect-error TS(2351): This expression is not constructable.
      const parsedRedirectTarget = new URL(redirectTarget);
      const queryParams = parsedRedirectTarget.searchParams;
      const uuidV4Regex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
      expect(parsedRedirectTarget.protocol).to.equal('http:');
      expect(parsedRedirectTarget.hostname).to.equal('authenticationurl.net');
      expect(queryParams.get('state')).to.match(uuidV4Regex);
      expect(queryParams.get('nonce')).to.match(uuidV4Regex);
      expect(queryParams.get('client_id')).to.equal('OIDC_CLIENT_ID');
      expect(queryParams.get('redirect_uri')).to.equal('https://example.org/please-redirect-to-me');
      expect(queryParams.get('response_type')).to.equal('code');
      expect(queryParams.get('scope')).to.equal('openid profile');
      expect(queryParams.get('realm')).to.equal('/individu');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getUserInfo', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return nonce, firstName, lastName and external identity id', async function () {
      // given
      function generateIdToken(payload: $TSFixMe) {
        return jsonwebtoken.sign(
          {
            ...payload,
          },
          'secret'
        );
      }

      const idToken = generateIdToken({
        given_name: 'givenName',
        family_name: 'familyName',
        nonce: 'bb041272-d6e6-457c-99fb-ff1aa02217fd',
        sub: '094b83ac-2e20-4aa8-b438-0bc91748e4a6',
      });

      const oidcAuthenticationService = new OidcAuthenticationService({});

      // when
      const result = await oidcAuthenticationService.getUserInfo({
        idToken,
        accessToken: 'accessToken',
      });

      // then
      expect(result).to.deep.equal({
        firstName: 'givenName',
        lastName: 'familyName',
        nonce: 'bb041272-d6e6-457c-99fb-ff1aa02217fd',
        externalIdentityId: '094b83ac-2e20-4aa8-b438-0bc91748e4a6',
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when required properties are not returned in id token', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call userInfo endpoint', async function () {
        // given
        function generateIdToken(payload: $TSFixMe) {
          return jsonwebtoken.sign(
            {
              ...payload,
            },
            'secret'
          );
        }
        const idToken = generateIdToken({
          nonce: 'bb041272-d6e6-457c-99fb-ff1aa02217fd',
          sub: '094b83ac-2e20-4aa8-b438-0bc91748e4a6',
        });
        const userInfoUrl = 'infoUrl';

        const oidcAuthenticationService = new OidcAuthenticationService({ userInfoUrl });
        sinon.stub(oidcAuthenticationService, '_getContentFromUserInfoEndpoint');

        // when
        await oidcAuthenticationService.getUserInfo({
          idToken,
          accessToken: 'accessToken',
        });

        // then
        expect(oidcAuthenticationService._getContentFromUserInfoEndpoint).to.have.been.calledOnceWithExactly({
          accessToken: 'accessToken',
          userInfoUrl,
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#_getContentFromUserInfoEndpoint', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return nonce, firstName, lastName and external identity id', async function () {
      // given
      sinon.stub(httpAgent, 'get').resolves({
        isSuccessful: true,
        data: {
          given_name: 'givenName',
          family_name: 'familyName',
          nonce: 'bb041272-d6e6-457c-99fb-ff1aa02217fd',
          sub: '094b83ac-2e20-4aa8-b438-0bc91748e4a6',
        },
      });

      const oidcAuthenticationService = new OidcAuthenticationService({ userInfoUrl: 'userInfoUrl' });

      // when
      const result = await oidcAuthenticationService._getContentFromUserInfoEndpoint({
        accessToken: 'accessToken',
        userInfoUrl: 'userInfoUrl',
      });

      // then
      expect(result).to.deep.equal({
        given_name: 'givenName',
        family_name: 'familyName',
        sub: '094b83ac-2e20-4aa8-b438-0bc91748e4a6',
        nonce: 'bb041272-d6e6-457c-99fb-ff1aa02217fd',
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when required properties are not returned by external API', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw error', async function () {
        // given
        sinon.stub(httpAgent, 'get').resolves({
          isSuccessful: true,
          data: {
            given_name: 'givenName',
            family_name: undefined,
            nonce: 'bb041272-d6e6-457c-99fb-ff1aa02217fd',
            sub: '094b83ac-2e20-4aa8-b438-0bc91748e4a6',
          },
        });
        sinon.stub(logger, 'error');
        const oidcAuthenticationService = new OidcAuthenticationService({ userInfoUrl: 'userInfoUrl' });

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(oidcAuthenticationService._getContentFromUserInfoEndpoint)({
          accessToken: 'accessToken',
          userInfoUrl: 'userInfoUrl',
        });

        // then
        expect(error).to.be.instanceOf(InvalidExternalAPIResponseError);
        expect((error as $TSFixMe).message).to.be.equal('Les informations utilisateurs récupérées sont incorrectes.');
        const expectedMessage = `Un des champs obligatoires n'a pas été renvoyé : ${JSON.stringify({
          given_name: 'givenName',
          nonce: 'bb041272-d6e6-457c-99fb-ff1aa02217fd',
          sub: '094b83ac-2e20-4aa8-b438-0bc91748e4a6',
        })}.`;
        expect(logger.error).to.have.been.calledWith(expectedMessage);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when call to external API fails', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw error', async function () {
        // given
        const anError = new Error('something bad happened');
        sinon.stub(httpAgent, 'get').rejects(anError);
        sinon.stub(logger, 'error');
        const oidcAuthenticationService = new OidcAuthenticationService({ userInfoUrl: 'userInfoUrl' });

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(oidcAuthenticationService._getContentFromUserInfoEndpoint)({
          accessToken: 'accessToken',
          userInfoUrl: 'userInfoUrl',
        });

        // then
        expect(error).to.be.instanceOf(InvalidExternalAPIResponseError);
        expect((error as $TSFixMe).message).to.be.equal('Une erreur est survenue en récupérant les information des utilisateurs');
        expect(logger.error).to.have.been.calledWith(
          'Une erreur est survenue en récupérant les information des utilisateurs.'
        );
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createUserAccount', function () {
    let userToCreateRepository: $TSFixMe, authenticationMethodRepository: $TSFixMe;
    let domainTransaction: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      domainTransaction = Symbol();
      DomainTransaction.execute = (lambda: $TSFixMe) => {
        return lambda(domainTransaction);
      };

      userToCreateRepository = {
        create: sinon.stub(),
      };
      authenticationMethodRepository = {
        create: sinon.stub(),
      };
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#createUserAccount', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return user id', async function () {
        // given
        const externalIdentityId = '1233BBBC';
        const user = new UserToCreate({
          firstName: 'Adam',
          lastName: 'Troisjours',
        });
        const userId = 1;
        userToCreateRepository.create.withArgs({ user, domainTransaction }).resolves({ id: userId });

        const identityProvider = 'CNAV';
        const expectedAuthenticationMethod = new AuthenticationMethod({
          identityProvider,
          externalIdentifier: externalIdentityId,
          userId,
        });
        const oidcAuthenticationService = new OidcAuthenticationService({ identityProvider });

        // when
        const result = await oidcAuthenticationService.createUserAccount({
          user,
          externalIdentityId,
          userToCreateRepository,
          authenticationMethodRepository,
        });

        // then
        expect(authenticationMethodRepository.create).to.have.been.calledWith({
          authenticationMethod: expectedAuthenticationMethod,
          domainTransaction,
        });
        expect(result).to.be.deep.equal({ userId });
      });
    });
  });
});
