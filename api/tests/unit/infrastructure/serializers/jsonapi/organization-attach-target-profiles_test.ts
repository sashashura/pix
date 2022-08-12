// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/organization-attach-target-profiles-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | organization-attach-target-profiles-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert an organization attach target profiles object to JSON API data', function () {
      const json = serializer.serialize({
        organizationId: 1,
        attachedIds: [1, 5],
        duplicatedIds: [8, 9],
      });

      expect(json).to.deep.equal({
        data: {
          type: 'organization-attach-target-profiles',
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
