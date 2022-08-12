// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/group-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | group-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('serializes all groups', function () {
      // when
      const json = serializer.serialize([{ name: 'LB6' }, { name: 'AB3' }]);
      // then
      expect(json).to.deep.equal({
        data: [
          {
            type: 'groups',
            id: 'LB6',
            attributes: {
              name: 'LB6',
            },
          },
          {
            type: 'groups',
            id: 'AB3',
            attributes: {
              name: 'AB3',
            },
          },
        ],
      });
    });
  });
});
