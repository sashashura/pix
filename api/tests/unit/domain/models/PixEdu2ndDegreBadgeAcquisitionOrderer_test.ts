// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PixEdu2ndD... Remove this comment to see the full error message
const PixEdu2ndDegreBadgeAcquisitionOrderer = require('../../../../lib/domain/models/PixEdu2ndDegreBadgeAcquisitionOrderer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | PixEdu2ndDegreBadgeAcquisitionOrderer', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#getHighestBadge', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is no Pix+ Édu 2nd degre badge acquisition', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return undefined', function () {
        // given
        const badgesAcquisitions = [
          domainBuilder.buildBadgeAcquisition({ badge: domainBuilder.buildBadge({ key: 'NOT_PIX_EDU' }) }),
          domainBuilder.buildBadgeAcquisition({ badge: domainBuilder.buildBadge({ key: 'NOT_PIX_EDU' }) }),
        ];
        const pixEdu2ndDegreBadgeAcquisitionOrderer = new PixEdu2ndDegreBadgeAcquisitionOrderer({ badgesAcquisitions });

        // when
        const highestBadge = pixEdu2ndDegreBadgeAcquisitionOrderer.getHighestBadge();

        // then
        expect(highestBadge).to.be.null;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT badge acquisition', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT badge acquisition', function () {
        // given
        const badgesAcquisitions = [
          domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale2ndDegreInitie(),
          domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale2ndDegreConfirme(),
          domainBuilder.buildBadgeAcquisition.forPixEduFormationContinue2ndDegreConfirme(),
          domainBuilder.buildBadgeAcquisition.forPixEduFormationContinue2ndDegreAvance(),
          domainBuilder.buildBadgeAcquisition.forPixEduFormationContinue2ndDegreExpert(),
        ];
        const pixEdu2ndDegreBadgeAcquisitionOrderer = new PixEdu2ndDegreBadgeAcquisitionOrderer({ badgesAcquisitions });

        // when
        const highestBadge = pixEdu2ndDegreBadgeAcquisitionOrderer.getHighestBadge();

        // then
        expect(highestBadge).to.deepEqualInstance(
          domainBuilder.buildBadgeAcquisition.forPixEduFormationContinue2ndDegreExpert()
        );
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is no PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT badge acquisition', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there is a PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE badge acquisition', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE badge acquisition', function () {
          // given
          const badgesAcquisitions = [
            domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale2ndDegreInitie(),
            domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale2ndDegreConfirme(),
            domainBuilder.buildBadgeAcquisition.forPixEduFormationContinue2ndDegreConfirme(),
            domainBuilder.buildBadgeAcquisition.forPixEduFormationContinue2ndDegreAvance(),
          ];
          const pixEdu2ndDegreBadgeAcquisitionOrderer = new PixEdu2ndDegreBadgeAcquisitionOrderer({
            badgesAcquisitions,
          });

          // when
          const highestBadge = pixEdu2ndDegreBadgeAcquisitionOrderer.getHighestBadge();

          // then
          expect(highestBadge).to.deepEqualInstance(
            domainBuilder.buildBadgeAcquisition.forPixEduFormationContinue2ndDegreAvance()
          );
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there is no PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE badge acquisition', function () {
        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when there is a PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME badge acquisition', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should return the PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME badge acquisition', function () {
            // given
            const badgesAcquisitions = [
              domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale2ndDegreInitie(),
              domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale2ndDegreConfirme(),
              domainBuilder.buildBadgeAcquisition.forPixEduFormationContinue2ndDegreConfirme(),
            ];
            const pixEdu2ndDegreBadgeAcquisitionOrderer = new PixEdu2ndDegreBadgeAcquisitionOrderer({
              badgesAcquisitions,
            });

            // when
            const highestBadge = pixEdu2ndDegreBadgeAcquisitionOrderer.getHighestBadge();

            // then
            expect(highestBadge).to.deepEqualInstance(
              domainBuilder.buildBadgeAcquisition.forPixEduFormationContinue2ndDegreConfirme()
            );
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when there is no PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME badge acquisition', function () {
          // @ts-expect-error TS(2304): Cannot find name 'context'.
          context('when there is a PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME badge acquisition', function () {
            // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
            it('should return the PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_AVANCE badge acquisition', function () {
              // given
              const badgesAcquisitions = [
                domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale2ndDegreInitie(),
                domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale2ndDegreConfirme(),
              ];
              const pixEdu2ndDegreBadgeAcquisitionOrderer = new PixEdu2ndDegreBadgeAcquisitionOrderer({
                badgesAcquisitions,
              });

              // when
              const highestBadge = pixEdu2ndDegreBadgeAcquisitionOrderer.getHighestBadge();

              // then
              expect(highestBadge).to.deepEqualInstance(
                domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale2ndDegreConfirme()
              );
            });
          });
          // @ts-expect-error TS(2304): Cannot find name 'context'.
          context('when there is no PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME badge acquisition', function () {
            // @ts-expect-error TS(2304): Cannot find name 'context'.
            context('when there is a PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE badge acquisition', function () {
              // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
              it('should return the PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE badge acquisition', function () {
                // given
                const badgesAcquisitions = [
                  domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale2ndDegreInitie(),
                ];
                const pixEdu2ndDegreBadgeAcquisitionOrderer = new PixEdu2ndDegreBadgeAcquisitionOrderer({
                  badgesAcquisitions,
                });

                // when
                const highestBadge = pixEdu2ndDegreBadgeAcquisitionOrderer.getHighestBadge();

                // then
                expect(highestBadge).to.deepEqualInstance(
                  domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale2ndDegreInitie()
                );
              });
            });
          });
        });
      });
    });
  });
});
