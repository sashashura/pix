// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config();
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'performanc... Remove this comment to see the full error message
const { performance } = require('perf_hooks');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'yargs'.
const yargs = require('yargs/yargs');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { hideBin } = require('yargs/helpers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex, disconnect } = require('../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipation = require('../../lib/domain/models/CampaignParticipation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../lib/infrastructure/logger');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgeCrite... Remove this comment to see the full error message
const badgeCriteriaService = require('../../lib/domain/services/badge-criteria-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgeAcqui... Remove this comment to see the full error message
const badgeAcquisitionRepository = require('../../lib/infrastructure/repositories/badge-acquisition-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgeRepos... Remove this comment to see the full error message
const badgeRepository = require('../../lib/infrastructure/repositories/badge-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('../../lib/infrastructure/repositories/knowledge-element-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileRepository = require('../../lib/infrastructure/repositories/target-profile-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'cache'.
const cache = require('../../lib/infrastructure/caches/learning-content-cache');

const MAX_RANGE_SIZE = 100_000;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  const startTime = performance.now();
  logger.info(`Script compute badge acquisitions has started`);
  const { idMin, idMax, dryRun } = _getAllArgs();
  const range = normalizeRange({ idMin, idMax });
  const numberOfCreatedBadges = await computeAllBadgeAcquisitions({ ...range, dryRun });
  logger.info(`${numberOfCreatedBadges} badges created`);
  const endTime = performance.now();
  const duration = Math.round(endTime - startTime);
  logger.info(`Script has ended: took ${duration} milliseconds`);
}

function _getAllArgs() {
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  return yargs(hideBin(process.argv))
    .option('idMin', {
      type: 'number',
      demand: true,
      description: 'id de la première campagne participation',
    })
    .option('idMax', {
      type: 'number',
      demand: true,
      description: 'id de la dernière campagne participation',
    })
    .option('dryRun', {
      type: 'boolean',
      description: 'permet de lancer le script sans créer les badges manquants',
    })
    .help().argv;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'normalizeR... Remove this comment to see the full error message
function normalizeRange({
  idMin,
  idMax
}: $TSFixMe) {
  const rangeSize = idMax - idMin;
  if (rangeSize > MAX_RANGE_SIZE) {
    const newIdMax = idMin + MAX_RANGE_SIZE;
    logger.info(`Max range size exceeded : new idMax is ${newIdMax}`);
    return { idMin, idMax: newIdMax };
  }
  return { idMin, idMax };
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'computeAll... Remove this comment to see the full error message
async function computeAllBadgeAcquisitions({
  idMin,
  idMax,
  dryRun
}: $TSFixMe) {
  const campaignParticipations = await getCampaignParticipationsBetweenIds({ idMin, idMax });
  const numberOfBadgeCreatedByCampaignParticipation = await bluebird.mapSeries(
    campaignParticipations,
    async (campaignParticipation: $TSFixMe, index: $TSFixMe) => {
      logger.info(`${index}/${campaignParticipations.length}`);
      return computeBadgeAcquisition({
        campaignParticipation,
        dryRun,
        badgeCriteriaService,
        badgeAcquisitionRepository,
        badgeRepository,
        knowledgeElementRepository,
        targetProfileRepository,
      });
    }
  );
  return _.sum(numberOfBadgeCreatedByCampaignParticipation);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'computeBad... Remove this comment to see the full error message
async function computeBadgeAcquisition({
  campaignParticipation,
  dryRun = false,
  badgeCriteriaService,
  badgeAcquisitionRepository,
  badgeRepository,
  knowledgeElementRepository,
  targetProfileRepository
}: $TSFixMe = {}) {
  const associatedBadges = await _fetchPossibleCampaignAssociatedBadges(campaignParticipation, badgeRepository);
  if (_.isEmpty(associatedBadges)) {
    return 0;
  }

  const userId = campaignParticipation.userId;
  const targetProfile = await targetProfileRepository.getByCampaignParticipationId(campaignParticipation.id);
  const knowledgeElements = await knowledgeElementRepository.findUniqByUserId({ userId });

  const validatedBadgesByUser = associatedBadges.filter((badge: $TSFixMe) => badgeCriteriaService.areBadgeCriteriaFulfilled({ knowledgeElements, targetProfile, badge })
  );

  const acquiredBadgeIds = await badgeAcquisitionRepository.getAcquiredBadgeIds({
    badgeIds: validatedBadgesByUser.map(({
      id
    }: $TSFixMe) => id),
    userId,
  });

  const badgesAcquisitionToCreate = validatedBadgesByUser
    .filter((badge: $TSFixMe) => !acquiredBadgeIds.includes(badge.id))
    .map((badge: $TSFixMe) => {
      return {
        badgeId: badge.id,
        userId,
        campaignParticipationId: campaignParticipation.id,
      };
    });

  if (_.isEmpty(badgesAcquisitionToCreate)) {
    return 0;
  }

  if (!dryRun) {
    await badgeAcquisitionRepository.createOrUpdate(badgesAcquisitionToCreate);
  }

  return badgesAcquisitionToCreate.length;
}

function _fetchPossibleCampaignAssociatedBadges(campaignParticipation: $TSFixMe, badgeRepository: $TSFixMe) {
  return badgeRepository.findByCampaignParticipationId(campaignParticipation.id);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getCampaig... Remove this comment to see the full error message
async function getCampaignParticipationsBetweenIds({
  idMin,
  idMax
}: $TSFixMe) {
  const campaignParticipations = await knex('campaign-participations').whereBetween('id', [idMin, idMax]);
  return campaignParticipations.map((campaignParticipation: $TSFixMe) => new CampaignParticipation(campaignParticipation));
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isLaunched... Remove this comment to see the full error message
const isLaunchedFromCommandLine = require.main === module;

(async () => {
  if (isLaunchedFromCommandLine) {
    try {
      await main();
    } catch (error) {
      logger.error(error);
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.exitCode = 1;
    } finally {
      await disconnect();
      cache.quit();
    }
  }
})();

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  normalizeRange,
  computeAllBadgeAcquisitions,
  computeBadgeAcquisition,
  getCampaignParticipationsBetweenIds,
};
