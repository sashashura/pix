// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getAllBadg... Remove this comment to see the full error message
async function getAllBadgeAcquistionsWithoutCampaignParticipationId() {
  return knex('badge-acquisitions').select().where({ campaignParticipationId: null });
}

function onlyUnique(value: $TSFixMe, index: $TSFixMe, self: $TSFixMe) {
  return self.indexOf(value) === index;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getCampaig... Remove this comment to see the full error message
async function getCampaignParticipationFromBadgeAcquisition(badgeAcquisition: $TSFixMe) {
  const dateBeforeBadgeAcquisition = new Date(badgeAcquisition.createdAt);
  dateBeforeBadgeAcquisition.setHours(badgeAcquisition.createdAt.getHours() - 1);
  const dateAfterBadgeAcquisition = new Date(badgeAcquisition.createdAt);
  dateAfterBadgeAcquisition.setHours(badgeAcquisition.createdAt.getHours() + 1);

  const badge = await knex('badges').select('targetProfileId').where({ id: badgeAcquisition.badgeId }).first();
  let campaignsParticipations = await knex('campaign-participations')
    .select('campaign-participations.id')
    .innerJoin('campaigns', 'campaigns.id', 'campaign-participations.campaignId')
    .innerJoin('assessments', 'assessments.campaignParticipationId', 'campaign-participations.id')
    .where({
      'campaign-participations.userId': badgeAcquisition.userId,
      'campaigns.targetProfileId': badge.targetProfileId,
      'assessments.state': 'completed',
    })
    .where(function(this: $TSFixMe) {
      this.whereBetween('campaign-participations.sharedAt', [
        dateBeforeBadgeAcquisition,
        dateAfterBadgeAcquisition,
      ]).orWhereBetween('assessments.updatedAt', [dateBeforeBadgeAcquisition, dateAfterBadgeAcquisition]);
    });
  if (campaignsParticipations.length === 0) {
    campaignsParticipations = await knex('campaign-participations')
      .select('campaign-participations.id')
      .innerJoin('campaigns', 'campaigns.id', 'campaign-participations.campaignId')
      .innerJoin('assessments', 'assessments.campaignParticipationId', 'campaign-participations.id')
      .where({
        'campaign-participations.userId': badgeAcquisition.userId,
        'campaigns.targetProfileId': badge.targetProfileId,
        'assessments.state': 'completed',
      });
  }
  return campaignsParticipations;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'updateBadg... Remove this comment to see the full error message
async function updateBadgeAcquisitionWithCampaignParticipationId(badgeAcquisition: $TSFixMe, campaignParticipations: $TSFixMe) {
  const campaignsParticipationIds = campaignParticipations.map((c: $TSFixMe) => c.id).filter(onlyUnique);
  if (campaignsParticipationIds.length === 1) {
    const campaignParticipationId = campaignParticipations[0].id;
    await knex('badge-acquisitions').update({ campaignParticipationId }).where({ id: badgeAcquisition.id });
    return;
  }
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log(
    `${badgeAcquisition.id} ;${badgeAcquisition.badgeId} ;${campaignParticipations.length};${campaignParticipations.map(
      (c: $TSFixMe) => c.id
    )}`
  );
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  try {
    const badgeAcquisitionsWithoutCampaignParticipationId =
      await getAllBadgeAcquistionsWithoutCampaignParticipationId();
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log(`${badgeAcquisitionsWithoutCampaignParticipationId.length} badges without campaignParticipationId.`);
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('badgeAcquisitionId;BadgeId;Possibility;ListOfCampaignParticipations');

    await bluebird.mapSeries(badgeAcquisitionsWithoutCampaignParticipationId, async (badgeAcquisition: $TSFixMe) => {
      const campaignsParticipations = await getCampaignParticipationFromBadgeAcquisition(badgeAcquisition);
      await updateBadgeAcquisitionWithCampaignParticipationId(badgeAcquisition, campaignsParticipations);
    });
  } catch (error) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error(error);
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    process.exit(1);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
if (require.main === module) {
  main().then(
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    () => process.exit(0),
    (err) => {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.error(err);
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.exit(1);
    }
  );
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  main,
  getAllBadgeAcquistionsWithoutCampaignParticipationId,
  getCampaignParticipationFromBadgeAcquisition,
  updateBadgeAcquisitionWithCampaignParticipationId,
};
