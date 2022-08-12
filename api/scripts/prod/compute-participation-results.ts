// Usage: node compute-participation-results.js

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config({ path: `${__dirname}/../../.env` });

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const knowlegeElementSnapshotRepository = require('../../lib/infrastructure/repositories/knowledge-element-snapshot-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillDatas... Remove this comment to see the full error message
const skillDatasource = require('../../lib/infrastructure/datasources/learning-content/skill-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Participan... Remove this comment to see the full error message
const ParticipantResultsShared = require('../../lib/domain/models/ParticipantResultsShared');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../lib/domain/models/CampaignParticipationStatuses');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'constants'... Remove this comment to see the full error message
const constants = require('../../lib/infrastructure/constants');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'count'.
let count: $TSFixMe;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'total'.
let total: $TSFixMe;
let logEnable: $TSFixMe;
async function computeParticipantResultsShared(concurrency = 1, log = true) {
  logEnable = log;
  const campaigns = await knex('campaigns')
    .distinct('campaigns.id')
    .select('campaigns.id')
    .join('campaign-participations', 'campaign-participations.campaignId', 'campaigns.id')
    .where({ status: SHARED, pixScore: null });
  count = 0;
  total = campaigns.length;
  _log(`Campagnes à traiter ${total}`);

  await bluebird.map(campaigns, _updateCampaignParticipations, { concurrency });
}

async function _updateCampaignParticipations(campaign: $TSFixMe) {
  const participationResults = await _computeCampaignParticipationResults(campaign);

  // eslint-disable-next-line knex/avoid-injections
  await knex.raw(`UPDATE "campaign-participations"
  SET "validatedSkillsCount" = "participationSkillCounts"."validatedSkillsCount", "masteryRate" = "participationSkillCounts"."masteryRate", "pixScore" = "participationSkillCounts"."pixScore"
  FROM (VALUES ${_toSQLValues(
    participationResults
  )}) AS "participationSkillCounts"(id, "validatedSkillsCount", "masteryRate", "pixScore")
  WHERE "campaign-participations".id = "participationSkillCounts".id`);

  count++;
  _log(`${count} / ${total}`);
}

async function _computeCampaignParticipationResults(campaign: $TSFixMe) {
  const campaignParticipationInfosChunks = await _getCampaignParticipationChunks(campaign);
  const targetedSkillIds = await _fetchTargetedSkillIds(campaign.id);
  const computeResultsWithTargetedSkillIds = _.partial(_computeResults, targetedSkillIds);

  const participantsResults = await bluebird.mapSeries(
    campaignParticipationInfosChunks,
    computeResultsWithTargetedSkillIds
  );

  return participantsResults.flat();
}

async function _getCampaignParticipationChunks(campaign: $TSFixMe) {
  const campaignParticipations = await knex('campaign-participations').select(['userId', 'sharedAt', 'id']).where({
    campaignId: campaign.id,
    pixScore: null,
    status: SHARED,
  });

  return _.chunk(campaignParticipations, constants.CHUNK_SIZE_CAMPAIGN_RESULT_PROCESSING);
}

async function _fetchTargetedSkillIds(campaignId: $TSFixMe) {
  const skillIds = await knex('campaigns')
    .pluck('skillId')
    .join('target-profiles_skills', 'target-profiles_skills.targetProfileId', 'campaigns.targetProfileId')
    .where('campaigns.id', campaignId);

  const targetedSkillIds = await skillDatasource.findOperativeByRecordIds(skillIds);

  return targetedSkillIds.map(({
    id
  }: $TSFixMe) => id);
}

async function _computeResults(targetedSkillIds: $TSFixMe, campaignParticipation: $TSFixMe) {
  const knowledgeElementByUser = await _getKnowledgeElementsByUser(campaignParticipation);

  return campaignParticipation.map(({
    userId,
    id
  }: $TSFixMe) => {
    return new ParticipantResultsShared({
      campaignParticipationId: id,
      knowledgeElements: knowledgeElementByUser[userId],
      targetedSkillIds,
    });
  });
}

async function _getKnowledgeElementsByUser(campaignParticipations: $TSFixMe) {
  const sharingDateByUserId = {};
  campaignParticipations.forEach(({
    userId,
    sharedAt
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  }: $TSFixMe) => (sharingDateByUserId[userId] = sharedAt));
  const knowledgeElementByUser = await knowlegeElementSnapshotRepository.findByUserIdsAndSnappedAtDates(
    sharingDateByUserId
  );
  return knowledgeElementByUser;
}

function _toSQLValues(participantsResults: $TSFixMe) {
  return participantsResults
    .map(
      ({
        id,
        validatedSkillsCount,
        masteryRate,
        pixScore
      }: $TSFixMe) =>
        `(${id}, ${validatedSkillsCount}, ${masteryRate}, ${pixScore})`
    )
    .join(', ');
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = computeParticipantResultsShared;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'exitCode'.
let exitCode: $TSFixMe;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SUCCESS'.
const SUCCESS = 0;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FAILURE'.
const FAILURE = 1;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'concurrenc... Remove this comment to see the full error message
const concurrency = parseInt(process.argv[2]);

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
if (require.main === module) {
  computeParticipantResultsShared(concurrency).then(handleSuccess).catch(handleError).finally(exit);
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function handleSuccess() {
  exitCode = SUCCESS;
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function handleError(err: $TSFixMe) {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.error(err);
  exitCode = FAILURE;
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function exit() {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('code', exitCode);
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  process.exit(exitCode);
}

function _log(message: $TSFixMe) {
  if (logEnable) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log(message);
  }
}
