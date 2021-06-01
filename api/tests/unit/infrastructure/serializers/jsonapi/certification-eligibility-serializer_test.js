const { expect, domainBuilder } = require('../../../../test-helper');
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/certification-eligibility-serializer');

describe('Unit | Serializer | JSONAPI | certification-eligibility-serializer', function() {

  describe('#serialize()', function() {

    it('should format certification eligibility model into into JSON API data', function() {
      // given
      const certificationEligibility = domainBuilder.buildCertificationEligibility({
        id: 123,
        pixCertificationEligible: false,
      });

      // when
      const json = serializer.serialize(certificationEligibility);

      // then
      expect(json).to.deep.equal({
        data: {
          id: '123',
          type: 'isCertifiables',
          attributes: {
            'is-certifiable': false,
          },
        },
      });
    });
  });
});
