// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/badge-criteria-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BadgeCrite... Remove this comment to see the full error message
const BadgeCriterion = require('../../../../../lib/domain/models/BadgeCriterion');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | badge-criteria-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a BadgeCriterion model object into JSON API data', function () {
      // given
      const badgeCriterion = new BadgeCriterion({
        scope: 'CampaignParticipation',
        threshold: 65,
        skillSetIds: [],
      });

      // when
      const badgeCriteria = serializer.serialize(badgeCriterion);

      // then
      const expectedBadgeCriterion = {
        data: {
          type: 'badge-criteria',
          attributes: {
            scope: 'CampaignParticipation',
            threshold: 65,
          },
        },
      };

      expect(badgeCriteria).to.deep.equal(expectedBadgeCriterion);
    });
  });
});
