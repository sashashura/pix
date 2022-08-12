// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/certification-eligibility-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | certification-eligibility-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should format certification eligibility model into into JSON API data', function () {
      // given
      const certificationEligibility = domainBuilder.buildCertificationEligibility({
        id: 123,
        pixCertificationEligible: true,
        eligibleComplementaryCertifications: ['CléA Numérique', 'Pix+ Droit Expert', 'Pix+ Édu 1er degré Avancé'],
      });

      // when
      const json = serializer.serialize(certificationEligibility);

      // then
      expect(json).to.deep.equal({
        data: {
          id: '123',
          type: 'isCertifiables',
          attributes: {
            'is-certifiable': true,
            'eligible-complementary-certifications': [
              'CléA Numérique',
              'Pix+ Droit Expert',
              'Pix+ Édu 1er degré Avancé',
            ],
          },
        },
      });
    });
  });
});
