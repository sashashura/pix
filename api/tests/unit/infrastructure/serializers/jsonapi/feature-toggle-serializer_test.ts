// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/feature-toggle-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | feature-toggle-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert feature-toggle object into JSON API data', function () {
      // given
      const featureToggles = {
        someFeatureToggle: true,
      };
      const expectedJSON = {
        data: {
          type: 'feature-toggles',
          id: '0',
          attributes: {
            'some-feature-toggle': true,
          },
        },
      };

      // when
      const json = serializer.serialize(featureToggles);

      // then
      expect(json).to.deep.equal(expectedJSON);
    });
  });
});
