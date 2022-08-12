// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/target-profile-attach-organization-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | target-profile-attach-organization-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a target profile attach organization object to JSON API data', function () {
      const json = serializer.serialize({
        targetProfileId: 1,
        attachedIds: [1, 5],
        duplicatedIds: [8, 9],
      });

      expect(json).to.deep.equal({
        data: {
          type: 'target-profile-attach-organizations',
          id: '1',
          attributes: {
            'attached-ids': [1, 5],
            'duplicated-ids': [8, 9],
          },
        },
      });
    });
  });
});
