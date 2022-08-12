// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationChallengeWithType = require('../../../../lib/domain/models/CertificationChallengeWithType');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Type'.
const { Type } = require('../../../../lib/domain/models/Challenge');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | CertificationChallengeWithType', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#constructor', function () {
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const validTypes = Object.values(Type);
    // eslint-disable-next-line mocha/no-setup-in-describe
    validTypes.forEach((validType) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should initialize CertificationChallengeWithType with type ${validType}`, function () {
        // when
        const certificationChallengeWithType = new CertificationChallengeWithType({ type: validType });

        // then
        expect(certificationChallengeWithType.type).to.equal(validType);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should initialize type to EmptyType when type is not valid', function () {
      // when
      const certificationChallengeWithType = new CertificationChallengeWithType({ type: 'COUCOUCOUCOCUCUO' });

      // then
      expect(certificationChallengeWithType.type).to.equal('EmptyType');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#neutralize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should neutralize a non neutralized certification challenge', function () {
      // given
      const certificationChallengeWithType = domainBuilder.buildCertificationChallengeWithType({
        isNeutralized: false,
      });

      // when
      certificationChallengeWithType.neutralize();

      // then
      expect(certificationChallengeWithType.isNeutralized).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should leave a neutralized certification challenge if it was neutralized already', function () {
      // given
      const certificationChallengeWithType = domainBuilder.buildCertificationChallengeWithType({ isNeutralized: true });

      // when
      certificationChallengeWithType.neutralize();

      // then
      expect(certificationChallengeWithType.isNeutralized).to.be.true;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#deneutralize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should deneutralize a neutralized certification challenge', function () {
      // given
      const certificationChallengeWithType = domainBuilder.buildCertificationChallengeWithType({ isNeutralized: true });

      // when
      certificationChallengeWithType.deneutralize();

      // then
      expect(certificationChallengeWithType.isNeutralized).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should leave a deneutralized certification challenge if it was deneutralized already', function () {
      // given
      const certificationChallengeWithType = domainBuilder.buildCertificationChallengeWithType({
        isNeutralized: false,
      });

      // when
      certificationChallengeWithType.deneutralize();

      // then
      expect(certificationChallengeWithType.isNeutralized).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isPixPlus', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('return true when challenge was picked for a pix plus certification', function () {
      // given
      const certificationChallengeWithType = domainBuilder.buildCertificationChallengeWithType({
        certifiableBadgeKey: 'someValue',
      });

      // when
      const isPixPlus = certificationChallengeWithType.isPixPlus();

      // then
      expect(isPixPlus).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('return false when challenge was picked for a regular pix certification', function () {
      // given
      const certificationChallengeWithType = domainBuilder.buildCertificationChallengeWithType({
        certifiableBadgeKey: null,
      });

      // when
      const isPixPlus = certificationChallengeWithType.isPixPlus();

      // then
      expect(isPixPlus).to.be.false;
    });
  });
});
