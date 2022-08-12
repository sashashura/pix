// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, mockLearningContent, learningContentBuilder } = require('../../../test-helper');
const { campaignParticipationOverviewFactory } = databaseBuilder.factory;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const campaignParticipationOverviewRepository = require('../../../../lib/infrastructure/repositories/campaign-participation-overview-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../lib/domain/models/CampaignParticipationStatuses');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../../../../lib/domain/models/CampaignTypes');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userId'.
let userId: $TSFixMe;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | Campaign Participation Overview', function () {
  let targetProfile: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    userId = databaseBuilder.factory.buildUser().id;
    const learningContent = [
      {
        id: 'recArea1',
        competences: [
          {
            id: 'recCompetence1',
            tubes: [
              {
                id: 'recTube1',
                skills: [
                  {
                    id: 'recSkillId1',
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
    const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
    mockLearningContent(learningContentObjects);
    targetProfile = databaseBuilder.factory.buildTargetProfile();
    databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId: targetProfile.id, skillId: 'recSkillId1' });
    databaseBuilder.factory.buildStage({ targetProfileId: targetProfile.id });
    await databaseBuilder.commit();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByUserIdWithFilters', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is no filter', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('retrieves information about campaign participation, campaign and organization', async function () {
        const { id: organizationId } = databaseBuilder.factory.buildOrganization({ name: 'Organization ABCD' });
        const { id: campaignId } = databaseBuilder.factory.buildCampaign({
          title: 'Campaign ABCD',
          code: 'ABCD',
          organizationId,
          targetProfileId: targetProfile.id,
        });
        const { id: participationId } = databaseBuilder.factory.buildCampaignParticipation({
          userId,
          campaignId,
          createdAt: new Date('2020-01-01'),
          sharedAt: new Date('2020-01-02'),
          validatedSkillsCount: 1,
          status: CampaignParticipationStatuses.SHARED,
          masteryRate: 0.1,
        });
        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: participationId,
          state: Assessment.states.COMPLETED,
        });
        await databaseBuilder.commit();

        const {
          campaignParticipationOverviews: [campaignParticipation],
        } = await campaignParticipationOverviewRepository.findByUserIdWithFilters({ userId });

        expect(campaignParticipation).to.deep.include({
          id: participationId,
          createdAt: new Date('2020-01-01'),
          sharedAt: new Date('2020-01-02'),
          isShared: true,
          campaignCode: 'ABCD',
          campaignTitle: 'Campaign ABCD',
          organizationName: 'Organization ABCD',
          targetProfileId: targetProfile.id,
          masteryRate: 0.1,
          totalStagesCount: 1,
          validatedStagesCount: 1,
          status: 'SHARED',
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should retrieve all campaign participation of the user', async function () {
        const { id: campaign1Id } = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id });
        const { id: campaign2Id } = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id });
        const { id: participation1Id } = campaignParticipationOverviewFactory.build({
          userId,
          campaignId: campaign1Id,
        });
        const { id: participation2Id } = campaignParticipationOverviewFactory.build({
          userId,
          campaignId: campaign2Id,
        });
        campaignParticipationOverviewFactory.build();
        await databaseBuilder.commit();

        const { campaignParticipationOverviews } =
          await campaignParticipationOverviewRepository.findByUserIdWithFilters({ userId });
        const campaignParticipationUserIds = _.map(campaignParticipationOverviews, 'id');

        expect(campaignParticipationUserIds).to.exactlyContain([participation1Id, participation2Id]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should retrieve only campaign participation linked to ASSESSMENT', async function () {
        const { id: campaign1Id } = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id });
        const { id: campaign2Id } = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id });
        const { id: campaign3Id } = databaseBuilder.factory.buildCampaign({ type: CampaignTypes.PROFILES_COLLECTION });
        const { id: participation1Id } = campaignParticipationOverviewFactory.build({
          userId,
          campaignId: campaign1Id,
        });
        const { id: participation2Id } = campaignParticipationOverviewFactory.build({
          userId,
          campaignId: campaign2Id,
        });
        databaseBuilder.factory.buildCampaignParticipation({ userId, campaignId: campaign3Id });

        await databaseBuilder.commit();

        const { campaignParticipationOverviews } =
          await campaignParticipationOverviewRepository.findByUserIdWithFilters({ userId });
        const campaignParticipationUserIds = _.map(campaignParticipationOverviews, 'id');

        expect(campaignParticipationUserIds).to.exactlyContain([participation1Id, participation2Id]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('retrieves information about the most recent campaign participation of multipleSending campaign', async function () {
        const { id: campaignId } = databaseBuilder.factory.buildCampaign({
          targetProfileId: targetProfile.id,
          multipleSendings: true,
        });
        const { id: oldParticipationId } = databaseBuilder.factory.buildCampaignParticipation({
          userId,
          campaignId,
          isImproved: true,
        });
        const { id: participationId } = databaseBuilder.factory.buildCampaignParticipation({ userId, campaignId });
        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: oldParticipationId,
          state: Assessment.states.COMPLETED,
          createdAt: new Date('2020-01-01'),
        });
        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: participationId,
          state: Assessment.states.COMPLETED,
          createdAt: new Date('2020-01-03'),
        });
        await databaseBuilder.commit();

        const {
          campaignParticipationOverviews: [campaignParticipation],
        } = await campaignParticipationOverviewRepository.findByUserIdWithFilters({ userId });

        expect(campaignParticipation.id).to.equal(participationId);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('retrieves information about the most recent assessment of campaign participation', async function () {
        const { id: campaignId } = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id });
        const { id: participationId } = databaseBuilder.factory.buildCampaignParticipation({
          userId,
          campaignId,
          status: CampaignParticipationStatuses.TO_SHARE,
        });
        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: participationId,
          state: Assessment.states.ABORTED,
          createdAt: new Date('2020-01-01'),
        });
        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: participationId,
          state: Assessment.states.STARTED,
          createdAt: new Date('2020-01-02'),
        });
        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: participationId,
          state: Assessment.states.COMPLETED,
          createdAt: new Date('2020-01-03'),
        });
        await databaseBuilder.commit();

        const {
          campaignParticipationOverviews: [campaignParticipation],
        } = await campaignParticipationOverviewRepository.findByUserIdWithFilters({ userId });

        expect(campaignParticipation.status).to.equal(CampaignParticipationStatuses.TO_SHARE);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('retrieves the delete date', async function () {
        const deletedAt = new Date('2022-03-05');
        const { id: campaignId } = databaseBuilder.factory.buildCampaign({
          targetProfileId: targetProfile.id,
        });
        const { id: participationId } = databaseBuilder.factory.buildCampaignParticipation({
          userId,
          campaignId,
          status: CampaignParticipationStatuses.TO_SHARE,
          deletedAt,
        });
        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: participationId,
          state: Assessment.states.ABORTED,
        });
        await databaseBuilder.commit();

        const {
          campaignParticipationOverviews: [campaignParticipation],
        } = await campaignParticipationOverviewRepository.findByUserIdWithFilters({ userId });

        expect(campaignParticipation.disabledAt).to.deep.equal(deletedAt);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('retrieves archived date', async function () {
        const archivedAt = new Date('2020-05-26T09:54:00Z');
        const { id: campaignId } = databaseBuilder.factory.buildCampaign({
          targetProfileId: targetProfile.id,
          archivedAt,
        });
        const { id: participationId } = databaseBuilder.factory.buildCampaignParticipation({
          userId,
          campaignId,
          status: CampaignParticipationStatuses.TO_SHARE,
        });
        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: participationId,
          state: Assessment.states.ABORTED,
        });
        await databaseBuilder.commit();

        const {
          campaignParticipationOverviews: [campaignParticipation],
        } = await campaignParticipationOverviewRepository.findByUserIdWithFilters({ userId });

        expect(campaignParticipation.disabledAt).to.deep.equal(archivedAt);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('retrieves pagination information', async function () {
        const { id: oldestParticipation } = campaignParticipationOverviewFactory.buildOnGoing({
          userId,
          createdAt: new Date('2020-01-01'),
          targetProfileSkills: ['recSkillId1'],
        });
        campaignParticipationOverviewFactory.buildOnGoing({
          userId,
          createdAt: new Date('2020-01-02'),
          targetProfileSkills: ['recSkillId1'],
        });
        await databaseBuilder.commit();
        const page = { number: 2, size: 1 };

        const { campaignParticipationOverviews, pagination } =
          await campaignParticipationOverviewRepository.findByUserIdWithFilters({ userId, page });

        expect(campaignParticipationOverviews[0].id).to.equal(oldestParticipation);
        expect(pagination).to.deep.equal({
          page: 2,
          pageSize: 1,
          rowCount: 2,
          pageCount: 2,
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are filters', function () {
      let onGoingParticipation: $TSFixMe;
      let toShareParticipation: $TSFixMe;
      let endedParticipation: $TSFixMe;
      let archivedParticipation: $TSFixMe;
      let deletedParticipation: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        const { id: campaign1Id } = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id });
        const { id: campaign2Id } = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id });
        const { id: campaign3Id } = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id });
        const { id: campaign4Id } = databaseBuilder.factory.buildCampaign({
          targetProfileId: targetProfile.id,
          archivedAt: new Date('2020-01-02'),
        });
        const { id: campaign5Id } = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id });
        onGoingParticipation = campaignParticipationOverviewFactory.build({
          userId,
          assessmentState: Assessment.states.STARTED,
          sharedAt: null,
          campaignId: campaign1Id,
        });
        toShareParticipation = campaignParticipationOverviewFactory.build({
          userId,
          assessmentState: Assessment.states.COMPLETED,
          sharedAt: null,
          campaignId: campaign2Id,
        });
        endedParticipation = campaignParticipationOverviewFactory.build({
          userId,
          sharedAt: new Date('2020-01-02'),
          campaignId: campaign3Id,
        });
        archivedParticipation = campaignParticipationOverviewFactory.build({
          userId,
          sharedAt: null,
          campaignId: campaign4Id,
        });
        deletedParticipation = campaignParticipationOverviewFactory.build({
          userId,
          sharedAt: null,
          campaignId: campaign5Id,
          deletedAt: new Date('2022-01-01'),
        });

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('the filter is ONGOING', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('returns participation with a started assessment', async function () {
          const states = ['ONGOING'];
          const { campaignParticipationOverviews } =
            await campaignParticipationOverviewRepository.findByUserIdWithFilters({ userId, states });

          expect(campaignParticipationOverviews[0].id).to.equal(onGoingParticipation.id);
          expect(campaignParticipationOverviews).to.have.lengthOf(1);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('the filter is TO_SHARE', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('returns participation with a completed assessment', async function () {
          const states = ['TO_SHARE'];
          const { campaignParticipationOverviews } =
            await campaignParticipationOverviewRepository.findByUserIdWithFilters({ userId, states });

          expect(campaignParticipationOverviews[0].id).to.equal(toShareParticipation.id);
          expect(campaignParticipationOverviews).to.have.lengthOf(1);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('the filter is ENDED', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('returns shared participation', async function () {
          const states = ['ENDED'];
          const { campaignParticipationOverviews } =
            await campaignParticipationOverviewRepository.findByUserIdWithFilters({ userId, states });

          expect(campaignParticipationOverviews[0].id).to.equal(endedParticipation.id);
          expect(campaignParticipationOverviews).to.have.lengthOf(1);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('the filter is DISABLED', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('returns participation where the campaign is archived or the participation deleted', async function () {
          const states = ['DISABLED'];
          const { campaignParticipationOverviews } =
            await campaignParticipationOverviewRepository.findByUserIdWithFilters({ userId, states });

          expect(campaignParticipationOverviews).to.have.lengthOf(2);
          expect(campaignParticipationOverviews.map(({
            id
          }: $TSFixMe) => id)).to.exactlyContain([
            archivedParticipation.id,
            deletedParticipation.id,
          ]);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there are several statuses given for the status filter', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('returns only participations which matches with the given statuses', async function () {
          const states = ['ONGOING', 'TO_SHARE'];
          const { campaignParticipationOverviews } =
            await campaignParticipationOverviewRepository.findByUserIdWithFilters({ userId, states });

          expect(_.map(campaignParticipationOverviews, 'id')).to.exactlyContain([
            onGoingParticipation.id,
            toShareParticipation.id,
          ]);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('order', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when all campaign participation have different status', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('orders all campaign participation by status', async function () {
          const { id: participationArchived } = campaignParticipationOverviewFactory.buildArchived({
            userId,
            targetProfileSkills: ['recSkillId1'],
          });
          const { id: participationEndedId } = campaignParticipationOverviewFactory.buildEnded({
            userId,
            targetProfileSkills: ['recSkillId1'],
          });
          const { id: participationOnGoingId } = campaignParticipationOverviewFactory.buildOnGoing({
            userId,
            targetProfileSkills: ['recSkillId1'],
          });
          const { id: participationToShareId } = campaignParticipationOverviewFactory.buildToShare({
            userId,
            targetProfileSkills: ['recSkillId1'],
          });
          await databaseBuilder.commit();

          const { campaignParticipationOverviews } =
            await campaignParticipationOverviewRepository.findByUserIdWithFilters({ userId });
          const campaignParticipationIds = _.map(campaignParticipationOverviews, 'id');

          expect(campaignParticipationIds).to.exactlyContainInOrder([
            participationToShareId,
            participationOnGoingId,
            participationEndedId,
            participationArchived,
          ]);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there are campaign participation with the same status', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('orders all campaign participation by participation creation date', async function () {
          const { id: oldestParticipation } = campaignParticipationOverviewFactory.buildOnGoing({
            userId,
            createdAt: new Date('2020-01-01'),
            targetProfileSkills: ['recSkillId1'],
          });
          const { id: newestParticipation } = campaignParticipationOverviewFactory.buildOnGoing({
            userId,
            createdAt: new Date('2020-01-02'),
            targetProfileSkills: ['recSkillId1'],
          });
          await databaseBuilder.commit();

          const { campaignParticipationOverviews } =
            await campaignParticipationOverviewRepository.findByUserIdWithFilters({ userId });
          const campaignParticipationIds = _.map(campaignParticipationOverviews, 'id');

          expect(campaignParticipationIds).to.exactlyContainInOrder([newestParticipation, oldestParticipation]);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there are several campaign participation with the status ended', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('orders campaign participation by sharing date then participation creation date', async function () {
          const { id: firstParticipation } = campaignParticipationOverviewFactory.buildEnded({
            userId,
            sharedAt: new Date('2020-01-01'),
            createdAt: new Date('2020-01-04'),
            targetProfileSkills: ['recSkillId1'],
          });
          const { id: secondParticipation } = campaignParticipationOverviewFactory.buildEnded({
            userId,
            sharedAt: new Date('2020-01-02'),
            createdAt: new Date('2020-01-02'),
            targetProfileSkills: ['recSkillId1'],
          });
          const { id: lastParticipation } = campaignParticipationOverviewFactory.buildEnded({
            userId,
            sharedAt: new Date('2020-01-02'),
            createdAt: new Date('2020-01-03'),
            targetProfileSkills: ['recSkillId1'],
          });

          await databaseBuilder.commit();

          const { campaignParticipationOverviews } =
            await campaignParticipationOverviewRepository.findByUserIdWithFilters({ userId });
          const campaignParticipationIds = _.map(campaignParticipationOverviews, 'id');

          expect(campaignParticipationIds).to.exactlyContainInOrder([
            lastParticipation,
            secondParticipation,
            firstParticipation,
          ]);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there are several campaign participation with the status archived', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('orders campaign participation by participation creation date', async function () {
          const { id: firstParticipation } = campaignParticipationOverviewFactory.buildArchived({
            userId,
            sharedAt: new Date('2020-01-01'),
            createdAt: new Date('2020-01-04'),
            targetProfileSkills: ['recSkillId1'],
          });
          const { id: lastParticipation } = campaignParticipationOverviewFactory.buildArchived({
            userId,
            sharedAt: new Date('2020-01-02'),
            createdAt: new Date('2020-01-02'),
            targetProfileSkills: ['recSkillId1'],
          });
          const { id: secondParticipation } = campaignParticipationOverviewFactory.buildArchived({
            userId,
            sharedAt: null,
            createdAt: new Date('2020-01-03'),
            targetProfileSkills: ['recSkillId1'],
          });

          await databaseBuilder.commit();

          const { campaignParticipationOverviews } =
            await campaignParticipationOverviewRepository.findByUserIdWithFilters({ userId });
          const campaignParticipationIds = _.map(campaignParticipationOverviews, 'id');

          expect(campaignParticipationIds).to.exactlyContainInOrder([
            firstParticipation,
            secondParticipation,
            lastParticipation,
          ]);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when some campaigns are for novice so they cannot be shared', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not retrieve information about campaign participation, campaign and organization of this campaign', async function () {
        const { id: organizationId } = databaseBuilder.factory.buildOrganization({ name: 'Organization ABCD' });
        const { id: campaignId } = databaseBuilder.factory.buildCampaign({
          title: 'Campaign ABCD',
          code: 'ABCD',
          archivedAt: new Date('2020-01-03'),
          organizationId,
          targetProfileId: targetProfile.id,
          isForAbsoluteNovice: true,
        });
        const { id: participationId } = databaseBuilder.factory.buildCampaignParticipation({
          userId,
          campaignId,
          createdAt: new Date('2020-01-01'),
          sharedAt: new Date('2020-01-02'),
          validatedSkillsCount: 1,
        });
        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: participationId,
          state: Assessment.states.COMPLETED,
        });
        await databaseBuilder.commit();

        const { campaignParticipationOverviews } =
          await campaignParticipationOverviewRepository.findByUserIdWithFilters({ userId });

        expect(campaignParticipationOverviews).to.deep.equal([]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is at least one flash campaign', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not fetch targetProfile', async function () {
        // given
        const { id: organizationId } = databaseBuilder.factory.buildOrganization({ name: 'Organization ABCD' });
        const { id: campaignId } = databaseBuilder.factory.buildCampaign({
          title: 'Campaign FLASH',
          code: 'FLASH',
          organizationId,
          assessmentMethod: 'FLASH',
          targetProfileId: null,
        });
        const { id: campaignParticipationId } = databaseBuilder.factory.buildCampaignParticipation({
          userId,
          campaignId,
        });
        databaseBuilder.factory.buildAssessment({
          userId,
          campaignParticipationId,
          method: 'FLASH',
          type: Assessment.types.CAMPAIGN,
          targetProfile: null,
        });
        await databaseBuilder.commit();

        // when
        const { campaignParticipationOverviews } =
          await campaignParticipationOverviewRepository.findByUserIdWithFilters({ userId });

        // then
        expect(campaignParticipationOverviews).to.deep.equal([
          {
            campaignCode: 'FLASH',
            campaignTitle: 'Campaign FLASH',
            createdAt: new Date('2020-01-01T00:00:00Z'),
            id: campaignParticipationId,
            isShared: true,
            masteryRate: null,
            organizationName: 'Organization ABCD',
            sharedAt: new Date('2020-01-02T00:00:00Z'),
            status: 'SHARED',
            targetProfile: undefined,
            targetProfileId: undefined,
            disabledAt: null,
          },
        ]);
      });
    });
  });
});
