// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationBadgesService = require('./../../../../lib/domain/services/certification-badges-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgeAcqui... Remove this comment to see the full error message
const badgeAcquisitionRepository = require('../../../../lib/infrastructure/repositories/badge-acquisition-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileRepository = require('../../../../lib/infrastructure/repositories/target-profile-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('../../../../lib/infrastructure/repositories/knowledge-element-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgeCrite... Remove this comment to see the full error message
const badgeCriteriaService = require('../../../../lib/domain/services/badge-criteria-service');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Service | Certification Badges Service', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findStillValidBadgeAcquisitions', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(badgeAcquisitionRepository, 'findHighestCertifiable');
      sinon.stub(badgeCriteriaService, 'areBadgeCriteriaFulfilled');
      sinon.stub(targetProfileRepository, 'get');
      sinon.stub(knowledgeElementRepository, 'findUniqByUserId');
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('has no certifiable badges', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return []', async function () {
        // given
        const userId = 12;
        const domainTransaction = Symbol('someDomainTransaction');
        badgeAcquisitionRepository.findHighestCertifiable.withArgs({ userId, domainTransaction }).resolves([]);

        // when
        const badgesAcquisitions = await certificationBadgesService.findStillValidBadgeAcquisitions({
          userId,
          domainTransaction,
        });

        // then
        expect(badgesAcquisitions).to.deep.equal([]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('has certifiable badges but neither from Pix+ Droit nor Pix+ Édu', function () {
      let userId: $TSFixMe, knowledgeElements: $TSFixMe, badge: $TSFixMe, targetProfile: $TSFixMe, badgeAcquisition: $TSFixMe, domainTransaction: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        userId = 12;
        domainTransaction = Symbol('someDomainTransaction');
        knowledgeElements = [];
        targetProfile = { id: 12 };
        badge = domainBuilder.buildBadge({ targetProfileId: targetProfile.id });
        badgeAcquisition = domainBuilder.buildBadgeAcquisition({ id: 'badgeId', userId, badge });
        badgeAcquisitionRepository.findHighestCertifiable
          .withArgs({ userId, domainTransaction })
          .resolves([badgeAcquisition]);
        knowledgeElementRepository.findUniqByUserId.withArgs({ userId, domainTransaction }).resolves(knowledgeElements);
        targetProfileRepository.get.withArgs(targetProfile.id, domainTransaction).resolves(targetProfile);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('and badges are still valid', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return their badge-acquisitions', async function () {
          // given
          badgeCriteriaService.areBadgeCriteriaFulfilled
            .withArgs({ targetProfile, badge, knowledgeElements })
            .returns(true);

          // when
          const badgesAcquisitions = await certificationBadgesService.findStillValidBadgeAcquisitions({
            userId,
            domainTransaction,
          });

          // then
          expect(badgesAcquisitions).to.deep.equal([badgeAcquisition]);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('and badges are not valid', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return empty badge-acquisitions', async function () {
          // given
          badgeCriteriaService.areBadgeCriteriaFulfilled
            .withArgs({ targetProfile, badge, knowledgeElements })
            .returns(false);

          // when
          const badgesAcquisitions = await certificationBadgesService.findStillValidBadgeAcquisitions({
            userId,
            domainTransaction,
          });

          // then
          expect(badgesAcquisitions).to.deep.equal([]);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('has certifiable badges including Pix+ Droit', function () {
      let userId: $TSFixMe, knowledgeElements: $TSFixMe, targetProfile: $TSFixMe, domainTransaction: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        userId = 12;
        domainTransaction = Symbol('someDomainTransaction');
        knowledgeElements = [];
        targetProfile = { id: 12 };
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('has one badge acquisition', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return badge-acquisition with highest level', async function () {
          // given
          const badgeLevel1 = domainBuilder.buildBadge({
            id: 'maitre',
            targetProfileId: targetProfile.id,
            key: 'LEVEL_1',
          });
          const badgeAcquisitionLevel1 = domainBuilder.buildBadgeAcquisition({
            id: 'badgeId1',
            userId,
            badge: badgeLevel1,
          });
          badgeAcquisitionRepository.findHighestCertifiable
            .withArgs({ userId, domainTransaction })
            .resolves([badgeAcquisitionLevel1]);
          knowledgeElementRepository.findUniqByUserId
            .withArgs({ userId, domainTransaction })
            .resolves(knowledgeElements);
          targetProfileRepository.get.withArgs(targetProfile.id, domainTransaction).resolves(targetProfile);
          badgeCriteriaService.areBadgeCriteriaFulfilled
            .withArgs({ targetProfile, badge: badgeLevel1, knowledgeElements })
            .returns(true);

          // when
          const badgesAcquisitions = await certificationBadgesService.findStillValidBadgeAcquisitions({
            userId,
            domainTransaction,
          });

          // then
          expect(badgesAcquisitions).to.deep.equal([badgeAcquisitionLevel1]);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('has several badge acquisition', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the badge-acquisition with the highest level', async function () {
          // given
          const badgeLevel1 = domainBuilder.buildBadge({
            id: 'maitre',
            targetProfileId: targetProfile.id,
            key: 'LEVEL_1',
          });
          const badgeLevel2 = domainBuilder.buildBadge({
            id: 'expert',
            targetProfileId: targetProfile.id,
            key: 'LEVEL_2',
          });
          domainBuilder.buildBadgeAcquisition({
            id: 'badgeId1',
            userId,
            badge: badgeLevel1,
          });
          const badgeAcquisitionLevel2 = domainBuilder.buildBadgeAcquisition({
            id: 'badgeId2',
            userId,
            badge: badgeLevel2,
          });
          badgeAcquisitionRepository.findHighestCertifiable
            .withArgs({ userId, domainTransaction })
            .resolves([badgeAcquisitionLevel2]);
          knowledgeElementRepository.findUniqByUserId
            .withArgs({ userId, domainTransaction })
            .resolves(knowledgeElements);
          targetProfileRepository.get.withArgs(targetProfile.id, domainTransaction).resolves(targetProfile);
          badgeCriteriaService.areBadgeCriteriaFulfilled
            .withArgs({ targetProfile, badge: badgeLevel2, knowledgeElements })
            .returns(true);

          // when
          const badgesAcquisitions = await certificationBadgesService.findStillValidBadgeAcquisitions({
            userId,
            domainTransaction,
          });

          // then
          expect(badgesAcquisitions).to.deep.equal([badgeAcquisitionLevel2]);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('has different types of certifiable badges', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return badge-acquisitions with highest level for each type of certifiable badge', async function () {
        // given
        const userId = 12;
        const domainTransaction = Symbol('someDomainTransaction');
        const knowledgeElements: $TSFixMe = [];
        const targetProfile = { id: 456 };

        const pixEduFormationContinue1erDegreExpertBadgeAcquisition =
          domainBuilder.buildBadgeAcquisition.forPixEduFormationContinue1erDegreAvance();
        const pixEduFormationContinue1erAvanceBadgeAcquisition =
          domainBuilder.buildBadgeAcquisition.forPixEduFormationContinue1erDegreConfirme();
        const pixEduFormationContinue2ndDegreExpertBadgeAcquisition =
          domainBuilder.buildBadgeAcquisition.forPixEduFormationContinue2ndDegreAvance();
        const pixEduFormationContinue2ndAvanceBadgeAcquisition =
          domainBuilder.buildBadgeAcquisition.forPixEduFormationContinue2ndDegreConfirme();
        const pixDroitMaitreBadgeAcquisition = domainBuilder.buildBadgeAcquisition.forPixDroitMaitre();
        const pixDroitExpertBadgeAcquisition = domainBuilder.buildBadgeAcquisition.forPixDroitExpert();

        badgeAcquisitionRepository.findHighestCertifiable
          .withArgs({ userId, domainTransaction })
          .resolves([
            pixEduFormationContinue1erDegreExpertBadgeAcquisition,
            pixEduFormationContinue2ndDegreExpertBadgeAcquisition,
            pixDroitExpertBadgeAcquisition,
          ]);
        knowledgeElementRepository.findUniqByUserId.withArgs({ userId, domainTransaction }).resolves(knowledgeElements);
        targetProfileRepository.get.withArgs(targetProfile.id, domainTransaction).resolves(targetProfile);

        [
          pixEduFormationContinue1erDegreExpertBadgeAcquisition.badge,
          pixEduFormationContinue1erAvanceBadgeAcquisition.badge,
          pixEduFormationContinue2ndDegreExpertBadgeAcquisition.badge,
          pixEduFormationContinue2ndAvanceBadgeAcquisition.badge,
          pixDroitMaitreBadgeAcquisition.badge,
          pixDroitExpertBadgeAcquisition.badge,
        ].forEach((badge) => {
          badgeCriteriaService.areBadgeCriteriaFulfilled
            .withArgs({ targetProfile, badge, knowledgeElements })
            .returns(true);
        });

        // when
        const badgesAcquisitions = await certificationBadgesService.findStillValidBadgeAcquisitions({
          userId,
          domainTransaction,
        });

        // then
        expect(badgesAcquisitions).to.deep.equal([
          pixEduFormationContinue1erDegreExpertBadgeAcquisition,
          pixEduFormationContinue2ndDegreExpertBadgeAcquisition,
          pixDroitExpertBadgeAcquisition,
        ]);
      });
    });
  });
});
