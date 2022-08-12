// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/password-reset-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | password-reset-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert password-reset-object to JSON-API', function () {
      // given
      const passwordResetDemand = {
        id: '1',
        email: 'toto@pix.fr',
        temporaryKey: 'one key',
      };
      const expectedSerializedPasswordReset = {
        data: {
          type: 'password-reset-demands',
          id: '1',
          attributes: {
            email: 'toto@pix.fr',
          },
        },
      };

      const result = serializer.serialize(passwordResetDemand);

      // then
      expect(result).to.deep.equal(expectedSerializedPasswordReset);
    });
  });
});
