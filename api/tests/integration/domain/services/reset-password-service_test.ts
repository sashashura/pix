// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'resetPassw... Remove this comment to see the full error message
const resetPasswordService = require('../../../../lib/domain/services/reset-password-service');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Service | Password Service', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#generateTemporaryKey', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when two users send a request at the same second', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should generate different temporaryKeys', function () {
        // when
        const temporaryKeyUser1 = resetPasswordService.generateTemporaryKey();
        const temporaryKeyUser2 = resetPasswordService.generateTemporaryKey();

        // then
        expect(temporaryKeyUser1).to.not.equal(temporaryKeyUser2);
      });
    });
  });
});
