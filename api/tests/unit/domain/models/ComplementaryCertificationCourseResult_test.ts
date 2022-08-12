// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationCourseResult = require('../../../../lib/domain/models/ComplementaryCertificationCourseResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_MAITRE_CERTIF,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_EXPERT_CERTIF,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/models/Badge').keys;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | ComplementaryCertificationCourseResult', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isAcquired', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if acquired is true', function () {
      // given
      const complementaryCertificationCourseResult = new ComplementaryCertificationCourseResult({
        complementaryCertificationCourseId: 'complementaryCertificationCourseId',
        partnerKey: 'partnerKey',
        acquired: true,
        source: 'source',
      });

      // when
      const result = complementaryCertificationCourseResult.isAcquired();

      // then
      expect(result).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if acquired is false', function () {
      // given
      const complementaryCertificationCourseResult = new ComplementaryCertificationCourseResult({
        complementaryCertificationCourseId: 'complementaryCertificationCourseId',
        partnerKey: 'partnerKey',
        acquired: false,
        source: 'source',
      });

      // when
      const result = complementaryCertificationCourseResult.isAcquired();

      // then
      expect(result).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isPixEdu1erDegre', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      {
        partnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
        expected: true,
      },
      {
        partnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
        expected: true,
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
        expected: true,
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
        expected: true,
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
        expected: true,
      },
      {
        partnerKey: PIX_DROIT_MAITRE_CERTIF,
        expected: false,
      },
      {
        partnerKey: PIX_DROIT_EXPERT_CERTIF,
        expected: false,
      },
      {
        partnerKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
        expected: false,
      },
      {
        partnerKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
        expected: false,
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
        expected: false,
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
        expected: false,
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
        expected: false,
      },
    ].forEach(({ partnerKey, expected }) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return ${expected} when partnerKey is ${partnerKey}`, function () {
        // given
        const complementaryCertificationCourseResult = domainBuilder.buildComplementaryCertificationCourseResult({
          partnerKey,
        });

        // when
        const result = complementaryCertificationCourseResult.isPixEdu1erDegre();

        // then
        expect(result).to.equal(expected);
      });
    });
  });
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isPixEdu2ndDegre', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      {
        partnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
        expected: false,
      },
      {
        partnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
        expected: false,
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
        expected: false,
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
        expected: false,
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
        expected: false,
      },
      {
        partnerKey: PIX_DROIT_MAITRE_CERTIF,
        expected: false,
      },
      {
        partnerKey: PIX_DROIT_EXPERT_CERTIF,
        expected: false,
      },
      {
        partnerKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
        expected: true,
      },
      {
        partnerKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
        expected: true,
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
        expected: true,
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
        expected: true,
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
        expected: true,
      },
    ].forEach(({ partnerKey, expected }) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return ${expected} when partnerKey is ${partnerKey}`, function () {
        // given
        const complementaryCertificationCourseResult = domainBuilder.buildComplementaryCertificationCourseResult({
          partnerKey,
        });

        // when
        const result = complementaryCertificationCourseResult.isPixEdu2ndDegre();

        // then
        expect(result).to.equal(expected);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isPixEdu', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      {
        partnerKey: PIX_DROIT_MAITRE_CERTIF,
        expected: false,
      },
      {
        partnerKey: PIX_DROIT_EXPERT_CERTIF,
        expected: false,
      },
      {
        partnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
        expected: true,
      },
      {
        partnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
        expected: true,
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
        expected: true,
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
        expected: true,
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
        expected: true,
      },
      {
        partnerKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
        expected: true,
      },
      {
        partnerKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
        expected: true,
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
        expected: true,
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
        expected: true,
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
        expected: true,
      },
    ].forEach(({ partnerKey, expected }) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return ${expected} when partnerKey is ${partnerKey}`, function () {
        // given
        const complementaryCertificationCourseResult = domainBuilder.buildComplementaryCertificationCourseResult({
          partnerKey,
        });

        // when
        const result = complementaryCertificationCourseResult.isPixEdu();

        // then
        expect(result).to.equal(expected);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#buildFromJuryLevel', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when the jury level is not "REJECTED"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an acquired ComplementaryCertificationCourseResult with an external source', function () {
        // given
        const complementaryCertificationCourseResult = domainBuilder.buildComplementaryCertificationCourseResult({
          partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
          source: ComplementaryCertificationCourseResult.sources.PIX,
          acquired: true,
          complementaryCertificationCourseId: 12,
        });

        // when
        const result = ComplementaryCertificationCourseResult.buildFromJuryLevel({
          juryLevel: complementaryCertificationCourseResult.partnerKey,
          complementaryCertificationCourseId: 12,
          pixPartnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
        });

        // then
        expect(result).to.deepEqualInstance(
          new ComplementaryCertificationCourseResult({
            acquired: true,
            partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
            source: ComplementaryCertificationCourseResult.sources.EXTERNAL,
            complementaryCertificationCourseId: 12,
          })
        );
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when the jury level is "REJECTED"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an acquired ComplementaryCertificationCourseResult with an external source', function () {
        // given
        const complementaryCertificationCourseResult = domainBuilder.buildComplementaryCertificationCourseResult({
          partnerKey: 'REJECTED',
          source: ComplementaryCertificationCourseResult.sources.PIX,
          acquired: true,
          complementaryCertificationCourseId: 12,
        });

        // when
        const result = ComplementaryCertificationCourseResult.buildFromJuryLevel({
          juryLevel: complementaryCertificationCourseResult.partnerKey,
          complementaryCertificationCourseId: 12,
          pixPartnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
        });

        // then
        expect(result).to.deepEqualInstance(
          new ComplementaryCertificationCourseResult({
            acquired: false,
            partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
            source: ComplementaryCertificationCourseResult.sources.EXTERNAL,
            complementaryCertificationCourseId: 12,
          })
        );
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isFromPixSource', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when source is PIX', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return true', function () {
        // given
        const complementaryCertificationCourseResult = domainBuilder.buildComplementaryCertificationCourseResult({
          partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
          source: ComplementaryCertificationCourseResult.sources.PIX,
          acquired: true,
          complementaryCertificationCourseId: 12,
        });

        // when then
        expect(complementaryCertificationCourseResult.isFromPixSource()).to.be.true;
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when source is not PIX', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return false', function () {
        // given
        const complementaryCertificationCourseResult = domainBuilder.buildComplementaryCertificationCourseResult({
          partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
          source: ComplementaryCertificationCourseResult.sources.EXTERNAL,
          acquired: true,
          complementaryCertificationCourseId: 12,
        });

        // when then
        expect(complementaryCertificationCourseResult.isFromPixSource()).to.be.false;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isFromExternalSource', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when source is EXTERNAL', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return true', function () {
        // given
        const complementaryCertificationCourseResult = domainBuilder.buildComplementaryCertificationCourseResult({
          partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
          source: ComplementaryCertificationCourseResult.sources.EXTERNAL,
          acquired: true,
          complementaryCertificationCourseId: 12,
        });

        // when then
        expect(complementaryCertificationCourseResult.isFromExternalSource()).to.be.true;
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when source is not EXTERNAL', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return false', function () {
        // given
        const complementaryCertificationCourseResult = domainBuilder.buildComplementaryCertificationCourseResult({
          partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
          source: ComplementaryCertificationCourseResult.sources.PIX,
          acquired: true,
          complementaryCertificationCourseId: 12,
        });

        // when then
        expect(complementaryCertificationCourseResult.isFromExternalSource()).to.be.false;
      });
    });
  });
});
