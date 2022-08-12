// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/sup-organization-learner-warnings-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | sup-organization-learner-warnings-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a JSON API serialized warning', function () {
      // given
      const importWarnings = {
        id: 123,
        warnings: [
          { studentNumber: '123', field: 'toto', code: 'titi', value: 'yo' },
          { studentNumber: '123', field: 'tata', code: 'tutu', value: 'ya' },
        ],
      };
      const meta = { some: 'meta' };

      // when
      const serialized = serializer.serialize(importWarnings, meta);

      // then
      expect(serialized).to.deep.equal({
        data: {
          type: 'sup-organization-learner-warnings',
          id: importWarnings.id.toString(),
          attributes: {
            warnings: importWarnings.warnings,
          },
        },
        meta: { some: 'meta' },
      });
    });
  });
});
