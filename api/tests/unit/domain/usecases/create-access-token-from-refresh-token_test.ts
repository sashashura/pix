// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createAcce... Remove this comment to see the full error message
const createAccessTokenFromRefreshToken = require('../../../../lib/domain/usecases/create-access-token-from-refresh-token');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | create-access-token-from-refresh-token', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when refresh token is provided', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create a new access token', async function () {
      // given
      const accessToken = 'valid access token';
      const expirationDelaySeconds = 1;

      const refreshToken = 'valid refresh token';
      const refreshTokenService = { createAccessTokenFromRefreshToken: sinon.stub() };
      refreshTokenService.createAccessTokenFromRefreshToken
        .withArgs({ refreshToken })
        .returns({ accessToken, expirationDelaySeconds });

      // when
      const createdAccessToken = await createAccessTokenFromRefreshToken({ refreshToken, refreshTokenService });

      // then
      expect(createdAccessToken).to.deep.equal({ accessToken, expirationDelaySeconds });
    });
  });
});
