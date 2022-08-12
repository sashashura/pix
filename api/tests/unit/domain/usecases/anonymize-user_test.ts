// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const anonymizeUser = require('../../../../lib/domain/usecases/anonymize-user');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | anonymize-user', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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
