// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PixEdu1erD... Remove this comment to see the full error message
const PixEdu1erDegreBadgeAcquisitionOrderer = require('../../../../lib/domain/models/PixEdu1erDegreBadgeAcquisitionOrderer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | PixEdu1erDegreBadgeAcquisitionOrderer', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#getHighestBadge', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is no Pix+ Édu 1er degre badge acquisition', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return undefined', function () {
        // given
        const badgesAcquisitions = [
          domainBuilder.buildBadgeAcquisition({ badge: domainBuilder.buildBadge({ key: 'NOT_PIX_EDU' }) }),
          domainBuilder.buildBadgeAcquisition({ badge: domainBuilder.buildBadge({ key: 'NOT_PIX_EDU' }) }),
        ];
        const pixEdu1erDegreBadgeAcquisitionOrderer = new PixEdu1erDegreBadgeAcquisitionOrderer({ badgesAcquisitions });

        // when
        const highestBadge = pixEdu1erDegreBadgeAcquisitionOrderer.getHighestBadge();

        // then
        expect(highestBadge).to.be.null;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT badge acquisition', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT badge acquisition', function () {
        // given
        const badgesAcquisitions = [
          domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale1erDegreInitie(),
          domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale1erDegreConfirme(),
          domainBuilder.buildBadgeAcquisition.forPixEduFormationContinue1erDegreConfirme(),
          domainBuilder.buildBadgeAcquisition.forPixEduFormationContinue1erDegreAvance(),
          domainBuilder.buildBadgeAcquisition.forPixEduFormationContinue1erDegreExpert(),
        ];
        const pixEdu1erDegreBadgeAcquisitionOrderer = new PixEdu1erDegreBadgeAcquisitionOrderer({ badgesAcquisitions });

        // when
        const highestBadge = pixEdu1erDegreBadgeAcquisitionOrderer.getHighestBadge();

        // then
        expect(highestBadge).to.deepEqualInstance(
          domainBuilder.buildBadgeAcquisition.forPixEduFormationContinue1erDegreExpert()
        );
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is no PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT badge acquisition', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there is a PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE badge acquisition', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE badge acquisition', function () {
          // given
          const badgesAcquisitions = [
            domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale1erDegreInitie(),
            domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale1erDegreConfirme(),
            domainBuilder.buildBadgeAcquisition.forPixEduFormationContinue1erDegreConfirme(),
            domainBuilder.buildBadgeAcquisition.forPixEduFormationContinue1erDegreAvance(),
          ];
          const pixEdu1erDegreBadgeAcquisitionOrderer = new PixEdu1erDegreBadgeAcquisitionOrderer({
            badgesAcquisitions,
          });

          // when
          const highestBadge = pixEdu1erDegreBadgeAcquisitionOrderer.getHighestBadge();

          // then
          expect(highestBadge).to.deepEqualInstance(
            domainBuilder.buildBadgeAcquisition.forPixEduFormationContinue1erDegreAvance()
          );
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there is no PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE badge acquisition', function () {
        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when there is a PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME badge acquisition', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should return the PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME badge acquisition', function () {
            // given
            const badgesAcquisitions = [
              domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale1erDegreInitie(),
              domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale1erDegreConfirme(),
              domainBuilder.buildBadgeAcquisition.forPixEduFormationContinue1erDegreConfirme(),
            ];
            const pixEdu1erDegreBadgeAcquisitionOrderer = new PixEdu1erDegreBadgeAcquisitionOrderer({
              badgesAcquisitions,
            });

            // when
            const highestBadge = pixEdu1erDegreBadgeAcquisitionOrderer.getHighestBadge();

            // then
            expect(highestBadge).to.deepEqualInstance(
              domainBuilder.buildBadgeAcquisition.forPixEduFormationContinue1erDegreConfirme()
            );
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when there is no PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME badge acquisition', function () {
          // @ts-expect-error TS(2304): Cannot find name 'context'.
          context('when there is a PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME badge acquisition', function () {
            // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
            it('should return the PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_AVANCE badge acquisition', function () {
              // given
              const badgesAcquisitions = [
                domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale1erDegreInitie(),
                domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale1erDegreConfirme(),
              ];
              const pixEdu1erDegreBadgeAcquisitionOrderer = new PixEdu1erDegreBadgeAcquisitionOrderer({
                badgesAcquisitions,
              });

              // when
              const highestBadge = pixEdu1erDegreBadgeAcquisitionOrderer.getHighestBadge();

              // then
              expect(highestBadge).to.deepEqualInstance(
                domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale1erDegreConfirme()
              );
            });
          });
          // @ts-expect-error TS(2304): Cannot find name 'context'.
          context('when there is no PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME badge acquisition', function () {
            // @ts-expect-error TS(2304): Cannot find name 'context'.
            context('when there is a PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE badge acquisition', function () {
              // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
              it('should return the PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE badge acquisition', function () {
                // given
                const badgesAcquisitions = [
                  domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale1erDegreInitie(),
                ];
                const pixEdu1erDegreBadgeAcquisitionOrderer = new PixEdu1erDegreBadgeAcquisitionOrderer({
                  badgesAcquisitions,
                });

                // when
                const highestBadge = pixEdu1erDegreBadgeAcquisitionOrderer.getHighestBadge();

                // then
                expect(highestBadge).to.deepEqualInstance(
                  domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale1erDegreInitie()
                );
              });
            });
          });
        });
      });
    });
  });
});
