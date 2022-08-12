// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/email-verification-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | email-verification-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#deserialize()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert the payload json to email information', async function () {
      //given
      const payload = {
        data: {
          type: 'email-verification-code',
          attributes: {
            'new-email': '   EMAIL@example.net   ',
            password: 'myPassword',
          },
        },
      };

      // when
      const json = await serializer.deserialize(payload);

      // then
      const expectedJsonApi = {
        password: 'myPassword',
        newEmail: 'email@example.net',
      };
      expect(json).to.deep.equal(expectedJsonApi);
    });
  });
});
