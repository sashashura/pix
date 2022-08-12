// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'revokeRefr... Remove this comment to see the full error message
const revokeRefreshToken = require('../../../../lib/domain/usecases/revoke-refresh-token');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | revoke-refresh-token', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should revoke refresh token', async function () {
    // given
    const refreshToken = 'valid refresh token';
    const refreshTokenService = { revokeRefreshToken: sinon.stub() };
    refreshTokenService.revokeRefreshToken.withArgs({ refreshToken }).returns();

    // when
    await revokeRefreshToken({ refreshToken, refreshTokenService });

    // then
    expect(refreshTokenService.revokeRefreshToken).to.have.been.calledWith({ refreshToken });
  });
});
