// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex, sinon } = require('../../test-helper');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
  main,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getAllBadg... Remove this comment to see the full error message
  getAllBadgeAcquistionsWithoutCampaignParticipationId,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getCampaig... Remove this comment to see the full error message
  getCampaignParticipationFromBadgeAcquisition,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'updateBadg... Remove this comment to see the full error message
  updateBadgeAcquisitionWithCampaignParticipationId,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../scripts/fill-campaign-participation-id-in-badge-acquisitions');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Scripts | fillCampaignParticipationIdInBadgeAcquisitions', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    sinon.stub(console, 'log');
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#main', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the campaignParticipationId of BadgeAcquisition', async function () {
      // given
      const user = databaseBuilder.factory.buildUser();
      const targetProfile = databaseBuilder.factory.buildTargetProfile();
      const badge = databaseBuilder.factory.buildBadge({ targetProfileId: targetProfile.id });
      const badgeAcquisitionWithoutCampaignId = databaseBuilder.factory.buildBadgeAcquisition({
        userId: user.id,
        badgeId: badge.id,
        campaignParticipationId: null,
        createdAt: new Date('2020-01-01'),
      });
      const campaign = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id });
      const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        userId: user.id,
      });
      databaseBuilder.factory.buildAssessment({
        campaignParticipationId: campaignParticipation.id,
        updatedAt: new Date('2020-01-01'),
        state: 'completed',
      });
      await databaseBuilder.commit();

      // when
      await main();

      // then
      const result = await knex('badge-acquisitions').select().where({ id: badgeAcquisitionWithoutCampaignId.id });
      expect(result[0].campaignParticipationId).to.equal(campaignParticipation.id);
    });
  });
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getAllBadgeAcquistionsWithoutCampaignParticipationId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return badge-acquisitions without campaignParticipationId', async function () {
      // given
      const user = databaseBuilder.factory.buildUser();
      const badge = databaseBuilder.factory.buildBadge();
      databaseBuilder.factory.buildBadgeAcquisition({
        userId: user.id,
        badgeId: badge.id,
        campaignParticipationId: null,
      });
      const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation();
      databaseBuilder.factory.buildBadgeAcquisition({
        userId: user.id,
        badgeId: badge.id,
        campaignParticipationId: campaignParticipation.id,
      });
      await databaseBuilder.commit();

      // when
      const result = await getAllBadgeAcquistionsWithoutCampaignParticipationId();

      // then
      expect(result).to.have.lengthOf(1);
      expect(result[0].campaignParticipationId).to.equal(null);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getCampaignParticipationFromBadgeAcquisition', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return possible campaignParticipations for one badge', async function () {
      // given
      const user = databaseBuilder.factory.buildUser();
      const targetProfile = databaseBuilder.factory.buildTargetProfile();
      const badge = databaseBuilder.factory.buildBadge({ targetProfileId: targetProfile.id });
      const badgeAcquisitionWithoutCampaignId = databaseBuilder.factory.buildBadgeAcquisition({
        userId: user.id,
        badgeId: badge.id,
        campaignParticipationId: null,
        createdAt: new Date('2020-01-01'),
      });
      const campaign = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id });
      const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        userId: user.id,
      });
      databaseBuilder.factory.buildAssessment({
        campaignParticipationId: campaignParticipation.id,
        updatedAt: new Date('2020-01-01'),
        state: 'completed',
      });
      await databaseBuilder.commit();

      // when
      const result = await getCampaignParticipationFromBadgeAcquisition(badgeAcquisitionWithoutCampaignId);

      // then
      expect(result).to.deep.equal([{ id: campaignParticipation.id }]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return only campaignParticipations whose assessment has completed on same date as badge was acquired', async function () {
      // given
      const user = databaseBuilder.factory.buildUser();
      const targetProfile = databaseBuilder.factory.buildTargetProfile();
      const badge = databaseBuilder.factory.buildBadge({ targetProfileId: targetProfile.id });
      const badgeAcquisitionWithoutCampaignId = databaseBuilder.factory.buildBadgeAcquisition({
        userId: user.id,
        badgeId: badge.id,
        campaignParticipationId: null,
        createdAt: new Date('2020-01-01'),
      });
      const campaign = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id });
      const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        userId: user.id,
      });

      const secondCampaign = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id });
      const secondCampaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
        campaignId: secondCampaign.id,
        userId: user.id,
      });

      const thirdCampaign = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id });
      const thirdCampaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
        campaignId: thirdCampaign.id,
        userId: user.id,
      });
      databaseBuilder.factory.buildAssessment({
        campaignParticipationId: campaignParticipation.id,
        updatedAt: new Date('2020-01-01'),
        state: 'completed',
      });
      databaseBuilder.factory.buildAssessment({
        campaignParticipationId: secondCampaignParticipation.id,
        updatedAt: new Date('2020-02-01'),
        state: 'completed',
      });
      databaseBuilder.factory.buildAssessment({
        campaignParticipationId: thirdCampaignParticipation.id,
        updatedAt: new Date('2020-01-01'),
        state: 'started',
      });

      await databaseBuilder.commit();

      // when
      const result = await getCampaignParticipationFromBadgeAcquisition(badgeAcquisitionWithoutCampaignId);

      // then
      expect(result).to.deep.equal([{ id: campaignParticipation.id }]);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateBadgeAcquisitionWithCampaignParticipationId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the badge-acquisitions with its campaignParticipationId', async function () {
      // given
      const user = databaseBuilder.factory.buildUser();
      const targetProfile = databaseBuilder.factory.buildTargetProfile();
      const badge = databaseBuilder.factory.buildBadge({ targetProfileId: targetProfile.id });
      const badgeAcquisitionWithoutCampaignId = databaseBuilder.factory.buildBadgeAcquisition({
        userId: user.id,
        badgeId: badge.id,
        campaignParticipationId: null,
        createdAt: new Date('2020-01-01'),
      });
      const campaign = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id });
      const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        userId: user.id,
      });
      await databaseBuilder.commit();

      // when
      await updateBadgeAcquisitionWithCampaignParticipationId(badgeAcquisitionWithoutCampaignId, [
        campaignParticipation,
      ]);

      // then
      const result = await knex('badge-acquisitions').select().where({ id: badgeAcquisitionWithoutCampaignId.id });
      expect(result[0].campaignParticipationId).to.equal(campaignParticipation.id);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not update the badge-acquisitions when there is more than one campaign participation', async function () {
      // given
      const user = databaseBuilder.factory.buildUser();
      const targetProfile = databaseBuilder.factory.buildTargetProfile();
      const badge = databaseBuilder.factory.buildBadge({ targetProfileId: targetProfile.id });
      const badgeAcquisitionWithoutCampaignId = databaseBuilder.factory.buildBadgeAcquisition({
        userId: user.id,
        badgeId: badge.id,
        campaignParticipationId: null,
        createdAt: new Date('2020-01-01'),
      });
      const campaign = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id });
      const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        userId: user.id,
      });
      const secondCampaign = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id });
      const secondCampaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
        campaignId: secondCampaign.id,
        userId: user.id,
      });
      await databaseBuilder.commit();

      // when
      await updateBadgeAcquisitionWithCampaignParticipationId(badgeAcquisitionWithoutCampaignId, [
        campaignParticipation,
        secondCampaignParticipation,
      ]);

      // then
      const result = await knex('badge-acquisitions').select().where({ id: badgeAcquisitionWithoutCampaignId.id });
      expect(result[0].campaignParticipationId).to.equal(null);
    });
  });
});
