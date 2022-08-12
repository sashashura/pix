// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/campaign-participations-counts-by-status-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | campaign-participations-counts-by-status-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a participations count by stage model object into JSON API data', function () {
      const json = serializer.serialize({
        campaignId: 1,
        started: 1,
        completed: 1,
        shared: 1,
      });

      expect(json).to.deep.equal({
        data: {
          type: 'campaign-participations-counts-by-statuses',
          id: '1',
          attributes: {
            started: 1,
            completed: 1,
            shared: 1,
          },
        },
      });
    });
  });
});
