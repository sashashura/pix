// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/skill-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | skill-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a serialized JSON data object', function () {
      // given
      const skills = [
        {
          id: 'skillId1',
          name: 'skill1',
          level: 1,
        },
        {
          id: 'skillId2',
          name: 'skill1',
          level: 2,
        },
      ];

      const expectedSerializedResult = {
        data: [
          {
            type: 'skills',
            id: 'skillId1',
            attributes: {
              level: 1,
            },
          },
          {
            type: 'skills',
            id: 'skillId2',
            attributes: {
              level: 2,
            },
          },
        ],
      };

      // when
      const result = serializer.serialize(skills);

      // then
      expect(result).to.deep.equal(expectedSerializedResult);
    });
  });
});
