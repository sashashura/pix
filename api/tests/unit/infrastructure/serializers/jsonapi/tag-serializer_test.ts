// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/tag-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | tag-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a tag model to JSON', function () {
      // given
      const tag = domainBuilder.buildTag({ name: 'TAG1' });

      const expectedSerializedTag = {
        data: {
          attributes: {
            name: tag.name,
          },
          id: tag.id.toString(),
          type: 'tags',
        },
      };

      // when
      const json = serializer.serialize(tag);

      // then
      expect(json).to.deep.equal(expectedSerializedTag);
    });
  });
});
