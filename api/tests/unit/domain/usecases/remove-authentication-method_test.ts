// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const removeAuthenticationMethod = require('../../../../lib/domain/usecases/remove-authentication-method');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToRemoveAuthenticationMethod } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../../../lib/domain/models/AuthenticationMethod');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | remove-authentication-method', function () {
  let userRepository: $TSFixMe;
  let authenticationMethodRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    userRepository = {
      get: sinon.stub(),
      updateEmail: sinon.stub(),
      updateUsername: sinon.stub(),
    };
    authenticationMethodRepository = {
      findByUserId: sinon.stub(),
      removeByUserIdAndIdentityProvider: sinon.stub(),
    };
  });

  function buildPIXAndGARAndPoleEmploiAuthenticationMethod(userId: $TSFixMe) {
    return [
      domainBuilder.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({ userId }),
      domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({ userId }),
      domainBuilder.buildAuthenticationMethod.withPoleEmploiAsIdentityProvider({ userId }),
    ];
  }

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When type is EMAIL', function () {
    const type = 'EMAIL';

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should set the email to null', async function () {
      // given
      const user = domainBuilder.buildUser();
      userRepository.get.resolves(user);
      const authenticationMethods = buildPIXAndGARAndPoleEmploiAuthenticationMethod(user.id);
      authenticationMethodRepository.findByUserId.resolves(authenticationMethods);

      // when
      await removeAuthenticationMethod({ userId: user.id, type, userRepository, authenticationMethodRepository });

      // then
      expect(userRepository.updateEmail).to.have.been.calledWith({ id: user.id, email: null });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When user does not have a username', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should remove PIX authentication method', async function () {
        // given
        const user = domainBuilder.buildUser({ username: null });
        userRepository.get.resolves(user);
        const authenticationMethods = buildPIXAndGARAndPoleEmploiAuthenticationMethod(user.id);
        authenticationMethodRepository.findByUserId.resolves(authenticationMethods);

        // when
        await removeAuthenticationMethod({ userId: user.id, type, userRepository, authenticationMethodRepository });

        // then
        expect(authenticationMethodRepository.removeByUserIdAndIdentityProvider).to.have.been.calledWith({
          userId: user.id,
          identityProvider: AuthenticationMethod.identityProviders.PIX,
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When user has a username', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not remove PIX authentication method', async function () {
        // given
        const user = domainBuilder.buildUser({ username: 'john.doe0101' });
        userRepository.get.resolves(user);
        const authenticationMethods = buildPIXAndGARAndPoleEmploiAuthenticationMethod(user.id);
        authenticationMethodRepository.findByUserId.resolves(authenticationMethods);

        // when
        await removeAuthenticationMethod({ userId: user.id, type, userRepository, authenticationMethodRepository });

        // then
        expect(authenticationMethodRepository.removeByUserIdAndIdentityProvider).to.not.have.been.called;
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When type is USERNAME', function () {
    const type = 'USERNAME';

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should set the username to null', async function () {
      // given
      const user = domainBuilder.buildUser();
      userRepository.get.resolves(user);
      const authenticationMethods = buildPIXAndGARAndPoleEmploiAuthenticationMethod(user.id);
      authenticationMethodRepository.findByUserId.resolves(authenticationMethods);

      // when
      await removeAuthenticationMethod({ userId: user.id, type, userRepository, authenticationMethodRepository });

      // then
      expect(userRepository.updateUsername).to.have.been.calledWith({ id: user.id, username: null });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When user does not have an email', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should remove PIX authentication method', async function () {
        // given
        const user = domainBuilder.buildUser({ email: null });
        userRepository.get.resolves(user);
        const authenticationMethods = buildPIXAndGARAndPoleEmploiAuthenticationMethod(user.id);
        authenticationMethodRepository.findByUserId.resolves(authenticationMethods);

        // when
        await removeAuthenticationMethod({ userId: user.id, type, userRepository, authenticationMethodRepository });

        // then
        expect(authenticationMethodRepository.removeByUserIdAndIdentityProvider).to.have.been.calledWith({
          userId: user.id,
          identityProvider: AuthenticationMethod.identityProviders.PIX,
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When user has an email', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not remove PIX authentication method', async function () {
        // given
        const user = domainBuilder.buildUser({ email: 'john.doe@example.net' });
        userRepository.get.resolves(user);
        const authenticationMethods = buildPIXAndGARAndPoleEmploiAuthenticationMethod(user.id);
        authenticationMethodRepository.findByUserId.resolves(authenticationMethods);

        // when
        await removeAuthenticationMethod({ userId: user.id, type, userRepository, authenticationMethodRepository });

        // then
        expect(authenticationMethodRepository.removeByUserIdAndIdentityProvider).to.not.have.been.called;
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When type is GAR', function () {
    const type = 'GAR';

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should remove GAR authentication method', async function () {
      // given
      const user = domainBuilder.buildUser();
      userRepository.get.resolves(user);
      const authenticationMethods = buildPIXAndGARAndPoleEmploiAuthenticationMethod(user.id);
      authenticationMethodRepository.findByUserId.resolves(authenticationMethods);

      // when
      await removeAuthenticationMethod({ userId: user.id, type, userRepository, authenticationMethodRepository });

      // then
      expect(authenticationMethodRepository.removeByUserIdAndIdentityProvider).to.have.been.calledWith({
        userId: user.id,
        identityProvider: AuthenticationMethod.identityProviders.GAR,
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When type is POLE_EMPLOI', function () {
    const type = 'POLE_EMPLOI';

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should remove POLE_EMPLOI authentication method', async function () {
      // given
      const user = domainBuilder.buildUser();
      userRepository.get.resolves(user);
      const authenticationMethods = buildPIXAndGARAndPoleEmploiAuthenticationMethod(user.id);
      authenticationMethodRepository.findByUserId.resolves(authenticationMethods);

      // when
      await removeAuthenticationMethod({ userId: user.id, type, userRepository, authenticationMethodRepository });

      // then
      expect(authenticationMethodRepository.removeByUserIdAndIdentityProvider).to.have.been.calledWith({
        userId: user.id,
        identityProvider: AuthenticationMethod.identityProviders.POLE_EMPLOI,
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When there is only one remaining authentication method', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a UserNotAuthorizedToRemoveAuthenticationMethod', async function () {
      // given
      const user = domainBuilder.buildUser();
      userRepository.get.resolves(user);
      const authenticationMethod = domainBuilder.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
        userId: user.id,
      });
      authenticationMethodRepository.findByUserId.resolves([authenticationMethod]);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(removeAuthenticationMethod)({
        userId: user.id,
        type: 'EMAIL',
        userRepository,
        authenticationMethodRepository,
      });

      // then
      expect(error).to.be.an.instanceOf(UserNotAuthorizedToRemoveAuthenticationMethod);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not remove the authentication method', async function () {
      // given
      const user = domainBuilder.buildUser();
      userRepository.get.resolves(user);
      const authenticationMethod = domainBuilder.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
        userId: user.id,
      });
      authenticationMethodRepository.findByUserId.resolves([authenticationMethod]);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      await catchErr(removeAuthenticationMethod)({
        userId: user.id,
        type: 'EMAIL',
        userRepository,
        authenticationMethodRepository,
      });

      // then
      expect(authenticationMethodRepository.removeByUserIdAndIdentityProvider).to.not.have.been.called;
    });
  });
});
