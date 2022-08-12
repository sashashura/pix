// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/country-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainBuil... Remove this comment to see the full error message
const { domainBuilder } = require('../../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | country-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a Certification CPF Country model object into JSON API data', function () {
      // given
      const countries = [
        domainBuilder.buildCountry({
          code: '123',
          name: 'TOGO',
        }),
        domainBuilder.buildCountry({
          code: '456',
          name: 'NABOO',
        }),
      ];

      // when
      const json = serializer.serialize(countries);

      // then
      expect(json).to.deep.equal({
        data: [
          {
            id: '123_GOOT',
            type: 'countries',
            attributes: {
              name: 'TOGO',
              code: '123',
            },
          },
          {
            id: '456_ABNOO',
            type: 'countries',
            attributes: {
              name: 'NABOO',
              code: '456',
            },
          },
        ],
      });
    });
  });
});
