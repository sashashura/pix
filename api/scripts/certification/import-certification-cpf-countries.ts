#!/usr/bin/env node

// Usage: node import-certification-cpf-countries.js path/file.csv
// File Millésime 2021 : Liste des pays et territoires étrangers au 01/01/2021
// downloaded from https://www.data.gouv.fr/fr/datasets/code-officiel-geographique-cog/

'use strict';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'parseCsv'.
const { parseCsv } = require('../helpers/csvHelpers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../lib/infrastructure/bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'normalizeA... Remove this comment to see the full error message
const { normalizeAndSortChars } = require('../../lib/infrastructure/utils/string-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

const CURRENT_NAME_COLUMN = 'LIBCOG';
const ALTERNATIVE_NAME_COLUMN = 'LIBENR';
const INSEE_CODE_COLUMN = 'COG';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TYPE_COLUM... Remove this comment to see the full error message
const TYPE_COLUMN = 'ACTUAL';

// Dans le fichier, le code INSEE de la France est de ses territoires est XXXXX.
// Nous remplaçons cette valeur par le véritable code de la France: 99100
const FRENCH_CODE_IN_FILE = 'XXXXX';

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TYPES'.
const TYPES = {
  actuel: '1',
  perime: '2',
  territoire_sans_code_officiel_geographique: '3',
  territoire_ayant_code_officiel_geographique: '4',
};

function _filterOutDeprecatedAndNonCOG(data: $TSFixMe) {
  return (
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    data[TYPE_COLUMN] === TYPES['actuel'] || data[TYPE_COLUMN] === TYPES['territoire_ayant_code_officiel_geographique']
  );
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCount... Remove this comment to see the full error message
function buildCountries({
  csvData
}: $TSFixMe) {
  return csvData
    .filter((data: $TSFixMe) => _filterOutDeprecatedAndNonCOG(data))
    .flatMap((data: $TSFixMe) => {
      const result = [];
      let code = data[INSEE_CODE_COLUMN];
      if (code === FRENCH_CODE_IN_FILE) {
        code = '99100';
      }
      result.push({
        code,
        commonName: data[CURRENT_NAME_COLUMN],
        originalName: data[CURRENT_NAME_COLUMN],
        matcher: normalizeAndSortChars(data[CURRENT_NAME_COLUMN]),
      });
      if (data[ALTERNATIVE_NAME_COLUMN] && data[ALTERNATIVE_NAME_COLUMN] !== data[CURRENT_NAME_COLUMN]) {
        result.push({
          code,
          commonName: data[CURRENT_NAME_COLUMN],
          originalName: data[ALTERNATIVE_NAME_COLUMN],
          matcher: normalizeAndSortChars(data[ALTERNATIVE_NAME_COLUMN]),
        });
      }
      return result;
    });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkTrans... Remove this comment to see the full error message
function checkTransformUnicity(countries: $TSFixMe) {
  const grouped = _.groupBy(countries, 'matcher');
  let hasError = false;
  for (const code in grouped) {
    const group = grouped[code];
    const uniq = _.uniq(_.map(group, 'code'));
    if (uniq.length > 1) {
      const conflictNames = group.map((country: $TSFixMe) => country.originalName);
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.error(`CONFLICT: ${uniq.join()} ${conflictNames.join()}`);
      hasError = true;
    }
  }

  if (hasError) throw new Error('There are more than 1 transformed name with distinct code');
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main(filePath: $TSFixMe) {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Starting script import-certification-cpf-countries');
  const trx = await knex.transaction();

  try {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Reading and parsing csv data file... ');
    const csvData = await parseCsv(filePath, { header: true, delimiter: ',', skipEmptyLines: true });
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('ok');

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Retrieving countries name and code... ');
    const countries = buildCountries({ csvData });
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('ok');

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Verify data integrity... ');
    checkTransformUnicity(countries);

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Emptying existing countries in database... ');
    await trx('certification-cpf-countries').del();
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Inserting countries in database... ');
    await trx.batchInsert('certification-cpf-countries', countries);
    trx.commit();
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('ok');

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('\nDone.');
  } catch (error) {
    if (trx) {
      trx.rollback();
    }
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error(error);
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
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.error(err);
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.exit(1);
    }
  );
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  buildCountries,
  checkTransformUnicity,
};
