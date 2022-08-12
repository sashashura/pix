#!/usr/bin/env node
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config();
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../lib/infrastructure/logger');
// Usage: node scripts/import-certification-cpf-cities path/file.csv
// File downloaded from https://www.data.gouv.fr/fr/datasets/base-officielle-des-codes-postaux/

('use strict');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'parseCsv'.
const { parseCsv, checkCsvHeader } = require('../helpers/csvHelpers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../lib/infrastructure/bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'uniqBy'.
const uniqBy = require('lodash/uniqBy');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'values'.
const values = require('lodash/values');

const specificCities = [
  {
    name: 'PARIS',
    postalCode: 75000,
    INSEECode: 75056,
    isActualName: true,
  },
  {
    name: 'LYON',
    postalCode: 69000,
    INSEECode: 69123,
    isActualName: true,
  },
  {
    name: 'MARSEILLE',
    postalCode: 13000,
    INSEECode: 13055,
    isActualName: true,
  },
];

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'headers'.
const headers = {
  cityName: 'nom_de_la_commune',
  postalCode: 'code_postal',
  inseeCode: 'code_commune_insee',
  cityAlternateName: 'ligne_5',
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCitie... Remove this comment to see the full error message
function buildCities({
  csvData
}: $TSFixMe) {
  const citiesWithAlternates = csvData.flatMap((data: $TSFixMe) => {
    const result = [];
    result.push({
      name: data[headers.cityName],
      postalCode: data[headers.postalCode],
      INSEECode: data[headers.inseeCode],
      isActualName: true,
    });

    if (data[headers.cityAlternateName]) {
      result.push({
        name: data[headers.cityAlternateName],
        postalCode: data[headers.postalCode],
        INSEECode: data[headers.inseeCode],
        isActualName: false,
      });
    }
    return result;
  });

  return uniqBy(citiesWithAlternates, (city: $TSFixMe) => `${city.INSEECode}${city.postalCode}${city.name}`);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main(filePath: $TSFixMe) {
  logger.info('Starting script import-certification-cpf-cities');

  let trx;
  try {
    logger.info(`Checking ${filePath} data file...`);
    await checkCsvHeader({ filePath, requiredFieldNames: values(headers) });
    logger.info('✅ ');

    logger.info('Reading and parsing csv data file... ');
    const csvData = await parseCsv(filePath, { header: true, delimiter: ';', skipEmptyLines: true });
    logger.info('✅ ');

    logger.info('Retrieving postal code, INSEE code and city name... ');
    const cities = buildCities({ csvData }).concat(specificCities);
    logger.info('✅ ');

    logger.info('Inserting cities in database... ');
    trx = await knex.transaction();
    await trx('certification-cpf-cities').del();
    const batchInfo = await trx.batchInsert('certification-cpf-cities', cities);
    const insertedLines = _getInsertedLineNumber(batchInfo);
    logger.info('✅ ');
    trx.commit();
    logger.info(`Added lines: ${insertedLines} (${specificCities.length} exception cases)`);
    logger.info('Done.');
  } catch (error) {
    if (trx) {
      trx.rollback();
    }
    logger.error(error);
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    process.exit(1);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
if (require.main === module) {
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  const filePath = process.argv[2];
  main(filePath).then(
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    () => process.exit(0),
    (err) => {
      logger.error(err);
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.exit(1);
    }
  );
}

function _getInsertedLineNumber(batchInfo: $TSFixMe) {
  return batchInfo.map(({
    rowCount
  }: $TSFixMe) => rowCount).reduce((acc: $TSFixMe, count: $TSFixMe) => acc + count, 0);
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  buildCities,
};
