// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationCourseResult = require('../../../../lib/domain/models/ComplementaryCertificationCourseResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CertifiedB... Remove this comment to see the full error message
const CertifiedBadges = require('../../../../lib/domain/read-models/CertifiedBadges');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_MAITRE_CERTIF,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_EXPERT_CERTIF,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V1,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V2,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V3,
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
describe('Unit | Domain | Read-models | CertifiedBadges', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getAcquiredCertifiedBadgesDTO', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when badge is not "PIX_EDU', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when badge is not acquired', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return an empty array', function () {
          // given
          const complementaryCertificationCourseResults = [
            domainBuilder.buildComplementaryCertificationCourseResult({
              acquired: false,
              partnerKey: PIX_DROIT_EXPERT_CERTIF,
            }),
          ];
          // when
          const acquiredCertifiedBadgesDTO = new CertifiedBadges({
            complementaryCertificationCourseResults,
          }).getAcquiredCertifiedBadgesDTO();

          // then
          expect(acquiredCertifiedBadgesDTO).to.be.empty;
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when badge is acquired', function () {
        // eslint-disable-next-line mocha/no-setup-in-describe
        [
          PIX_DROIT_EXPERT_CERTIF,
          PIX_DROIT_MAITRE_CERTIF,
          PIX_EMPLOI_CLEA_V1,
          PIX_EMPLOI_CLEA_V2,
          PIX_EMPLOI_CLEA_V3,
        ].forEach((partnerKey) => {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it(`returns a non temporary acquired badge for ${partnerKey}`, function () {
            // given
            const complementaryCertificationCourseResults = [
              domainBuilder.buildComplementaryCertificationCourseResult({
                complementaryCertificationCourseId: 456,
                partnerKey,
                acquired: true,
              }),
            ];

            // when
            const certifiedBadgesDTO = new CertifiedBadges({
              complementaryCertificationCourseResults,
            }).getAcquiredCertifiedBadgesDTO();

            // then
            expect(certifiedBadgesDTO).to.deepEqualArray([
              {
                partnerKey,
                isTemporaryBadge: false,
              },
            ]);
          });
        });
      });
    });
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when badge is "PIX_EDU', function () {
      // eslint-disable-next-line mocha/no-setup-in-describe
      [
        PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
        PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
        PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
        PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
        PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
        PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
        PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
        PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
        PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
        PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
      ].forEach((partnerKey) => {
        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when there is only one complementaryCertificationCourseResult', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it(`returns a temporary badge for acquired ${partnerKey}`, function () {
            // given
            const complementaryCertificationCourseResults = [
              domainBuilder.buildComplementaryCertificationCourseResult({
                complementaryCertificationCourseId: 456,
                partnerKey,
                acquired: true,
              }),
            ];

            // when
            const certifiedBadgesDTO = new CertifiedBadges({
              complementaryCertificationCourseResults,
            }).getAcquiredCertifiedBadgesDTO();

            // then
            expect(certifiedBadgesDTO).to.deepEqualArray([
              {
                partnerKey,
                isTemporaryBadge: true,
              },
            ]);
          });

          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it(`returns an empty array for non acquired ${partnerKey}`, function () {
            // given
            const complementaryCertificationCourseResults = [
              domainBuilder.buildComplementaryCertificationCourseResult({
                complementaryCertificationCourseId: 456,
                partnerKey,
                acquired: false,
              }),
            ];

            // when
            const certifiedBadgesDTO = new CertifiedBadges({
              complementaryCertificationCourseResults,
            }).getAcquiredCertifiedBadgesDTO();

            // then
            expect(certifiedBadgesDTO).to.deepEqualArray([]);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when there is more than one complementaryCertificationCourseResult', function () {
          // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
          describe('when there is an "EXTERNAL" and acquired badge', function () {
            // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
            it(`returns a non temporary badge for ${partnerKey}`, function () {
              // given
              const complementaryCertificationCourseResults = [
                domainBuilder.buildComplementaryCertificationCourseResult({
                  complementaryCertificationCourseId: 456,
                  partnerKey,
                  source: ComplementaryCertificationCourseResult.sources.PIX,
                }),
                domainBuilder.buildComplementaryCertificationCourseResult({
                  partnerKey,
                  complementaryCertificationCourseId: 456,
                  source: ComplementaryCertificationCourseResult.sources.EXTERNAL,
                  acquired: true,
                }),
              ];

              // when
              const certifiedBadgesDTO = new CertifiedBadges({
                complementaryCertificationCourseResults,
              }).getAcquiredCertifiedBadgesDTO();

              // then
              expect(certifiedBadgesDTO).to.deepEqualArray([
                {
                  partnerKey,
                  isTemporaryBadge: false,
                },
              ]);
            });
          });

          // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
          describe('when there is an "EXTERNAL" and not acquired badge', function () {
            // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
            it(`returns an empty array`, function () {
              // given
              const complementaryCertificationCourseResults = [
                domainBuilder.buildComplementaryCertificationCourseResult({
                  complementaryCertificationCourseId: 456,
                  partnerKey,
                  source: ComplementaryCertificationCourseResult.sources.PIX,
                }),
                domainBuilder.buildComplementaryCertificationCourseResult({
                  partnerKey,
                  complementaryCertificationCourseId: 456,
                  source: ComplementaryCertificationCourseResult.sources.EXTERNAL,
                  acquired: false,
                }),
              ];

              // when
              const certifiedBadgesDTO = new CertifiedBadges({
                complementaryCertificationCourseResults,
              }).getAcquiredCertifiedBadgesDTO();

              // then
              expect(certifiedBadgesDTO).to.deepEqualArray([]);
            });
          });
        });
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      [
        {
          sourcePix: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
          sourceExternal: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
          expectedLowestBadge: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
        },
        {
          sourcePix: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
          sourceExternal: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
          expectedLowestBadge: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
        },
        {
          sourcePix: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
          sourceExternal: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
          expectedLowestBadge: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
        },
        {
          sourcePix: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
          sourceExternal: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
          expectedLowestBadge: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
        },
        {
          sourcePix: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
          sourceExternal: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
          expectedLowestBadge: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
        },
        {
          sourcePix: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
          sourceExternal: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
          expectedLowestBadge: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
        },
        {
          sourcePix: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
          sourceExternal: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
          expectedLowestBadge: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
        },
        {
          sourcePix: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
          sourceExternal: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
          expectedLowestBadge: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
        },
        {
          sourcePix: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
          sourceExternal: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
          expectedLowestBadge: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
        },
        {
          sourcePix: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
          sourceExternal: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
          expectedLowestBadge: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
        },
        {
          sourcePix: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
          sourceExternal: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
          expectedLowestBadge: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
        },
        {
          sourcePix: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
          sourceExternal: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
          expectedLowestBadge: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
        },
        {
          sourcePix: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
          sourceExternal: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
          expectedLowestBadge: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
        },
        {
          sourcePix: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
          sourceExternal: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
          expectedLowestBadge: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
        },
        {
          sourcePix: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
          sourceExternal: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
          expectedLowestBadge: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
        },
        {
          sourcePix: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
          sourceExternal: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
          expectedLowestBadge: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
        },
        {
          sourcePix: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
          sourceExternal: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
          expectedLowestBadge: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
        },
        {
          sourcePix: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
          sourceExternal: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
          expectedLowestBadge: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
        },
      ].forEach(({ sourcePix, sourceExternal, expectedLowestBadge }) => {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it(`should return ${expectedLowestBadge} when the 'PIX' source level is ${sourcePix} and the 'EXTERNAL' source level is ${sourceExternal}`, function () {
          // given
          const complementaryCertificationCourseResults = [
            domainBuilder.buildComplementaryCertificationCourseResult({
              partnerKey: sourcePix,
              complementaryCertificationCourseId: 456,
              source: ComplementaryCertificationCourseResult.sources.PIX,
            }),
            domainBuilder.buildComplementaryCertificationCourseResult({
              partnerKey: sourceExternal,
              complementaryCertificationCourseId: 456,
              source: ComplementaryCertificationCourseResult.sources.EXTERNAL,
              acquired: true,
            }),
          ];

          // when
          const certifiedBadgesDTO = new CertifiedBadges({
            complementaryCertificationCourseResults,
          }).getAcquiredCertifiedBadgesDTO();

          // then
          expect(certifiedBadgesDTO).to.deepEqualArray([
            {
              partnerKey: expectedLowestBadge,
              isTemporaryBadge: false,
            },
          ]);
        });
      });
    });
  });
});
