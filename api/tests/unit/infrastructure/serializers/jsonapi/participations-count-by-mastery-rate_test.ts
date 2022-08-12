// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/participations-count-by-mastery-rate');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | participations-count-by-mastery-rate', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a campaign result distribution object into JSON API data', function () {
      const json = serializer.serialize({
        campaignId: 1,
        resultDistribution: [
          { count: 1, masteryRate: '0.50' },
          { count: 2, masteryRate: '1.00' },
        ],
      });

      expect(json).to.deep.equal({
        data: {
          type: 'participations-count-by-mastery-rates',
          id: '1',
          attributes: {
            'result-distribution': [
              { count: 1, masteryRate: '0.50' },
              { count: 2, masteryRate: '1.00' },
            ],
          },
        },
      });
    });
  });
});
