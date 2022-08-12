// Usage: node compute-pole-emploi-sendings PIXEMPLOI 10
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignRe... Remove this comment to see the full error message
const campaignRepository = require('../../lib/infrastructure/repositories/campaign-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignPa... Remove this comment to see the full error message
const campaignParticipationResultRepository = require('../../lib/infrastructure/repositories/campaign-participation-result-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileRepository = require('../../lib/infrastructure/repositories/target-profile-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'poleEmploi... Remove this comment to see the full error message
const poleEmploiSendingRepository = require('../../lib/infrastructure/repositories/pole-emploi-sending-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userReposi... Remove this comment to see the full error message
const userRepository = require('../../lib/infrastructure/repositories/user-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PoleEmploi... Remove this comment to see the full error message
const PoleEmploiPayload = require('../../lib/infrastructure/externals/pole-emploi/PoleEmploiPayload');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PoleEmploi... Remove this comment to see the full error message
const PoleEmploiSending = require('../../lib/domain/models/PoleEmploiSending');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'count'.
let count;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'total'.
let total;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'computePol... Remove this comment to see the full error message
async function computePoleEmploiSendings(campaignCode: $TSFixMe, concurrency: $TSFixMe) {
  const campaignParticipationsStarted = await knex('campaign-participations')
    .select(
      'campaign-participations.id',
      'campaign-participations.createdAt',
      'campaign-participations.userId',
      'campaign-participations.campaignId'
    )
    .join('campaigns', 'campaigns.id', 'campaign-participations.campaignId')
    .join('organization-tags', 'organization-tags.organizationId', 'campaigns.organizationId')
    .join('tags', 'tags.id', 'organization-tags.tagId')
    .leftJoin('pole-emploi-sendings', function(this: $TSFixMe) {
      this.on({ 'pole-emploi-sendings.campaignParticipationId': 'campaign-participations.id' }).andOnVal(
        'pole-emploi-sendings.type',
        PoleEmploiSending.TYPES.CAMPAIGN_PARTICIPATION_START
      );
    })
    .where({ 'pole-emploi-sendings.id': null, 'tags.name': 'POLE EMPLOI', 'campaigns.code': campaignCode });
  count = 0;
  total = campaignParticipationsStarted.length;
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log(`Participations commencées à traiter : ${total}`);

  await bluebird.map(campaignParticipationsStarted, _computeStartedPoleEmploiSendings, { concurrency });

  const campaignParticipationsCompleted = await knex('campaign-participations')
    .select(
      'campaign-participations.id',
      'campaign-participations.createdAt',
      'campaign-participations.userId',
      'campaign-participations.campaignId',
      'assessments.updatedAt as assessmentUpdatedAt'
    )
    .join('campaigns', 'campaigns.id', 'campaign-participations.campaignId')
    .join('organization-tags', 'organization-tags.organizationId', 'campaigns.organizationId')
    .join('tags', 'tags.id', 'organization-tags.tagId')
    .join('assessments', 'assessments.campaignParticipationId', 'campaign-participations.id')
    .leftJoin('pole-emploi-sendings', function(this: $TSFixMe) {
      this.on({ 'pole-emploi-sendings.campaignParticipationId': 'campaign-participations.id' }).andOnVal(
        'pole-emploi-sendings.type',
        PoleEmploiSending.TYPES.CAMPAIGN_PARTICIPATION_COMPLETION
      );
    })
    .where({
      'pole-emploi-sendings.id': null,
      'tags.name': 'POLE EMPLOI',
      'campaigns.code': campaignCode,
      'assessments.state': 'completed',
    });
  count = 0;
  total = campaignParticipationsCompleted.length;
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log(`Participations terminées à traiter : ${total}`);

  await bluebird.map(campaignParticipationsCompleted, _computeCompletedPoleEmploiSendings, { concurrency });

  const campaignParticipationsShared = await knex('campaign-participations')
    .select(
      'campaign-participations.id',
      'campaign-participations.createdAt',
      'campaign-participations.userId',
      'campaign-participations.campaignId',
      'campaign-participations.sharedAt'
    )
    .join('campaigns', 'campaigns.id', 'campaign-participations.campaignId')
    .join('organization-tags', 'organization-tags.organizationId', 'campaigns.organizationId')
    .join('tags', 'tags.id', 'organization-tags.tagId')
    .leftJoin('pole-emploi-sendings', function(this: $TSFixMe) {
      this.on({ 'pole-emploi-sendings.campaignParticipationId': 'campaign-participations.id' }).andOnVal(
        'pole-emploi-sendings.type',
        PoleEmploiSending.TYPES.CAMPAIGN_PARTICIPATION_SHARING
      );
    })
    .where({ 'pole-emploi-sendings.id': null, 'tags.name': 'POLE EMPLOI', 'campaigns.code': campaignCode })
    .whereNotNull('campaign-participations.sharedAt');
  count = 0;
  total = campaignParticipationsShared.length;
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log(`Participations partagées à traiter : ${total}`);

  await bluebird.map(campaignParticipationsShared, _computeSharedPoleEmploiSendings, { concurrency });
}

async function _computeStartedPoleEmploiSendings(participation: $TSFixMe) {
  const user = await userRepository.get(participation.userId);
  const campaign = await campaignRepository.get(participation.campaignId);
  const targetProfile = await targetProfileRepository.get(campaign.targetProfileId);

  const payload = PoleEmploiPayload.buildForParticipationStarted({
    user,
    campaign,
    targetProfile,
    participation,
  });

  const poleEmploiSending = PoleEmploiSending.buildForParticipationStarted({
    campaignParticipationId: participation.id,
    payload: payload.toString(),
    isSuccessful: false,
    responseCode: 'NOT_SENT',
  });

  await poleEmploiSendingRepository.create({ poleEmploiSending });

  count++;
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log(`${count} / ${total}`);
}

async function _computeCompletedPoleEmploiSendings(participation: $TSFixMe) {
  const user = await userRepository.get(participation.userId);
  const campaign = await campaignRepository.get(participation.campaignId);
  const targetProfile = await targetProfileRepository.get(campaign.targetProfileId);
  const assessment = { updatedAt: participation.assessmentUpdatedAt };

  const payload = PoleEmploiPayload.buildForParticipationFinished({
    user,
    campaign,
    targetProfile,
    participation,
    assessment,
  });

  const poleEmploiSending = PoleEmploiSending.buildForParticipationFinished({
    campaignParticipationId: participation.id,
    payload: payload.toString(),
    isSuccessful: false,
    responseCode: 'NOT_SENT',
  });

  await poleEmploiSendingRepository.create({ poleEmploiSending });

  count++;
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log(`${count} / ${total}`);
}

async function _computeSharedPoleEmploiSendings(participation: $TSFixMe) {
  const user = await userRepository.get(participation.userId);
  const campaign = await campaignRepository.get(participation.campaignId);
  const targetProfile = await targetProfileRepository.get(campaign.targetProfileId);
  // @ts-expect-error TS(2554): Expected 4 arguments, but got 1.
  const participationResult = await campaignParticipationResultRepository.getByParticipationId(participation.id);

  const payload = PoleEmploiPayload.buildForParticipationShared({
    user,
    campaign,
    targetProfile,
    participation,
    participationResult,
  });

  const poleEmploiSending = PoleEmploiSending.buildForParticipationShared({
    campaignParticipationId: participation.id,
    payload: payload.toString(),
    isSuccessful: false,
    responseCode: 'NOT_SENT',
  });

  await poleEmploiSendingRepository.create({ poleEmploiSending });

  count++;
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log(`${count} / ${total}`);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'exitCode'.
let exitCode;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SUCCESS'.
const SUCCESS = 0;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FAILURE'.
const FAILURE = 1;
// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
const campaignCode = process.argv[2];
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'concurrenc... Remove this comment to see the full error message
const concurrency = parseInt(process.argv[3]);

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
if (require.main === module) {
  computePoleEmploiSendings(campaignCode, concurrency).then(handleSuccess).catch(handleError).finally(exit);
}

function handleSuccess() {
  exitCode = SUCCESS;
}

function handleError(err: $TSFixMe) {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.error(err);
  exitCode = FAILURE;
}

function exit() {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('code', exitCode);
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  process.exit(exitCode);
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = computePoleEmploiSendings;
