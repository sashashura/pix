// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'authentica... Remove this comment to see the full error message
const authenticationSessionService = require('../../../../../lib/domain/services/authentication/authentication-session-service');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Services | authentication session', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getByKey', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should retrieve the sessionContentTokens if it exists', async function () {
      // given
      const idToken = 'idToken';
      const key = await authenticationSessionService.save({
        sessionContent: { idToken },
        userInfo: { firstName: 'Eva', lastName: 'Porée' },
      });

      // when
      const result = await authenticationSessionService.getByKey(key);

      // then
      expect(result).to.deep.equal({
        sessionContent: { idToken },
        userInfo: { firstName: 'Eva', lastName: 'Porée' },
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return undefined if key not exists', async function () {
      // given
      const key = 'key';

      // when
      const result = await authenticationSessionService.getByKey(key);

      // then
      expect(result).to.be.undefined;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#save', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save sessionContentTokens and return a key', async function () {
      // given
      const idToken = 'idToken';

      // when
      const key = await authenticationSessionService.save({ sessionContent: { idToken } });

      // then
      expect(key).to.exist;
    });
  });
});
