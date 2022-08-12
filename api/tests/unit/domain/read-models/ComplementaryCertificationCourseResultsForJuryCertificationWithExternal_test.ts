// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable mocha/no-setup-in-describe */
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationCourseResultsForJuryCertificationWithExternal = require('../../../../lib/domain/read-models/ComplementaryCertificationCourseResultsForJuryCertificationWithExternal');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getLabelBy... Remove this comment to see the full error message
const { getLabelByBadgeKey } = require('../../../../lib/domain/read-models/CertifiableBadgeLabels');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder, catchErr } = require('../../../test-helper');
const {
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
describe('Unit | Domain | Models | ComplementaryCertificationCourseResultsForJuryCertificationWithExternal', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#finalResult', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when external section is not scored yet', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return "En attente volet jury" ', function () {
        // given
        const complementaryCertificationCourseResultForJuryCertificationWithExternal =
          domainBuilder.buildComplementaryCertificationCourseResultForJuryCertificationWithExternal({
            pixPartnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
            pixAcquired: true,
            externalPartnerKey: null,
          });

        // when
        const finalResult = complementaryCertificationCourseResultForJuryCertificationWithExternal.finalResult;

        // then
        expect(finalResult).to.be.equal('En attente volet jury');
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return "Rejetée" when pix section is not obtained', function () {
      // given
      const complementaryCertificationCourseResultForJuryCertificationWithExternal =
        domainBuilder.buildComplementaryCertificationCourseResultForJuryCertificationWithExternal({
          pixPartnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
          pixAcquired: false,
        });

      // when
      const finalResult = complementaryCertificationCourseResultForJuryCertificationWithExternal.finalResult;

      // then
      expect(finalResult).to.equal('Rejetée');
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when both section are scored', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return "Rejetée" when external section is not obtained', function () {
        // given
        const complementaryCertificationCourseResultForJuryCertificationWithExternal =
          domainBuilder.buildComplementaryCertificationCourseResultForJuryCertificationWithExternal({
            pixPartnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
            pixAcquired: true,
            externalPartnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
            externalAcquired: false,
          });

        // when
        const finalResult = complementaryCertificationCourseResultForJuryCertificationWithExternal.finalResult;

        // then
        expect(finalResult).to.equal('Rejetée');
      });

      [
        {
          pixPartnerKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
          externalPartnerKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
          expectedFinalResult: getLabelByBadgeKey(PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE),
        },
        {
          pixPartnerKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
          externalPartnerKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
          expectedFinalResult: getLabelByBadgeKey(PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE),
        },
        {
          pixPartnerKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
          externalPartnerKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
          expectedFinalResult: getLabelByBadgeKey(PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME),
        },
        {
          pixPartnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
          externalPartnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
          expectedFinalResult: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME),
        },
        {
          pixPartnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
          externalPartnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
          expectedFinalResult: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME),
        },
        {
          pixPartnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
          externalPartnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
          expectedFinalResult: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME),
        },
        {
          pixPartnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
          externalPartnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
          expectedFinalResult: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE),
        },
        {
          pixPartnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
          externalPartnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
          expectedFinalResult: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE),
        },
        {
          pixPartnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
          externalPartnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
          expectedFinalResult: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT),
        },
        {
          pixPartnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
          externalPartnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
          expectedFinalResult: getLabelByBadgeKey(PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE),
        },
        {
          pixPartnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
          externalPartnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
          expectedFinalResult: getLabelByBadgeKey(PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE),
        },
        {
          pixPartnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
          externalPartnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
          expectedFinalResult: getLabelByBadgeKey(PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME),
        },
        {
          pixPartnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
          externalPartnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
          expectedFinalResult: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME),
        },
        {
          pixPartnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
          externalPartnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
          expectedFinalResult: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME),
        },
        {
          pixPartnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
          externalPartnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
          expectedFinalResult: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME),
        },
        {
          pixPartnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
          externalPartnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
          expectedFinalResult: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE),
        },
        {
          pixPartnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
          externalPartnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
          expectedFinalResult: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE),
        },
        {
          pixPartnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
          externalPartnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
          expectedFinalResult: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT),
        },
      ].forEach(({ pixPartnerKey, externalPartnerKey, expectedFinalResult }) => {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it(`should return ${expectedFinalResult} when the 'PIX' source level is ${pixPartnerKey} and the 'EXTERNAL' source level is ${externalPartnerKey}`, function () {
          // given
          const complementaryCertificationCourseResultForJuryCertificationWithExternal =
            domainBuilder.buildComplementaryCertificationCourseResultForJuryCertificationWithExternal({
              pixPartnerKey,
              pixAcquired: true,
              externalPartnerKey,
              externalAcquired: true,
            });

          // when
          const finalResult = complementaryCertificationCourseResultForJuryCertificationWithExternal.finalResult;

          // then
          expect(finalResult).to.equal(expectedFinalResult);
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an Error when partner key are not from the same degrees', async function () {
        // given
        const complementaryCertificationCourseResultForJuryCertificationWithExternal =
          domainBuilder.buildComplementaryCertificationCourseResultForJuryCertificationWithExternal({
            pixPartnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
            pixAcquired: true,
            externalPartnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
            externalAcquired: true,
          });

        // when
        const myFunc = () => complementaryCertificationCourseResultForJuryCertificationWithExternal.finalResult;
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(myFunc)();

        // then
expect((error as $TSFixMe).message).to.equal(`Badges edu incoherent !!! ${PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE} et ${PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT}`);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#from', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a PixEduComplementaryCertificationCourseResultForJuryCertification', function () {
      // given
      const complementaryCertificationCourseResultsWithExternal = [
        domainBuilder.buildComplementaryCertificationCourseResult({
          complementaryCertificationCourseId: 1234,
          partnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
          acquired: true,
          source: 'PIX',
        }),
        domainBuilder.buildComplementaryCertificationCourseResult({
          complementaryCertificationCourseId: 1234,
          partnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
          acquired: false,
          source: 'EXTERNAL',
        }),
      ];

      // when
      const result = ComplementaryCertificationCourseResultsForJuryCertificationWithExternal.from(
        complementaryCertificationCourseResultsWithExternal
      );

      // then
      expect(result).to.deepEqualInstance(
        new ComplementaryCertificationCourseResultsForJuryCertificationWithExternal({
          pixAcquired: true,
          externalAcquired: false,
          pixPartnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
          externalPartnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
          complementaryCertificationCourseId: 1234,
        })
      );
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#pixResult', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when pix section is not evaluated', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return null', function () {
        // given
        const complementaryCertificationCourseResultsForJuryCertificationWithExternal =
          new ComplementaryCertificationCourseResultsForJuryCertificationWithExternal({});

        // when
        const pixResult = complementaryCertificationCourseResultsForJuryCertificationWithExternal.pixResult;

        // then
        expect(pixResult).to.be.null;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when pix section is evaluated', function () {
      [
        {
          partnerKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
          acquired: true,
          expectedResult: 'Pix+ Édu 2nd degré Initié (entrée dans le métier)',
        },
        {
          partnerKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
          acquired: true,
          expectedResult: 'Pix+ Édu 2nd degré Confirmé',
        },
        {
          partnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
          acquired: true,
          expectedResult: 'Pix+ Édu 2nd degré Confirmé',
        },
        {
          partnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
          acquired: true,
          expectedResult: 'Pix+ Édu 2nd degré Avancé',
        },
        {
          partnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
          acquired: true,
          expectedResult: 'Pix+ Édu 2nd degré Expert',
        },
        {
          partnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
          acquired: true,
          expectedResult: 'Pix+ Édu 1er degré Initié (entrée dans le métier)',
        },
        {
          partnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
          acquired: true,
          expectedResult: 'Pix+ Édu 1er degré Confirmé',
        },
        {
          partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
          acquired: true,
          expectedResult: 'Pix+ Édu 1er degré Confirmé',
        },
        {
          partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
          acquired: true,
          expectedResult: 'Pix+ Édu 1er degré Avancé',
        },
        {
          partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
          acquired: true,
          expectedResult: 'Pix+ Édu 1er degré Expert',
        },
        { partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT, acquired: false, expectedResult: 'Rejetée' },
      ].forEach(({ partnerKey, acquired, expectedResult }) => {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it(`should return ${expectedResult} when pix section partner key is ${partnerKey} and acquired is ${acquired}`, function () {
          // given
          const complementaryCertificationCourseResultsForJuryCertificationWithExternal =
            new ComplementaryCertificationCourseResultsForJuryCertificationWithExternal({
              pixPartnerKey: partnerKey,
              pixAcquired: acquired,
            });

          // when
          const pixResult = complementaryCertificationCourseResultsForJuryCertificationWithExternal.pixResult;

          // then
          expect(pixResult).to.equal(expectedResult);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#externalResult', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when pix section is not acquired', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return "-"', function () {
        // given
        const complementaryCertificationCourseResultsForJuryCertificationWithExternal =
          new ComplementaryCertificationCourseResultsForJuryCertificationWithExternal({
            pixPartnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
            pixAcquired: false,
          });

        // when
        const externalResult = complementaryCertificationCourseResultsForJuryCertificationWithExternal.externalResult;

        // then
        expect(externalResult).to.equal('-');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when pix section is acquired and external section is not yet evaluated', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return "En attente"', function () {
        // given
        const complementaryCertificationCourseResultsForJuryCertificationWithExternal =
          new ComplementaryCertificationCourseResultsForJuryCertificationWithExternal({
            pixPartnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
            pixAcquired: true,
          });

        // when
        const externalResult = complementaryCertificationCourseResultsForJuryCertificationWithExternal.externalResult;

        // then
        expect(externalResult).to.equal('En attente');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when pix section is acquired and external section is evaluated', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when acquired is true', function () {
        [
          {
            partnerKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
            expectedResult: 'Pix+ Édu 2nd degré Initié (entrée dans le métier)',
          },
          {
            partnerKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
            expectedResult: 'Pix+ Édu 2nd degré Confirmé',
          },
          {
            partnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
            expectedResult: 'Pix+ Édu 2nd degré Confirmé',
          },
          { partnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE, expectedResult: 'Pix+ Édu 2nd degré Avancé' },
          { partnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT, expectedResult: 'Pix+ Édu 2nd degré Expert' },
          {
            partnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
            expectedResult: 'Pix+ Édu 1er degré Initié (entrée dans le métier)',
          },
          {
            partnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
            expectedResult: 'Pix+ Édu 1er degré Confirmé',
          },
          {
            partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
            expectedResult: 'Pix+ Édu 1er degré Confirmé',
          },
          { partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE, expectedResult: 'Pix+ Édu 1er degré Avancé' },
          { partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT, expectedResult: 'Pix+ Édu 1er degré Expert' },
        ].forEach(({ partnerKey, expectedResult }) => {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it(`should return ${expectedResult} when external section partner key is ${partnerKey}`, function () {
            // given
            const complementaryCertificationCourseResultsForJuryCertificationWithExternal =
              new ComplementaryCertificationCourseResultsForJuryCertificationWithExternal({
                pixPartnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
                pixAcquired: true,
                externalPartnerKey: partnerKey,
                externalAcquired: true,
              });

            // when
            const externalResult =
              complementaryCertificationCourseResultsForJuryCertificationWithExternal.externalResult;

            // then
            expect(externalResult).to.equal(expectedResult);
          });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when acquired is false', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it(`should return Rejetée`, function () {
          // given
          const complementaryCertificationCourseResultsForJuryCertificationWithExternal =
            new ComplementaryCertificationCourseResultsForJuryCertificationWithExternal({
              pixPartnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
              pixAcquired: true,
              externalPartnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
              externalAcquired: false,
            });

          // when
          const externalResult = complementaryCertificationCourseResultsForJuryCertificationWithExternal.externalResult;

          // then
          expect(externalResult).to.equal('Rejetée');
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#allowedExternalLevels', function () {
    [
      {
        partnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
        expectedLevels: [
          {
            value: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
            label: getLabelByBadgeKey(PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE),
          },
          {
            value: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
            label: getLabelByBadgeKey(PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME),
          },
        ],
      },
      {
        partnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
        expectedLevels: [
          {
            value: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
            label: getLabelByBadgeKey(PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE),
          },
          {
            value: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
            label: getLabelByBadgeKey(PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME),
          },
        ],
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
        expectedLevels: [
          {
            value: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
            label: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME),
          },
          {
            value: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
            label: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE),
          },
          {
            value: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
            label: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT),
          },
        ],
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
        expectedLevels: [
          {
            value: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
            label: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME),
          },
          {
            value: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
            label: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE),
          },
          {
            value: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
            label: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT),
          },
        ],
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
        expectedLevels: [
          {
            value: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
            label: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME),
          },
          {
            value: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
            label: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE),
          },
          {
            value: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
            label: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT),
          },
        ],
      },
      {
        partnerKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
        expectedLevels: [
          {
            value: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
            label: getLabelByBadgeKey(PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE),
          },
          {
            value: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
            label: getLabelByBadgeKey(PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME),
          },
        ],
      },
      {
        partnerKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
        expectedLevels: [
          {
            value: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
            label: getLabelByBadgeKey(PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE),
          },
          {
            value: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
            label: getLabelByBadgeKey(PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME),
          },
        ],
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
        expectedLevels: [
          {
            value: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
            label: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME),
          },
          {
            value: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
            label: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE),
          },
          {
            value: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
            label: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT),
          },
        ],
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
        expectedLevels: [
          {
            value: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
            label: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME),
          },
          {
            value: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
            label: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE),
          },
          {
            value: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
            label: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT),
          },
        ],
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
        expectedLevels: [
          {
            value: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
            label: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME),
          },
          {
            value: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
            label: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE),
          },
          {
            value: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
            label: getLabelByBadgeKey(PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT),
          },
        ],
      },
    ].forEach(({ partnerKey, expectedLevels }) =>
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context(`when partner key is ${partnerKey}`, function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it(`should return an array of allowed labels and statuses`, function () {
          // when
          const allowedExternalLevels = new ComplementaryCertificationCourseResultsForJuryCertificationWithExternal({
            pixPartnerKey: partnerKey,
          }).allowedExternalLevels;

          // then
          expect(allowedExternalLevels).to.deep.equal(expectedLevels);
        });
      })
    );
  });
});
