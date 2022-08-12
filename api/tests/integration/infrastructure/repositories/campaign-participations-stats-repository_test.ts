// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const campaignParticipationsStatsRepository = require('../../../../lib/infrastructure/repositories/campaign-participations-stats-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../lib/domain/models/CampaignParticipationStatuses');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'STARTED'.
const { STARTED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | Campaign Participations Stats', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getParticipationsActivityByDate', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are no participations', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an empty array', async function () {
        const { id: campaignId } = databaseBuilder.factory.buildCampaign();
        await databaseBuilder.commit();

        const activityByDate = await campaignParticipationsStatsRepository.getParticipationsActivityByDate(campaignId);

        expect(activityByDate.startedParticipations).deep.equal([]);
        expect(activityByDate.sharedParticipations).deep.equal([]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are participations', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the cumulative sum of participation for the campaign', async function () {
        const { id: campaignId } = databaseBuilder.factory.buildCampaign();
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, createdAt: '2021-01-02' });
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, createdAt: '2021-01-03' });
        databaseBuilder.factory.buildCampaignParticipation({ createdAt: '2021-01-01' });
        await databaseBuilder.commit();

        const activityByDate = await campaignParticipationsStatsRepository.getParticipationsActivityByDate(campaignId);

        expect(activityByDate.startedParticipations).deep.equal([
          { day: '2021-01-02', count: 1 },
          { day: '2021-01-03', count: 2 },
        ]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the cumulative sum of participation for the campaign while excluding dates with deleted participations', async function () {
        const { id: campaignId } = databaseBuilder.factory.buildCampaign();
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, createdAt: '2021-01-02' });
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          createdAt: '2021-01-03',
          deletedAt: '2021-01-03',
        });
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, createdAt: '2021-01-04' });
        databaseBuilder.factory.buildCampaignParticipation({ createdAt: '2021-01-01' });
        await databaseBuilder.commit();

        const activityByDate = await campaignParticipationsStatsRepository.getParticipationsActivityByDate(campaignId);

        expect(activityByDate.startedParticipations).deep.equal([
          { day: '2021-01-02', count: 1 },
          { day: '2021-01-04', count: 2 },
        ]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return empty array when participation is deleted ', async function () {
        const { id: campaignId } = databaseBuilder.factory.buildCampaign();
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          createdAt: '2021-01-03',
          deletedAt: '2021-01-03',
        });
        await databaseBuilder.commit();

        const activityByDate = await campaignParticipationsStatsRepository.getParticipationsActivityByDate(campaignId);

        expect(activityByDate.startedParticipations).deep.equal([]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the cumulative sum of shared participation for the campaign', async function () {
        const { id: campaignId } = databaseBuilder.factory.buildCampaign();
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          createdAt: '2021-01-01',
          sharedAt: '2021-01-01',
        });
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          createdAt: '2021-01-01',
          sharedAt: '2021-01-03',
        });
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          createdAt: '2021-01-02',
          status: STARTED,
          sharedAt: null,
        });
        databaseBuilder.factory.buildCampaignParticipation({ createdAt: '2021-01-01', sharedAt: '2021-01-01' });
        await databaseBuilder.commit();

        const activityByDate = await campaignParticipationsStatsRepository.getParticipationsActivityByDate(campaignId);

        expect(activityByDate.sharedParticipations).deep.equal([
          { day: '2021-01-01', count: 1 },
          { day: '2021-01-03', count: 2 },
        ]);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#countParticipationsByMasteryRate', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When there is no shared participation', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return an empty array', async function () {
        const { id: campaignId } = databaseBuilder.factory.buildCampaign();
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, status: STARTED });

        const resultDistribution = await campaignParticipationsStatsRepository.countParticipationsByMasteryRate({
          campaignId,
        });

        expect(resultDistribution).to.be.empty;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When there are shared participation', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns the participation count by mastery rate', async function () {
        const { id: campaignId } = databaseBuilder.factory.buildCampaign();
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, masteryRate: 0.2 });
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, masteryRate: 0.1 });
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, masteryRate: 0.1 });

        await databaseBuilder.commit();
        const resultDistribution = await campaignParticipationsStatsRepository.countParticipationsByMasteryRate({
          campaignId,
        });
        expect(resultDistribution).to.exactlyContainInOrder([
          { count: 2, masteryRate: '0.10' },
          { count: 1, masteryRate: '0.20' },
        ]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When there are shared participation for other campaign', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns only participation count for given campaign', async function () {
        const { id: campaignId } = databaseBuilder.factory.buildCampaign();
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, masteryRate: 0.1 });
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, masteryRate: 0.2 });
        const { id: otherCampaignId } = databaseBuilder.factory.buildCampaign();
        databaseBuilder.factory.buildCampaignParticipation({ campaignId: otherCampaignId, masteryRate: 0.2 });

        await databaseBuilder.commit();
        const resultDistribution = await campaignParticipationsStatsRepository.countParticipationsByMasteryRate({
          campaignId,
        });
        expect(resultDistribution).to.exactlyContainInOrder([
          { count: 1, masteryRate: '0.10' },
          { count: 1, masteryRate: '0.20' },
        ]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When there are deleted participations', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('counts only not deleted participations', async function () {
        const { id: campaignId } = databaseBuilder.factory.buildCampaign();
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, masteryRate: 0.1 });
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          masteryRate: 0.2,
          deletedAt: new Date('2021-05-29'),
        });

        await databaseBuilder.commit();
        const resultDistribution = await campaignParticipationsStatsRepository.countParticipationsByMasteryRate({
          campaignId,
        });
        expect(resultDistribution).to.exactlyContainInOrder([{ count: 1, masteryRate: '0.10' }]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When there are participation without mastery rate', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns only participation count for participation with mastery rate', async function () {
        const { id: campaignId } = databaseBuilder.factory.buildCampaign();
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, masteryRate: 0.1 });
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, masteryRate: null });

        await databaseBuilder.commit();
        const resultDistribution = await campaignParticipationsStatsRepository.countParticipationsByMasteryRate({
          campaignId,
        });
        expect(resultDistribution).to.exactlyContainInOrder([{ count: 1, masteryRate: '0.10' }]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When there are participation not shared', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns only shared participation', async function () {
        const { id: campaignId } = databaseBuilder.factory.buildCampaign();
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, status: STARTED, masteryRate: 0.1 });
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, masteryRate: 1 });

        await databaseBuilder.commit();
        const resultDistribution = await campaignParticipationsStatsRepository.countParticipationsByMasteryRate({
          campaignId,
        });
        expect(resultDistribution).to.exactlyContainInOrder([{ count: 1, masteryRate: '1.00' }]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When there are participants whith several participations', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('counts the last participation for each participant', async function () {
        const { id: campaignId } = databaseBuilder.factory.buildCampaign();
        const { id: userId } = databaseBuilder.factory.buildUser();
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, userId, masteryRate: 0.5, isImproved: true });
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, userId, masteryRate: 1, isImproved: false });

        await databaseBuilder.commit();
        const resultDistribution = await campaignParticipationsStatsRepository.countParticipationsByMasteryRate({
          campaignId,
        });
        expect(resultDistribution).to.exactlyContainInOrder([{ count: 1, masteryRate: '1.00' }]);
      });
    });
  });
});
