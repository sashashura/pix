// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config({ path: '../../../.env' });

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fs'.
const fs = require('fs');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ScalingoCl... Remove this comment to see the full error message
const ScalingoClient = require('./helpers/scalingo/scalingo-client');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../../lib/infrastructure/logger');

const postgresDatabaseAddonProviderId = 'postgresql';

const checkDumpSize = ({
  dumpFilePath,
  expectedSize
}: $TSFixMe) => {
  // eslint-disable-next-line no-sync
  const { size: actualSize } = fs.statSync(dumpFilePath);
  if (actualSize !== expectedSize) {
    throw new Error(`Dump file mismatch, expecting ${expectedSize} but was ${actualSize} for ${dumpFilePath}`);
  }
};

const getConfiguration = () => {
  const schema = Joi.object({
    application: Joi.string().required(),
    token: Joi.string().required(),
    region: Joi.string().required().valid('osc-fr1', 'osc-secnum-fr1'),
  }).options({ allowUnknown: true });

  const configuration = {
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    region: process.env.DUMP_SCALINGO_REGION,
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    application: process.env.DUMP_SCALINGO_APPLICATION,
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    token: process.env.DUMP_SCALINGO_API_TOKEN,
  };

  const { error } = schema.validate(configuration);
  if (error) {
    throw new Error('Configuration is invalid: ' + error.message + ', but was: ' + error.details[0].context.value);
  }
  return configuration;
};

async function getScalingoBackup(configuration: $TSFixMe) {
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  const dumpFilePath = process.env.DUMP_FILE_PATH;
  const client = await ScalingoClient.getInstance(configuration);

  const addon = await client.getAddon(postgresDatabaseAddonProviderId);
  logger.info('Add-on ID: ' + addon.id);

  const dbClient = await client.getDatabaseClient(addon.id);

  const backups = await dbClient.getBackups();

  const backupsCompleted = backups.filter((backup: $TSFixMe) => backup.status === 'done');

  const backupByLastDate = backupsCompleted.sort((a: $TSFixMe, b: $TSFixMe) => {
    // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
    return new Date(b['created_at']) - new Date(a['created_at']);
  });

  const lastBackup = backupByLastDate[0];
  const lastBackupDate = lastBackup['created_at'];
  const lastBackupId = lastBackup.id;
  const expectedSize = lastBackup.size;

  logger.info(`About to download backup id ${lastBackupId} created at ${lastBackupDate}`);

  logger.info('Backup download - Doing..');
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  await dbClient.downloadBackup(lastBackupId, process.env.DUMP_FILE_PATH);
  logger.info('Backup download - Done');

  checkDumpSize({ dumpFilePath, expectedSize });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
const main = async () => {
  const configuration = getConfiguration();
  await getScalingoBackup(configuration);
};

(async () => {
  try {
    await main();
    // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
    process.exit(0);
  } catch (error) {
    logger.fatal(error);
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    process.exit(1);
  }
})();
