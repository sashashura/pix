// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationSessionContent = require('../../../../lib/domain/models/AuthenticationSessionContent');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | AuthenticationSessionContent', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#constructor', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should construct a model AuthenticationSessionContent from attributes', function () {
      // given
      const attributes = {
        accessToken: 'accessToken',
        idToken: 'idToken',
        expiresIn: 60,
        refreshToken: 'refreshToken',
      };

      // when
      const poleEmploiAuthenticationSessionContent = new AuthenticationSessionContent(attributes);

      // then
      expect(poleEmploiAuthenticationSessionContent).to.be.an.instanceof(AuthenticationSessionContent);
      expect(poleEmploiAuthenticationSessionContent).to.deep.equal(attributes);
    });
  });
});
