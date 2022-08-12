// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { handleBadgeAcquisition } = require('../../../../lib/domain/events')._forTestOnly.handlers;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentCompleted = require('../../../../lib/domain/events/AssessmentCompleted');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Events | handle-badge-acquisition', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#handleBadgeAcquisition', function () {
    let badgeRepository: $TSFixMe, targetProfileRepository: $TSFixMe, knowledgeElementRepository: $TSFixMe, badgeAcquisitionRepository: $TSFixMe;
    let badgeCriteriaService: $TSFixMe;
    let dependencies: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      badgeRepository = {
        findByCampaignParticipationId: _.noop,
      };
      targetProfileRepository = {
        getByCampaignParticipationId: _.noop,
      };
      knowledgeElementRepository = {
        findUniqByUserId: _.noop,
      };
      badgeAcquisitionRepository = {
        createOrUpdate: _.noop,
      };
      badgeCriteriaService = {
        areBadgeCriteriaFulfilled: _.noop,
      };

      dependencies = {
        badgeAcquisitionRepository,
        badgeCriteriaService,
        badgeRepository,
        knowledgeElementRepository,
        targetProfileRepository,
      };
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('fails when event is not of correct type', async function () {
      // given
      const event = 'not an event of the correct type';

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(handleBadgeAcquisition)({ event, ...dependencies });

      // then
      expect(error).not.to.be.null;
    });
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the assessment belongs to a campaign', function () {
      const event = new AssessmentCompleted({
        userId: 'userId',
        campaignParticipationId: 'campaignParticipationId',
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the campaign is associated to one badge', function () {
        let badge: $TSFixMe;
        let targetProfile: $TSFixMe;
        let knowledgeElements: $TSFixMe;
        let badgeId: $TSFixMe;

        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          badgeId = Symbol('badgeId');
          targetProfile = Symbol('targetProfile');
          knowledgeElements = Symbol('knowledgeElements');

          sinon.stub(badgeRepository, 'findByCampaignParticipationId');
          badge = {
            id: badgeId,
            badgeCriteria: Symbol('badgeCriteria'),
          };
          badgeRepository.findByCampaignParticipationId.withArgs(event.campaignParticipationId).resolves([badge]);

          sinon.stub(targetProfileRepository, 'getByCampaignParticipationId');
          targetProfileRepository.getByCampaignParticipationId
            .withArgs(event.campaignParticipationId)
            .resolves(targetProfile);

          sinon.stub(knowledgeElementRepository, 'findUniqByUserId');
          knowledgeElementRepository.findUniqByUserId.withArgs({ userId: event.userId }).resolves(knowledgeElements);
          sinon.stub(badgeCriteriaService, 'areBadgeCriteriaFulfilled');
          sinon.stub(badgeAcquisitionRepository, 'createOrUpdate');
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should create a badge when badge requirements are fulfilled', async function () {
          // given
          badgeCriteriaService.areBadgeCriteriaFulfilled
            .withArgs({ targetProfile, knowledgeElements, badge })
            .returns(true);

          // when
          await handleBadgeAcquisition({ event, ...dependencies });

          // then
          expect(badgeAcquisitionRepository.createOrUpdate).to.have.been.calledWithExactly([
            {
              badgeId,
              userId: event.userId,
              campaignParticipationId: event.campaignParticipationId,
            },
          ]);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not create a badge when badge requirements are not fulfilled', async function () {
          // given
          badgeCriteriaService.areBadgeCriteriaFulfilled
            .withArgs({ targetProfile, knowledgeElements, badge })
            .returns(false);

          // when
          await handleBadgeAcquisition({ event, ...dependencies });

          // then
          expect(badgeAcquisitionRepository.createOrUpdate).to.not.have.been.called;
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the campaign is associated to two badges', function () {
        let badge1: $TSFixMe, badge2: $TSFixMe;
        let badgeId_1, badgeId_2;
        let targetProfile: $TSFixMe;
        let knowledgeElements: $TSFixMe;

        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          badgeId_1 = Symbol('badgeId_1');
          badgeId_2 = Symbol('badgeId_2');
          targetProfile = Symbol('targetProfile');
          knowledgeElements = Symbol('knowledgeElements');

          sinon.stub(badgeRepository, 'findByCampaignParticipationId');
          badge1 = {
            id: badgeId_1,
            badgeCriteria: Symbol('badgeCriteria'),
          };
          badge2 = {
            id: badgeId_2,
            badgeCriteria: Symbol('badgeCriteria'),
          };
          badgeRepository.findByCampaignParticipationId
            .withArgs(event.campaignParticipationId)
            .resolves([badge1, badge2]);

          sinon.stub(targetProfileRepository, 'getByCampaignParticipationId');
          targetProfileRepository.getByCampaignParticipationId
            .withArgs(event.campaignParticipationId)
            .resolves(targetProfile);

          sinon.stub(knowledgeElementRepository, 'findUniqByUserId');
          knowledgeElementRepository.findUniqByUserId.withArgs({ userId: event.userId }).resolves(knowledgeElements);

          sinon.stub(badgeCriteriaService, 'areBadgeCriteriaFulfilled');
          sinon.stub(badgeAcquisitionRepository, 'createOrUpdate');
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should create one badge when only one badge requirements are fulfilled', async function () {
          // given
          badgeCriteriaService.areBadgeCriteriaFulfilled
            .withArgs({ targetProfile, knowledgeElements, badge: badge1 })
            .returns(true);
          badgeCriteriaService.areBadgeCriteriaFulfilled
            .withArgs({ targetProfile, knowledgeElements, badge: badge2 })
            .returns(false);

          // when
          await handleBadgeAcquisition({ event, ...dependencies });

          // then
          expect(badgeAcquisitionRepository.createOrUpdate).to.have.been.calledWithExactly([
            {
              badgeId: badge1.id,
              userId: event.userId,
              campaignParticipationId: event.campaignParticipationId,
            },
          ]);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should create two badges when both badges requirements are fulfilled', async function () {
          // given
          badgeCriteriaService.areBadgeCriteriaFulfilled
            .withArgs({ targetProfile, knowledgeElements, badge: badge1 })
            .returns(true);
          badgeCriteriaService.areBadgeCriteriaFulfilled
            .withArgs({ targetProfile, knowledgeElements, badge: badge2 })
            .returns(true);

          // when
          await handleBadgeAcquisition({ event, ...dependencies });

          // then
          expect(badgeAcquisitionRepository.createOrUpdate).to.have.been.calledWithExactly([
            { badgeId: badge1.id, userId: event.userId, campaignParticipationId: event.campaignParticipationId },
            { badgeId: badge2.id, userId: event.userId, campaignParticipationId: event.campaignParticipationId },
          ]);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the campaign is not associated to a badge', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not create a badge', async function () {
          // given
          const userId = 42;
          const campaignParticipationId = 78;
          const event = new AssessmentCompleted({ userId, campaignParticipationId });
          sinon.stub(badgeRepository, 'findByCampaignParticipationId');
          badgeRepository.findByCampaignParticipationId.withArgs(event.campaignParticipationId).resolves([]);

          sinon.stub(badgeAcquisitionRepository, 'createOrUpdate');

          // when
          await handleBadgeAcquisition({ event, ...dependencies });

          // then
          expect(badgeAcquisitionRepository.createOrUpdate).to.not.have.been.called;
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the assessment does not belong to a campaign', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not create a badge', async function () {
        // given
        sinon.stub(badgeAcquisitionRepository, 'createOrUpdate');

        const userId = 42;
        const event = new AssessmentCompleted({ userId });

        // when
        await handleBadgeAcquisition({ event, ...dependencies });

        // then
        expect(badgeAcquisitionRepository.createOrUpdate).to.not.have.been.called;
      });
    });
  });
});
