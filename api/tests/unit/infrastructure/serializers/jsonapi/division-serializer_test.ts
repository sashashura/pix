// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/division-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | division-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('serializes all division', function () {
      // when
      const json = serializer.serialize([{ name: '6eme' }, { name: '3eme' }]);
      // then
      expect(json).to.deep.equal({
        data: [
          {
            type: 'divisions',
            id: '6eme',
            attributes: {
              name: '6eme',
            },
          },
          {
            type: 'divisions',
            id: '3eme',
            attributes: {
              name: '3eme',
            },
          },
        ],
      });
    });
  });
});
