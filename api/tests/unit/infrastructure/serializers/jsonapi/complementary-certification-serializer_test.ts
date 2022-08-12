// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainBuil... Remove this comment to see the full error message
const { domainBuilder, expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/complementary-certification-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | complementary-certification-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a ComplementaryCertification model object into JSON API data', function () {
      // given
      const complementaryCertifications = [
        domainBuilder.buildComplementaryCertification({
          id: 11,
          label: 'Pix+Edu',
          key: 'EDU',
        }),
        domainBuilder.buildComplementaryCertification({
          id: 22,
          label: 'Cléa Numérique',
          key: 'CLEA',
        }),
      ];

      // when
      const json = serializer.serialize(complementaryCertifications);

      // then
      expect(json).to.deep.equal({
        data: [
          {
            id: '11',
            type: 'habilitations',
            attributes: {
              label: 'Pix+Edu',
              key: 'EDU',
            },
          },
          {
            id: '22',
            type: 'habilitations',
            attributes: {
              label: 'Cléa Numérique',
              key: 'CLEA',
            },
          },
        ],
      });
    });
  });
});
