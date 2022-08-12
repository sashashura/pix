// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('../../../../lib/domain/services/token-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../../../lib/config');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Domain | Services | TokenService', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createAccessTokenForSaml', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a valid json web token', function () {
      // given
      const userId = 123;

      // when
      const result = tokenService.createAccessTokenForSaml(userId);

      // then
      const token = tokenService.getDecodedToken(result);
      expect(token).to.include({ source: 'external', user_id: userId });

      const expirationDelaySeconds = token.exp - token.iat;
      const expectedExpirationDelaySeconds = settings.saml.accessTokenLifespanMs / 1000;
      expect(expirationDelaySeconds).to.equal(expectedExpirationDelaySeconds);
    });
  });
});
