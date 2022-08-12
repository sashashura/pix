// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'obfuscatio... Remove this comment to see the full error message
const obfuscationService = require('../../../../lib/domain/services/obfuscation-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'authentica... Remove this comment to see the full error message
const authenticationMethodRepository = require('../../../../lib/infrastructure/repositories/authentication-method-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require('../../../../lib/domain/models/User');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../../../lib/domain/models/AuthenticationMethod');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Service | user-authentication-method-obfuscation-service', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(authenticationMethodRepository, 'findOneByUserIdAndIdentityProvider');
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    authenticationMethodRepository.findOneByUserIdAndIdentityProvider.restore();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#emailObfuscation', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return obfuscated email', function () {
      // given
      const email = 'johnHarry@example.net';

      // when
      const value = obfuscationService.emailObfuscation(email);

      // then
      expect(value).to.be.equal('j***@example.net');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#usernameObfuscation', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return obfuscated username', function () {
      // given
      const username = 'john.harry0702';

      // when
      const value = obfuscationService.usernameObfuscation(username);

      // then
      expect(value).to.be.equal('j***.h***2');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getUserAuthenticationMethodWithObfuscation', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return authenticated with samlId when user is authenticated with samlId only', async function () {
      // given
      const user = domainBuilder.buildUser();
      const authenticationMethod = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
        userId: user.id,
      });
      authenticationMethodRepository.findOneByUserIdAndIdentityProvider.resolves(authenticationMethod);

      // when
      const value = await obfuscationService.getUserAuthenticationMethodWithObfuscation(user);

      // then
      const expectedResult = {
        authenticatedBy: 'samlId',
        value: null,
      };
      expect(value).to.be.deep.equal(expectedResult);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return authenticated with samlId when user is authenticated with samlId and username', async function () {
      // given
      const username = 'john.harry.0702';
      const user = new User({ username });
      const authenticationMethod = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
        userId: user.id,
        identityProvider: AuthenticationMethod.identityProviders.GAR,
      });
      authenticationMethodRepository.findOneByUserIdAndIdentityProvider.resolves(authenticationMethod);

      // when
      const value = await obfuscationService.getUserAuthenticationMethodWithObfuscation(user);

      // then
      const expectedResult = {
        authenticatedBy: 'samlId',
        value: null,
      };
      expect(value).to.be.deep.equal(expectedResult);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return authenticated with samlId when user is authenticated with samlId, username and email', async function () {
      // given
      const username = 'john.harry.0702';
      const email = 'john.harry@example.net';
      const user = new User({ username, email });
      const authenticationMethod = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
        userId: user.id,
      });
      authenticationMethodRepository.findOneByUserIdAndIdentityProvider.resolves(authenticationMethod);

      // when
      const value = await obfuscationService.getUserAuthenticationMethodWithObfuscation(user);

      // then
      const expectedResult = {
        authenticatedBy: 'samlId',
        value: null,
      };
      expect(value).to.be.deep.equal(expectedResult);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return authenticated with username when user is authenticated with username only', async function () {
      // given
      const username = 'john.harry0702';
      const user = new User({ username });

      // when
      const value = await obfuscationService.getUserAuthenticationMethodWithObfuscation(user);
      // then
      const expectedResult = {
        authenticatedBy: 'username',
        value: 'j***.h***2',
      };
      expect(value).to.be.deep.equal(expectedResult);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return authenticated with username when user is authenticated with username and email', async function () {
      // given
      const username = 'john.harry0702';
      const email = 'john.harry@example.net';
      const user = new User({ username, email });

      // when
      const value = await obfuscationService.getUserAuthenticationMethodWithObfuscation(user);

      // then
      const expectedResult = {
        authenticatedBy: 'username',
        value: 'j***.h***2',
      };
      expect(value).to.be.deep.equal(expectedResult);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return authenticated with username when user is authenticated with email only', async function () {
      // given
      const email = 'john.harry@example.net';
      const user = new User({ email });

      // when
      const value = await obfuscationService.getUserAuthenticationMethodWithObfuscation(user);

      // then
      const expectedResult = {
        authenticatedBy: 'email',
        value: 'j***@example.net',
      };
      expect(value).to.be.deep.equal(expectedResult);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw NotFoundError when user authentication is neither username, email nor samlId', async function () {
      // given
      const user = domainBuilder.buildUser({ username: null, email: null, authenticationMethods: [] });

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(obfuscationService.getUserAuthenticationMethodWithObfuscation)(user);

      // then
      expect(error).to.be.instanceof(NotFoundError);
      expect((error as $TSFixMe).message).to.equal("Aucune méthode d'authentification trouvée dont le fournisseur d'identité est GAR ou PIX.");
    });
  });
});
