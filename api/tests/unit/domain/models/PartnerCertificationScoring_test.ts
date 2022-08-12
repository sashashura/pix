// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PartnerCer... Remove this comment to see the full error message
const PartnerCertificationScoring = require('../../../../lib/domain/models/PartnerCertificationScoring');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ObjectVali... Remove this comment to see the full error message
const { ObjectValidationError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | PartnerCertificationScoring', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('constructor', function () {
    let validArguments: $TSFixMe;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      validArguments = {
        complementaryCertificationCourseId: 999,
        certificationCourseId: 123,
        partnerKey: 'partnerKey',
      };
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should successfully instantiate object when passing all valid arguments', function () {
      // when
      expect(() => new PartnerCertificationScoring(validArguments)).not.to.throw(ObjectValidationError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an ObjectValidationError when complementaryCertificationCourseId is not valid', function () {
      // when
      expect(
        () => new PartnerCertificationScoring({ ...validArguments, complementaryCertificationCourseId: 'coucou' })
      ).to.throw(ObjectValidationError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not throw an ObjectValidationError when partnerKey is null', function () {
      // when
      expect(() => new PartnerCertificationScoring({ ...validArguments, partnerKey: null })).to.not.throw(
        ObjectValidationError
      );
    });
  });
});
