// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/campaign-participations-count-by-stage-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | campaign-participations-count-by-stage-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a participations count by stage model object into JSON API data', function () {
      const json = serializer.serialize({
        campaignId: 1,
        data: [
          { id: 'stage1', value: 0, title: 'title1', description: 'description1' },
          { id: 'stage2', value: 1, title: 'title2', description: 'description2' },
        ],
      });

      expect(json).to.deep.equal({
        data: {
          type: 'campaign-participations-count-by-stages',
          id: '1',
          attributes: {
            data: [
              { id: 'stage1', value: 0, title: 'title1', description: 'description1' },
              { id: 'stage2', value: 1, title: 'title2', description: 'description2' },
            ],
          },
        },
      });
    });
  });
});
