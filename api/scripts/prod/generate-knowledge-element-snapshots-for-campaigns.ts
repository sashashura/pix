// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'yargs'.
const yargs = require('yargs');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('../../lib/infrastructure/repositories/knowledge-element-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementSnapshotRepository = require('../../lib/infrastructure/repositories/knowledge-element-snapshot-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
const { AlreadyExistingEntityError } = require('../../lib/domain/errors');

const DEFAULT_MAX_SNAPSHOT_COUNT = 5000;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_CO... Remove this comment to see the full error message
const DEFAULT_CONCURRENCY = 3;

function _validateAndNormalizeMaxSnapshotCount(maxSnapshotCount: $TSFixMe) {
  if (isNaN(maxSnapshotCount)) {
    maxSnapshotCount = DEFAULT_MAX_SNAPSHOT_COUNT;
  }
  if (maxSnapshotCount <= 0 || maxSnapshotCount > 50000) {
    throw new Error(`Nombre max de snapshots ${maxSnapshotCount} ne peut pas être inférieur à 1 ni supérieur à 50000.`);
  }

  return maxSnapshotCount;
}

function _validateAndNormalizeConcurrency(concurrency: $TSFixMe) {
  if (isNaN(concurrency)) {
    concurrency = DEFAULT_CONCURRENCY;
  }
  if (concurrency <= 0 || concurrency > 10) {
    throw new Error(`Concurrent ${concurrency} ne peut pas être inférieur à 1 ni supérieur à 10.`);
  }

  return concurrency;
}

function _validateAndNormalizeArgs({
  concurrency,
  maxSnapshotCount
}: $TSFixMe) {
  const finalMaxSnapshotCount = _validateAndNormalizeMaxSnapshotCount(maxSnapshotCount);
  const finalConcurrency = _validateAndNormalizeConcurrency(concurrency);

  return {
    maxSnapshotCount: finalMaxSnapshotCount,
    concurrency: finalConcurrency,
  };
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getEligibl... Remove this comment to see the full error message
async function getEligibleCampaignParticipations(maxSnapshotCount: $TSFixMe) {
  return knex('campaign-participations')
    .select('campaign-participations.userId', 'campaign-participations.sharedAt')
    .leftJoin('knowledge-element-snapshots', function(this: $TSFixMe) {
      this.on('knowledge-element-snapshots.userId', 'campaign-participations.userId').andOn(
        'knowledge-element-snapshots.snappedAt',
        'campaign-participations.sharedAt'
      );
    })
    .whereNotNull('campaign-participations.sharedAt')
    .where((qb: $TSFixMe) => {
      qb.whereNull('knowledge-element-snapshots.snappedAt').orWhereRaw('?? != ??', [
        'campaign-participations.sharedAt',
        'knowledge-element-snapshots.snappedAt',
      ]);
    })
    .orderBy('campaign-participations.userId')
    .limit(maxSnapshotCount);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateKn... Remove this comment to see the full error message
async function generateKnowledgeElementSnapshots(campaignParticipationData: $TSFixMe, concurrency: $TSFixMe) {
  return bluebird.map(
    campaignParticipationData,
    async (campaignParticipation: $TSFixMe) => {
      const { userId, sharedAt } = campaignParticipation;
      const knowledgeElements = await knowledgeElementRepository.findUniqByUserId({ userId, limitDate: sharedAt });
      try {
        await knowledgeElementSnapshotRepository.save({ userId, snappedAt: sharedAt, knowledgeElements });
      } catch (err) {
        if (!(err instanceof AlreadyExistingEntityError)) {
          throw err;
        }
      }
    },
    { concurrency }
  );
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  try {
    const commandLineArgs = yargs
      .option('maxSnapshotCount', {
        description: 'Nombre de snapshots max. à générer.',
        type: 'number',
        default: DEFAULT_MAX_SNAPSHOT_COUNT,
      })
      .option('concurrency', {
        description: 'Concurrence',
        type: 'number',
        default: DEFAULT_CONCURRENCY,
      })
      .help().argv;
    const { maxSnapshotCount, concurrency } = _validateAndNormalizeArgs(commandLineArgs);

    const campaignParticipationData = await getEligibleCampaignParticipations(maxSnapshotCount);

    await generateKnowledgeElementSnapshots(campaignParticipationData, concurrency);
  } catch (error) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error('\x1b[31mErreur : %s\x1b[0m', (error as $TSFixMe).message);
    yargs.showHelp();
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
  getEligibleCampaignParticipations,
  generateKnowledgeElementSnapshots,
};
