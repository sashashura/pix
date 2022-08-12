// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('../../../../lib/infrastructure/repositories/knowledge-element-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementSnapshotRepository = require('../../../../lib/infrastructure/repositories/knowledge-element-snapshot-repository');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getEligibl... Remove this comment to see the full error message
  getEligibleCampaignParticipations,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateKn... Remove this comment to see the full error message
  generateKnowledgeElementSnapshots,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../scripts/prod/generate-knowledge-element-snapshots-for-campaigns');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Scripts | generate-knowledge-element-snapshots-for-campaigns.js', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getEligibleCampaignParticipations', function () {
    const maxParticipationCountToGet = 5;

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should avoid returning campaign participations that are not shared', async function () {
      // given
      const campaignId = databaseBuilder.factory.buildCampaign({ archivedAt: null }).id;
      databaseBuilder.factory.buildCampaignParticipation({ campaignId, sharedAt: null });
      await databaseBuilder.commit();

      // when
      const campaignParticipationData = await getEligibleCampaignParticipations(maxParticipationCountToGet);

      // then
      expect(campaignParticipationData.length).to.equal(0);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should avoid returning campaign participations that already have a corresponding snasphot', async function () {
      // given
      const campaignId = databaseBuilder.factory.buildCampaign({ archivedAt: null }).id;
      const userId = databaseBuilder.factory.buildUser().id;
      const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
        campaignId,
        sharedAt: new Date('2020-01-01'),
        userId,
      });
      databaseBuilder.factory.buildKnowledgeElementSnapshot({ snappedAt: campaignParticipation.sharedAt, userId });
      await databaseBuilder.commit();

      // when
      const campaignParticipationData = await getEligibleCampaignParticipations(maxParticipationCountToGet);

      // then
      expect(campaignParticipationData.length).to.equal(0);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return shared campaign participations from active campaigns that does not have a corresponding snapshot', async function () {
      // given
      const campaignId = databaseBuilder.factory.buildCampaign({ archivedAt: null }).id;
      const userId = databaseBuilder.factory.buildUser().id;
      const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
        campaignId,
        sharedAt: new Date('2020-01-01'),
        userId,
      });
      await databaseBuilder.commit();

      // when
      const campaignParticipationData = await getEligibleCampaignParticipations(maxParticipationCountToGet);

      // then
      expect(campaignParticipationData.length).to.equal(1);
      expect(campaignParticipationData[0]).to.deep.equal({
        userId: campaignParticipation.userId,
        sharedAt: campaignParticipation.sharedAt,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return shared campaign participations from active campaigns even if there is a snapshot from a different date that already exists', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const campaignParticipationWithoutSnapshot = databaseBuilder.factory.buildCampaignParticipation({
        sharedAt: new Date('2020-01-01'),
        userId,
      });
      databaseBuilder.factory.buildCampaignParticipation({ sharedAt: new Date('2020-02-01'), userId });
      databaseBuilder.factory.buildCampaignParticipation({ sharedAt: new Date('2020-03-01'), userId });
      databaseBuilder.factory.buildKnowledgeElementSnapshot({ snappedAt: new Date('2020-02-01'), userId });
      databaseBuilder.factory.buildKnowledgeElementSnapshot({ snappedAt: new Date('2020-03-01'), userId });
      await databaseBuilder.commit();

      // when
      const campaignParticipationData = await getEligibleCampaignParticipations(maxParticipationCountToGet);

      // then
      expect(campaignParticipationData.length).to.equal(1);
      expect(campaignParticipationData[0]).to.deep.equal({
        userId: campaignParticipationWithoutSnapshot.userId,
        sharedAt: campaignParticipationWithoutSnapshot.sharedAt,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return maximum campaign participation as set in the parameter', async function () {
      // given
      const campaignId = databaseBuilder.factory.buildCampaign({ archivedAt: null }).id;
      const userId1 = databaseBuilder.factory.buildUser().id;
      const userId2 = databaseBuilder.factory.buildUser().id;
      const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
        campaignId,
        sharedAt: new Date('2020-01-01'),
        userId: userId1,
      });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId,
        sharedAt: new Date('2020-01-01'),
        userId: userId2,
      });
      await databaseBuilder.commit();

      // when
      const campaignParticipationData = await getEligibleCampaignParticipations(1);

      // then
      expect(campaignParticipationData.length).to.equal(1);
      expect(campaignParticipationData[0]).to.deep.equal({
        userId: campaignParticipation.userId,
        sharedAt: campaignParticipation.sharedAt,
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#generateKnowledgeElementSnapshots', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(knowledgeElementRepository, 'findUniqByUserId');
      sinon.stub(knowledgeElementSnapshotRepository, 'save');
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      knowledgeElementRepository.findUniqByUserId.restore();
      knowledgeElementSnapshotRepository.save.restore();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save snapshots', async function () {
      // given
      const concurrency = 1;
      const campaignParticipationData = [{ userId: 1, sharedAt: new Date('2020-01-01') }];
      const expectedKnowledgeElements = ['someKnowledgeElements'];
      knowledgeElementRepository.findUniqByUserId
        .withArgs({ userId: campaignParticipationData[0].userId, limitDate: campaignParticipationData[0].sharedAt })
        .resolves(expectedKnowledgeElements);

      // when
      await generateKnowledgeElementSnapshots(campaignParticipationData, concurrency);

      // then
      expect(knowledgeElementSnapshotRepository.save).to.have.been.calledWithExactly({
        userId: campaignParticipationData[0].userId,
        snappedAt: campaignParticipationData[0].sharedAt,
        knowledgeElements: expectedKnowledgeElements,
      });
    });
  });
});
