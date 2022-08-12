// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Stage'.
const Stage = require('../../../../lib/domain/models/Stage');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Skill'.
const Skill = require('../../../../lib/domain/models/Skill');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfileWithLearningContent = require('../../../../lib/domain/models/TargetProfileWithLearningContent');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationOverview = require('../../../../lib/domain/read-models/CampaignParticipationOverview');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../lib/domain/models/CampaignParticipationStatuses');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED, STARTED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Read-Models | CampaignParticipationOverview', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('constructor', function () {
    //when
    const targetProfile = new TargetProfileWithLearningContent({ id: 2, skills: [new Skill()] });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create CampaignParticipationOverview', function () {
      // when
      const campaignParticipationOverview = new CampaignParticipationOverview({
        id: 3,
        createdAt: new Date('2020-02-15T15:00:34Z'),
        status: SHARED,
        sharedAt: new Date('2020-03-15T15:00:34Z'),
        targetProfile: targetProfile,
        organizationName: 'Pix',
        campaignCode: 'campaignCode',
        campaignTitle: 'campaignTitle',
        masteryRate: 0.5,
      });

      // then
      expect(campaignParticipationOverview.id).to.equal(3);
      expect(campaignParticipationOverview.createdAt).to.deep.equal(new Date('2020-02-15T15:00:34Z'));
      expect(campaignParticipationOverview.sharedAt).to.deep.equal(new Date('2020-03-15T15:00:34Z'));
      expect(campaignParticipationOverview.isShared).to.be.true;
      expect(campaignParticipationOverview.targetProfileId).to.equal(2);
      expect(campaignParticipationOverview.organizationName).to.equal('Pix');
      expect(campaignParticipationOverview.status).to.equal(SHARED);
      expect(campaignParticipationOverview.campaignCode).to.equal('campaignCode');
      expect(campaignParticipationOverview.campaignTitle).to.equal('campaignTitle');
      expect(campaignParticipationOverview.masteryRate).to.equal(0.5);
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('masteryRate', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the masteryRate is undefined', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return null for the masteryRate', function () {
          // when
          const campaignParticipationOverview = new CampaignParticipationOverview({
            targetProfile: targetProfile,
            masteryRate: undefined,
          });

          // then
          expect(campaignParticipationOverview.masteryRate).to.equal(null);
        });
      });
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the masteryRate is null', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return null for the masteryRate', function () {
          // when
          const campaignParticipationOverview = new CampaignParticipationOverview({
            targetProfile: targetProfile,
            masteryRate: null,
          });

          // then
          expect(campaignParticipationOverview.masteryRate).to.equal(null);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the masteryRate equals to 0', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return 0 for the masteryRate', function () {
          // when
          const campaignParticipationOverview = new CampaignParticipationOverview({
            targetProfile: targetProfile,
            masteryRate: 0,
          });

          // then
          expect(campaignParticipationOverview.masteryRate).to.equal(0);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the masteryRate is a string', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the number for the masteryRate', function () {
          // when
          const campaignParticipationOverview = new CampaignParticipationOverview({
            targetProfile: targetProfile,
            masteryRate: '0.75',
          });

          // then
          expect(campaignParticipationOverview.masteryRate).to.equal(0.75);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#validatedStagesCount', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the participation is shared', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the targetProfile has stages', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return validated stages count', function () {
          const stage1 = new Stage({
            threshold: 0,
          });
          const stage2 = new Stage({
            threshold: 10,
          });
          const stage3 = new Stage({
            threshold: 30,
          });
          const stage4 = new Stage({
            threshold: 70,
          });
          const targetProfile = new TargetProfileWithLearningContent({
            stages: [stage3, stage1, stage2, stage4],
            skills: [new Skill(), new Skill()],
          });
          const campaignParticipationOverview = new CampaignParticipationOverview({
            status: SHARED,
            validatedSkillsCount: 1,
            targetProfile,
            masteryRate: '0.5',
          });

          expect(campaignParticipationOverview.validatedStagesCount).to.equal(2);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context("when the targetProfile doesn't have stages", function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return null', function () {
          const targetProfile = new TargetProfileWithLearningContent();
          const campaignParticipationOverview = new CampaignParticipationOverview({
            status: SHARED,
            validatedSkillsCount: 2,
            totalSkillsCount: 3,
            targetProfile,
          });

          expect(campaignParticipationOverview.validatedStagesCount).to.equal(null);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the participation is not shared', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return null', function () {
        const stage1 = new Stage({
          threshold: 0,
        });
        const stage2 = new Stage({
          threshold: 30,
        });
        const stage3 = new Stage({
          threshold: 70,
        });
        const targetProfile = new TargetProfileWithLearningContent({ stages: [stage3, stage1, stage2] });
        const campaignParticipationOverview = new CampaignParticipationOverview({
          status: STARTED,
          validatedSkillsCount: 2,
          totalSkillsCount: 3,
          targetProfile,
        });

        expect(campaignParticipationOverview.validatedStagesCount).to.equal(null);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#totalStagesCount', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('the target profile has stages', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the count of stages with a threshold over 0', function () {
        const stage1 = new Stage({
          threshold: 0,
        });
        const stage2 = new Stage({
          threshold: 3,
        });
        const stage3 = new Stage({
          threshold: 5,
        });
        const stage4 = new Stage({
          threshold: 8,
        });
        const stage5 = new Stage({
          threshold: 11,
        });
        const stage6 = new Stage({
          threshold: 14,
        });
        const targetProfileWithLearningContent = new TargetProfileWithLearningContent({
          stages: [stage1, stage2, stage3, stage4, stage5, stage6],
        });
        const campaignParticipationOverview = new CampaignParticipationOverview({
          status: SHARED,
          targetProfile: targetProfileWithLearningContent,
        });

        expect(campaignParticipationOverview.totalStagesCount).to.equal(5);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context("target profile doesn't have stages", function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 0', function () {
        const targetProfileWithLearningContent = new TargetProfileWithLearningContent();
        const campaignParticipationOverview = new CampaignParticipationOverview({
          status: SHARED,
          targetProfile: targetProfileWithLearningContent,
        });

        expect(campaignParticipationOverview.totalStagesCount).to.equal(0);
      });
    });
  });
});
