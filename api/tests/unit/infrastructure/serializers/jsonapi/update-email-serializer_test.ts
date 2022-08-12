// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/update-email-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | update-email-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert user new email into JSON API data', function () {
      //given
      const updatedUserAttributes = {
        email: 'new-email@example.net',
      };

      // when
      const json = serializer.serialize(updatedUserAttributes);

      // then
      const expectedJsonApi = {
        data: {
          type: 'email-verification-codes',
          attributes: {
            email: updatedUserAttributes.email,
          },
        },
      };
      expect(json).to.deep.equal(expectedJsonApi);
    });
  });
});
