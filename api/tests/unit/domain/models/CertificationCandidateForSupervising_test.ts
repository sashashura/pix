// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | Certification Candidate for supervising', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#authorizeToStart', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Should update authorizeToStart property to true', function () {
      // given
      const certificationCandidateForSupervising = domainBuilder.buildCertificationCandidateForSupervising({
        authorizedToStart: false,
      });

      // when
      certificationCandidateForSupervising.authorizeToStart();

      // then
      expect(certificationCandidateForSupervising.authorizedToStart).to.be.true;
    });
  });
});
