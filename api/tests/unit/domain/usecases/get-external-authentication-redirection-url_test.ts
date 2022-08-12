// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require('../../../../lib/domain/models/User');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../../../lib/domain/models/AuthenticationMethod');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getExternalAuthenticationRedirectionUrl = require('../../../../lib/domain/usecases/get-external-authentication-redirection-url');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-external-authentication-redirection-url', function () {
  let userRepository: $TSFixMe;
  let authenticationMethodRepository: $TSFixMe;
  let tokenService: $TSFixMe;
  let samlSettings: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    userRepository = {
      getBySamlId: sinon.stub(),
      updateLastLoggedAt: sinon.stub(),
    };

    authenticationMethodRepository = {
      findOneByUserIdAndIdentityProvider: sinon.stub(),
      update: sinon.stub(),
    };

    tokenService = {
      createIdTokenForUserReconciliation: sinon.stub(),
      createAccessTokenForSaml: sinon.stub(),
    };

    samlSettings = {
      saml: {
        attributeMapping: {
          samlId: 'IDO',
          firstName: 'PRE',
          lastName: 'NOM',
        },
      },
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user does not exist in database yet', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return campaign url with external user token', async function () {
      // given
      const userAttributes = {
        IDO: 'saml-id-for-adele',
        NOM: 'Lopez',
        PRE: 'Adèle',
      };

      tokenService.createIdTokenForUserReconciliation.returns('external-user-token');
      userRepository.getBySamlId.resolves(null);

      // when
      const result = await getExternalAuthenticationRedirectionUrl({
        userAttributes,
        userRepository,
        tokenService,
        settings: samlSettings,
      });

      // then
      expect(result).to.deep.equal('/campagnes?externalUser=external-user-token');
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user already exists in database', function () {
    let clock: $TSFixMe;
    const now = new Date('2022-03-13');

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      clock = sinon.useFakeTimers(now);
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      clock.restore();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return access token url', async function () {
      // given
      const userAttributes = {
        IDO: 'saml-id-for-adele',
        NOM: 'Lopez',
        PRE: 'Adèle',
      };
      const expectedUser = new User({
        id: 1,
        firstName: 'Adèle',
        lastName: 'Lopez',
        samlId: 'saml-id-for-adele',
      });

      userRepository.getBySamlId.withArgs('saml-id-for-adele').resolves(expectedUser);
      authenticationMethodRepository.findOneByUserIdAndIdentityProvider.resolves(
        domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider()
      );
      tokenService.createAccessTokenForSaml.returns('access-token');

      // when
      const result = await getExternalAuthenticationRedirectionUrl({
        userAttributes,
        userRepository,
        authenticationMethodRepository,
        tokenService,
        settings: samlSettings,
      });

      // then
      const expectedUrl = '/?token=access-token&user-id=1';
      expect(result).to.deep.equal(expectedUrl);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save the last login date', async function () {
      // given
      const userAttributes = {
        IDO: 'saml-id-for-adele',
        NOM: 'Lopez',
        PRE: 'Adèle',
      };
      const user = domainBuilder.buildUser({ id: 777 });

      userRepository.getBySamlId.resolves(user);
      authenticationMethodRepository.findOneByUserIdAndIdentityProvider.resolves(
        domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider()
      );
      tokenService.createIdTokenForUserReconciliation.returns('external-user-token');

      // when
      await getExternalAuthenticationRedirectionUrl({
        userAttributes,
        userRepository,
        authenticationMethodRepository,
        tokenService,
        settings: samlSettings,
      });

      // then
      expect(userRepository.updateLastLoggedAt).to.have.been.calledWith({ userId: 777 });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context("when user's authentication method does not contain first and last name", function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should save first and last name as the authentication complement and the authentication method modification date', async function () {
        // given
        const user = domainBuilder.buildUser();
        const authenticationMethodWithoutFirstAndLastName = new AuthenticationMethod({
          id: 1234,
          userId: user.id,
          identityProvider: AuthenticationMethod.identityProviders.GAR,
          authenticationComplement: null,
          externalIdentifier: 'saml-id',
          createdAt: new Date('2020-01-01'),
          updatedAt: new Date('2020-02-01'),
        });
        userRepository.getBySamlId.withArgs('saml-id').resolves(user);
        authenticationMethodRepository.findOneByUserIdAndIdentityProvider
          .withArgs({ userId: user.id, identityProvider: AuthenticationMethod.identityProviders.GAR })
          .resolves(authenticationMethodWithoutFirstAndLastName);

        // when
        await getExternalAuthenticationRedirectionUrl({
          userAttributes: { IDO: 'saml-id', NOM: 'Lisitsa', PRE: 'Vassili' },
          userRepository,
          authenticationMethodRepository,
          tokenService,
          settings: samlSettings,
        });

        // then
        const expectedAuthenticationMethod = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
          id: authenticationMethodWithoutFirstAndLastName.id,
          userId: user.id,
          identityProvider: AuthenticationMethod.identityProviders.GAR,
          userFirstName: 'Vassili',
          userLastName: 'Lisitsa',
          externalIdentifier: 'saml-id',
        });
        expect(authenticationMethodRepository.update).to.have.been.calledWith(expectedAuthenticationMethod);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context("when user's authentication method contains a different first name", function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should update first and last name in the authentication complement and the authentication method modification date', async function () {
        // given
        const { user, authenticationMethod } = _buildUserWithAuthenticationMethod({
          firstName: 'Vassili',
          lastName: 'Lisitsa',
          externalIdentifier: 'saml-id',
        });
        userRepository.getBySamlId.withArgs('saml-id').resolves(user);
        authenticationMethodRepository.findOneByUserIdAndIdentityProvider
          .withArgs({ userId: user.id, identityProvider: AuthenticationMethod.identityProviders.GAR })
          .resolves(authenticationMethod);

        // when
        await getExternalAuthenticationRedirectionUrl({
          userAttributes: { IDO: 'saml-id', NOM: 'Lisitsa', PRE: 'Valentina' },
          userRepository,
          authenticationMethodRepository,
          tokenService,
          settings: samlSettings,
        });

        // then
        const expectedAuthenticationMethod = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
          id: authenticationMethod.id,
          userId: user.id,
          identityProvider: AuthenticationMethod.identityProviders.GAR,
          userFirstName: 'Valentina',
          userLastName: 'Lisitsa',
          externalIdentifier: 'saml-id',
        });
        expect(authenticationMethodRepository.update).to.have.been.calledWith(expectedAuthenticationMethod);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context("when user's authentication method contains a different last name", function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should update first and last name in the authentication complement and the authentication method modification date', async function () {
        // given
        const { user, authenticationMethod } = _buildUserWithAuthenticationMethod({
          firstName: 'Valentina',
          lastName: 'Lisitsa',
          externalIdentifier: 'saml-id',
        });
        userRepository.getBySamlId.withArgs('saml-id').resolves(user);
        authenticationMethodRepository.findOneByUserIdAndIdentityProvider
          .withArgs({ userId: user.id, identityProvider: AuthenticationMethod.identityProviders.GAR })
          .resolves(authenticationMethod);

        // when
        await getExternalAuthenticationRedirectionUrl({
          userAttributes: { IDO: 'saml-id', NOM: 'Volk', PRE: 'Valentina' },
          userRepository,
          authenticationMethodRepository,
          tokenService,
          settings: samlSettings,
        });

        // then
        const expectedAuthenticationMethod = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
          id: authenticationMethod.id,
          userId: user.id,
          identityProvider: AuthenticationMethod.identityProviders.GAR,
          userFirstName: 'Valentina',
          userLastName: 'Volk',
          externalIdentifier: 'saml-id',
        });
        expect(authenticationMethodRepository.update).to.have.been.calledWith(expectedAuthenticationMethod);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context("when user's authentication method contains the same first and last name", function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not update first and last name in the authentication complement', async function () {
        // given
        const { user, authenticationMethod } = _buildUserWithAuthenticationMethod({
          firstName: 'Valentina',
          lastName: 'Volk',
          externalIdentifier: 'saml-id',
        });
        userRepository.getBySamlId.withArgs('saml-id').resolves(user);
        authenticationMethodRepository.findOneByUserIdAndIdentityProvider
          .withArgs({ userId: user.id, identityProvider: AuthenticationMethod.identityProviders.GAR })
          .resolves(authenticationMethod);

        // when
        await getExternalAuthenticationRedirectionUrl({
          userAttributes: { IDO: 'saml-id', NOM: 'Volk', PRE: 'Valentina' },
          userRepository,
          authenticationMethodRepository,
          tokenService,
          settings: samlSettings,
        });

        // then
        expect(authenticationMethodRepository.update).to.not.have.been.called;
      });
    });
  });
});

function _buildUserWithAuthenticationMethod({
  firstName,
  lastName,
  externalIdentifier
}: $TSFixMe) {
  const user = domainBuilder.buildUser();
  const authenticationMethod = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
    userId: user.id,
    userFirstName: firstName,
    userLastName: lastName,
    externalIdentifier: externalIdentifier,
  });
  return { user, authenticationMethod };
}
