// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config({ path: `${__dirname}/../.env` });

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'readFile'.
const { readFile } = require('fs/promises');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../lib/infrastructure/logger');
// Usage: node scripts/update-certifications-infos path/data.csv path/sessionsId.csv
// data.csv
// #externalId,birthdate,birthINSEECode,birthPostalCode,birthCity,birthCountry
// #EXTERNAL_ID,2000-01-01,NULL,75550, paris,FRANCE
// sessionsId.csv
// 1,12,30

('use strict');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'parseCsv'.
const { parseCsv, checkCsvHeader } = require('../helpers/csvHelpers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'values'.
const values = require('lodash/values');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'headers'.
const headers = {
  externalId: 'externalId',
  birthdate: 'birthdate',
  birthINSEECode: 'birthINSEECode',
  birthPostalCode: 'birthPostalCode',
  birthCity: 'birthCity',
  birthCountry: 'birthCountry',
};

async function _getSessionIds(sessionIdsFilePath: $TSFixMe) {
  const csvData = await readFile(sessionIdsFilePath, 'utf8');
  return csvData.split(',').map((id: $TSFixMe) => parseInt(id, 10));
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'updateCert... Remove this comment to see the full error message
async function updateCertificationInfos(dataFilePath: $TSFixMe, sessionIdsFilePath: $TSFixMe) {
  logger.info('Starting script update-certifications-infos');

  logger.trace(`Checking ${dataFilePath} data file...`);
  await checkCsvHeader({ filePath: dataFilePath, requiredFieldNames: values(headers) });
  logger.info('✅ ');

  logger.info('Reading and parsing csv data file... ');
  const csvData = await parseCsv(dataFilePath, { header: true, delimiter: ',', skipEmptyLines: true });
  logger.info('✅ ');
  logger.info('Reading and csv session ids file... ');
  const sessionIds = await _getSessionIds(sessionIdsFilePath);
  logger.info('✅ ');

  logger.info('Updating data in database... ');

  const trx = await knex.transaction();
  const info = { success: 0, failure: 0 };

  try {
    await bluebird.mapSeries(
      csvData,
      async ({
        birthdate,
        birthINSEECode,
        birthPostalCode,
        birthCity,
        birthCountry,
        externalId
      }: $TSFixMe) => {
        const certificationCourse = await trx
          .select('id', 'userId')
          .from('certification-courses')
          .where({ externalId: `${externalId}` })
          .whereInArray('sessionId', sessionIds)
          .first();

        if (!certificationCourse) {
          logger.warn(`Certification for external id ${externalId} not found`);
          info.failure++;
          return;
        }

        const { userId, id } = certificationCourse;

        await trx
          .table('certification-courses')
          .update({
            birthdate,
            birthplace: birthCity,
            birthPostalCode,
            birthINSEECode,
            birthCountry,
          })
          .where({ id });

        await trx
          .table('certification-candidates')
          .update({
            birthdate,
            birthINSEECode,
            birthPostalCode,
            birthCity,
            birthCountry,
          })
          .where({ externalId, userId });

        info.success++;
      }
    );

    await trx.commit();
    logger.info('✅ ');
    logger.info(`Certifications mises à jour: ${info.success}/${csvData.length} (${info.failure})`);
  } catch (error) {
    if (trx) {
      await trx.rollback();
    }
    logger.error(error);
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    process.exit(1);
  }

  logger.info('Done.');
}

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
if (require.main === module) {
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  const dataFilePath = process.argv[2];
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  const sessionIdsFilePath = process.argv[3];
  updateCertificationInfos(dataFilePath, sessionIdsFilePath).then(
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    () => process.exit(0),
    (err) => {
      logger.error(err);
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.exit(1);
    }
  );
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  updateCertificationInfos,
  headers,
};
