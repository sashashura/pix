// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_D... Remove this comment to see the full error message
  PIX_PLUS_DROIT,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CLEA'.
  CLEA,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_E... Remove this comment to see the full error message
  PIX_PLUS_EDU_1ER_DEGRE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_E... Remove this comment to see the full error message
  PIX_PLUS_EDU_2ND_DEGRE,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/models/ComplementaryCertification');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | CertificationCenter', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isSco', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when certification center is of type SCO', function () {
      // given
      const certificationCenter = domainBuilder.buildCertificationCenter({ type: 'SCO' });

      // when / then
      expect(certificationCenter.isSco).is.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when certification center is not of type SCO', function () {
      // given
      const certificationCenter = domainBuilder.buildCertificationCenter({ type: 'SUP' });

      // when / then
      expect(certificationCenter.isSco).is.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isHabilitatedPixPlusDroit', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when the certification center does not have Pix+ Droit habilitation', function () {
      // given
      const certificationCenter = domainBuilder.buildCertificationCenter({ habilitations: [] });

      // then
      expect(certificationCenter.isHabilitatedPixPlusDroit).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when the certification center has Pix+ Droit complementary certification', function () {
      // given
      const pixPlusDroitComplementaryCertification = domainBuilder.buildComplementaryCertification({
        key: PIX_PLUS_DROIT,
      });
      const certificationCenter = domainBuilder.buildCertificationCenter({
        habilitations: [pixPlusDroitComplementaryCertification],
      });

      // then
      expect(certificationCenter.isHabilitatedPixPlusDroit).to.be.true;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isHabilitatedPixPlusEdu1erDegre', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when the certification center does not have Pix+ Edu 1er degre habilitation', function () {
      // given
      const certificationCenter = domainBuilder.buildCertificationCenter({ habilitations: [] });

      // then
      expect(certificationCenter.isHabilitatedPixPlusEdu1erDegre).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when the certification center has Pix+ Edu 1er degre habilitation', function () {
      // given
      const pixPlusEdu1erDegreComplementaryCertification = domainBuilder.buildComplementaryCertification({
        key: PIX_PLUS_EDU_1ER_DEGRE,
      });
      const certificationCenter = domainBuilder.buildCertificationCenter({
        habilitations: [pixPlusEdu1erDegreComplementaryCertification],
      });

      // then
      expect(certificationCenter.isHabilitatedPixPlusEdu1erDegre).to.be.true;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isHabilitatedPixPlusEdu2ndDegre', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when the certification center does not have Pix+ Edu 2nd degre habilitation', function () {
      // given
      const certificationCenter = domainBuilder.buildCertificationCenter({ habilitations: [] });

      // then
      expect(certificationCenter.isHabilitatedPixPlusEdu2ndDegre).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when the certification center has Pix+ Edu 2nd degre habilitation', function () {
      // given
      const complementaryCertification = domainBuilder.buildComplementaryCertification({
        key: PIX_PLUS_EDU_2ND_DEGRE,
      });
      const certificationCenter = domainBuilder.buildCertificationCenter({
        habilitations: [complementaryCertification],
      });

      // then
      expect(certificationCenter.isHabilitatedPixPlusEdu2ndDegre).to.be.true;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isHabilitatedClea', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when the certification center does not have Cléa numérique complementary certification', function () {
      // given
      const certificationCenter = domainBuilder.buildCertificationCenter({ habilitations: [] });

      // then
      expect(certificationCenter.isHabilitatedClea).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when the certification center has Cléa numérique complementary certification', function () {
      // given
      const cleaComplementaryCertification = domainBuilder.buildComplementaryCertification({
        key: CLEA,
      });
      const certificationCenter = domainBuilder.buildCertificationCenter({
        habilitations: [cleaComplementaryCertification],
      });

      // then
      expect(certificationCenter.isHabilitatedClea).to.be.true;
    });
  });
});
