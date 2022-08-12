// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationEligibility = require('../../../../lib/domain/read-models/CertificationEligibility');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Read-models | CertificationEligibility', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('static #notCertifiable', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a not certifiable CertificationEligibility', function () {
      // given
      const userId = 1234;

      // when
      const notCertifiableCertificationEligibility = CertificationEligibility.notCertifiable({ userId });

      // then
      expect(notCertifiableCertificationEligibility).to.deep.equal(
        domainBuilder.buildCertificationEligibility({ id: userId, pixCertificationEligible: false })
      );
    });
  });
});
