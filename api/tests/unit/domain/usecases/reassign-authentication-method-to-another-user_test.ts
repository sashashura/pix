// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const reassignAuthenticationMethodToAnotherUser = require('../../../../lib/domain/usecases/reassign-authentication-method-to-another-user');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const { AuthenticationMethodAlreadyExistsError, UserNotFoundError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | reassign-authentication-method-to-another-user', function () {
  let authenticationMethodRepository: $TSFixMe, userRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    authenticationMethodRepository = {
      getByIdAndUserId: sinon.stub(),
      updateAuthenticationMethodUserId: sinon.stub(),
      findByUserId: sinon.stub(),
    };
    userRepository = {
      get: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When target user already has an authentication method with same identity provider', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error', async function () {
      // given
      const originUserId = domainBuilder.buildUser({ id: 1 }).id;
      const garAuthenticationMethodFromOriginUser = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
        userId: originUserId,
      });
      const targetUserId = domainBuilder.buildUser({ id: 2 }).id;
      const garAuthenticationMethodFromTargetUser = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
        userId: targetUserId,
      });
      const poleEmploiAuthenticationMethodFromTargetUser =
        domainBuilder.buildAuthenticationMethod.withPoleEmploiAsIdentityProvider({ userId: targetUserId });

      authenticationMethodRepository.getByIdAndUserId
        .withArgs({ id: garAuthenticationMethodFromOriginUser.id, userId: originUserId })
        .resolves(garAuthenticationMethodFromOriginUser);
      authenticationMethodRepository.findByUserId
        .withArgs({ userId: targetUserId })
        .resolves([garAuthenticationMethodFromTargetUser, poleEmploiAuthenticationMethodFromTargetUser]);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(reassignAuthenticationMethodToAnotherUser)({
        originUserId,
        targetUserId,
        authenticationMethodId: garAuthenticationMethodFromOriginUser.id,
        userRepository,
        authenticationMethodRepository,
      });

      // then
      expect(error).to.be.instanceOf(AuthenticationMethodAlreadyExistsError);
      expect((error as $TSFixMe).message).to.equal("L'utilisateur 2 a déjà une méthode de connexion GAR.");
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When target user does not exists', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error', async function () {
      // given
      const originUserId = domainBuilder.buildUser({ id: 1 }).id;
      const garAuthenticationMethodFromOriginUser = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
        userId: originUserId,
      });
      const nonExistingTargetUserId = originUserId + 1;
      const notFoundError = new UserNotFoundError();

      authenticationMethodRepository.getByIdAndUserId
        .withArgs({ id: garAuthenticationMethodFromOriginUser.id, userId: originUserId })
        .resolves(garAuthenticationMethodFromOriginUser);
      userRepository.get.withArgs(nonExistingTargetUserId).rejects(notFoundError);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(reassignAuthenticationMethodToAnotherUser)({
        originUserId,
        targetUserId: nonExistingTargetUserId,
        authenticationMethodId: garAuthenticationMethodFromOriginUser.id,
        userRepository,
        authenticationMethodRepository,
      });

      // then
      expect(error).to.be.instanceOf(UserNotFoundError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should update gar authentication method user id', async function () {
    // given
    const originUserId = domainBuilder.buildUser({ id: 1 }).id;
    const garAuthenticationMethodFromOriginUser = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
      userId: originUserId,
    });
    const targetUserId = domainBuilder.buildUser({ id: 2 }).id;
    const poleEmploiAuthenticationMethodFromTargetUser =
      domainBuilder.buildAuthenticationMethod.withPoleEmploiAsIdentityProvider({ userId: targetUserId });

    authenticationMethodRepository.getByIdAndUserId
      .withArgs({ id: garAuthenticationMethodFromOriginUser.id, userId: originUserId })
      .resolves(garAuthenticationMethodFromOriginUser);
    authenticationMethodRepository.findByUserId
      .withArgs({ userId: targetUserId })
      .resolves([poleEmploiAuthenticationMethodFromTargetUser]);

    // when
    await reassignAuthenticationMethodToAnotherUser({
      originUserId,
      targetUserId,
      authenticationMethodId: garAuthenticationMethodFromOriginUser.id,
      userRepository,
      authenticationMethodRepository,
    });

    // then
    expect(authenticationMethodRepository.updateAuthenticationMethodUserId).to.have.been.calledOnceWith({
      originUserId,
      identityProvider: 'GAR',
      targetUserId,
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should update pole emploi authentication method user id', async function () {
    // given
    const originUserId = domainBuilder.buildUser({ id: 1 }).id;
    const poleEmploiAuthenticationMethodFromOriginUser =
      domainBuilder.buildAuthenticationMethod.withPoleEmploiAsIdentityProvider({
        userId: originUserId,
      });
    const targetUserId = domainBuilder.buildUser({ id: 2 }).id;
    const garAuthenticationMethodFromTargetUser = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
      userId: targetUserId,
    });

    authenticationMethodRepository.getByIdAndUserId
      .withArgs({ id: poleEmploiAuthenticationMethodFromOriginUser.id, userId: originUserId })
      .resolves(poleEmploiAuthenticationMethodFromOriginUser);
    authenticationMethodRepository.findByUserId
      .withArgs({ userId: targetUserId })
      .resolves([garAuthenticationMethodFromTargetUser]);

    // when
    await reassignAuthenticationMethodToAnotherUser({
      originUserId,
      targetUserId,
      authenticationMethodId: poleEmploiAuthenticationMethodFromOriginUser.id,
      userRepository,
      authenticationMethodRepository,
    });

    // then
    expect(authenticationMethodRepository.updateAuthenticationMethodUserId).to.have.been.calledOnceWith({
      originUserId,
      identityProvider: 'POLE_EMPLOI',
      targetUserId,
    });
  });
});
