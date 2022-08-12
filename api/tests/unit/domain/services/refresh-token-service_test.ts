// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../../../lib/config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('../../../../lib/domain/services/token-service');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const refreshTokenService = require('../../../../lib/domain/services/refresh-token-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Unauthoriz... Remove this comment to see the full error message
const { UnauthorizedError } = require('../../../../lib/application/http-errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'temporaryS... Remove this comment to see the full error message
const temporaryStorage = refreshTokenService.temporaryStorageForTests;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Service | Refresh Token Service', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createRefreshTokenFromUserId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create refresh access token with user id and source', async function () {
      // given
      const userId = 123;
      const source = 'pix';
      const value = {
        type: 'refresh_token',
        userId,
        source,
      };
      const expirationDelaySeconds = settings.authentication.refreshTokenLifespanMs / 1000;

      sinon
        .stub(temporaryStorage, 'save')
        .withArgs(sinon.match({ key: sinon.match(/^123:[-0-9a-f]+$/), value, expirationDelaySeconds }))
        .resolves('123:aaaabbbb-1111-ffff-8888-7777dddd0000');

      // when
      const result = await refreshTokenService.createRefreshTokenFromUserId({ userId, source });

      // then
      expect(result).to.equal('123:aaaabbbb-1111-ffff-8888-7777dddd0000');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createAccessTokenFromRefreshToken', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when refresh token is valid', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should create access token with user id and source and return it with expiration delay in seconds', async function () {
        // given
        const userId = 123;
        const source = 'pix';
        const refreshToken = 'valid-refresh-token';
        const accessToken = 'valid-access-token';
        const expirationDelaySeconds = 1;
        sinon.stub(temporaryStorage, 'get').withArgs(refreshToken).resolves({ userId, source });
        sinon
          .stub(tokenService, 'createAccessTokenFromUser')
          .withArgs(userId, source)
          .resolves({ accessToken, expirationDelaySeconds });

        // when
        const result = await refreshTokenService.createAccessTokenFromRefreshToken({ refreshToken });

        // then
        expect(result).to.be.deep.equal({ accessToken, expirationDelaySeconds });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when refresh token has expired or has been revoked', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an UnauthorizedError with specific code and message', async function () {
        // given
        const revokedRefreshToken = 'revoked-refresh-token';
        sinon.stub(temporaryStorage, 'get').withArgs(revokedRefreshToken).resolves();

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(refreshTokenService.createAccessTokenFromRefreshToken)({
          refreshToken: revokedRefreshToken,
        });

        // then
        expect(error).to.be.instanceOf(UnauthorizedError);
        expect((error as $TSFixMe).code).to.be.equal('INVALID_REFRESH_TOKEN');
        expect((error as $TSFixMe).message).to.be.equal('Refresh token is invalid');
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#revokeRefreshToken', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should remove refresh token from temporary storage', async function () {
      // given
      const refreshToken = 'valid-refresh-token';
      sinon.stub(temporaryStorage, 'delete');

      // when
      await refreshTokenService.revokeRefreshToken({ refreshToken });

      // then
      expect(temporaryStorage.delete).to.have.been.calledWith(refreshToken);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#revokeRefreshTokensForUserId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should remove refresh tokens for given userId from temporary storage', async function () {
      // given
      sinon.stub(temporaryStorage, 'deleteByPrefix');

      // when
      await refreshTokenService.revokeRefreshTokensForUserId({ userId: 123 });

      // then
      expect(temporaryStorage.deleteByPrefix).to.have.been.calledWith('123:');
    });
  });
});
