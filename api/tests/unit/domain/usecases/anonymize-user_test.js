const { expect, sinon } = require('../../../test-helper');
const anonymizeUser = require('../../../../lib/domain/usecases/anonymize-user');

describe('Unit | UseCase | anonymize-user', function () {
  it('should anonymize user and delete all authentication methods', async function () {
    // given
    const userId = 1;
    const expectedAnonymizedUser = {
      firstName: `prenom_${userId}`,
      lastName: `nom_${userId}`,
      email: `email_${userId}@example.net`,
      username: null,
    };

    const userRepository = { updateUserDetailsForAdministration: sinon.stub() };
    const authenticationMethodRepository = { removeAllAuthenticationMethodsByUserId: sinon.stub() };
    const refreshTokenService = { revokeRefreshTokensForUserId: sinon.stub() };

    // when
    await anonymizeUser({ userId, userRepository, authenticationMethodRepository, refreshTokenService });

    // then
    expect(authenticationMethodRepository.removeAllAuthenticationMethodsByUserId).to.have.been.calledWithExactly({
      userId,
    });

    expect(userRepository.updateUserDetailsForAdministration).to.have.been.calledWithExactly(
      userId,
      expectedAnonymizedUser
    );
  });

  it("should revoke all user's refresh tokens", async function () {
    // given
    const userId = 1;
    const userRepository = { updateUserDetailsForAdministration: sinon.stub() };
    const authenticationMethodRepository = { removeAllAuthenticationMethodsByUserId: sinon.stub() };
    const refreshTokenService = { revokeRefreshTokensForUserId: sinon.stub() };

    // when
    await anonymizeUser({ userId, userRepository, authenticationMethodRepository, refreshTokenService });

    // then
    expect(refreshTokenService.revokeRefreshTokensForUserId).to.have.been.calledWithExactly({ userId });
  });
});
