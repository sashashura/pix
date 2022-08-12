// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/framework-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | framework-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a serialized JSON data object', function () {
      // given
      const frameworks = [
        { id: 'frameworkId1', name: 'frameworkName1' },
        { id: 'frameworkId2', name: 'frameworkName2' },
      ];

      const expectedSerializedResult = {
        data: [
          {
            type: 'frameworks',
            id: 'frameworkId1',
            attributes: { name: 'frameworkName1' },
            relationships: {
              areas: {
                links: {
                  related: '/api/admin/frameworks/frameworkId1/areas',
                },
              },
            },
          },
          {
            type: 'frameworks',
            id: 'frameworkId2',
            attributes: { name: 'frameworkName2' },
            relationships: {
              areas: {
                links: {
                  related: '/api/admin/frameworks/frameworkId2/areas',
                },
              },
            },
          },
        ],
      };

      // when
      const result = serializer.serialize(frameworks);

      // then
      expect(result).to.deep.equal(expectedSerializedResult);
    });
  });
});
