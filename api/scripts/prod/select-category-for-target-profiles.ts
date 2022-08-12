#! /usr/bin/env node
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config();
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'groupBy'.
const groupBy = require('lodash/groupBy');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const sum = require('lodash/sum');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'has'.
const has = require('lodash/has');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const partition = require('lodash/partition');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const negate = require('lodash/negate');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'readCsvFil... Remove this comment to see the full error message
const { readCsvFile, parseCsvData } = require('../helpers/csvHelpers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'categories... Remove this comment to see the full error message
const { categories } = require('../../lib/domain/models/TargetProfile');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../db/knex-database-connection');

const TARGET_PROFILE_ID_COLUMN = 'targetProfileId';
const CATEGORY_COLUMN = 'category';

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Starting script select-category-for-target-profiles');

  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Reading csv file... ');
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  const filePath = process.argv[2];
  const csvData = await readCsvFile(filePath);
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('✅ ok');

  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Setting categories on target profiles...');
  const { totalUpdatedRows, invalidCategories, invalidTargetProfiles } = await setCategoriesToTargetProfiles(csvData);
  if (invalidCategories.length > 0) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log(`⚠️ Les catégories "${invalidCategories.join('", "')}" ne sont pas supportées`);
  }
  if (invalidTargetProfiles.length > 0) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log(`⚠️ Les ids de profils cibles "${invalidTargetProfiles.join('", "')}" ne sont pas valides`);
  }
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log(`✅ ${totalUpdatedRows} target profiles were updated.`);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'setCategor... Remove this comment to see the full error message
async function setCategoriesToTargetProfiles(csvData: $TSFixMe) {
  const parsedCsvData = await parseCsvData(csvData, {
    header: true,
    delimiter: ',',
    skipEmptyLines: true,
  });

  const firstRow = parsedCsvData[0];
  if (!has(firstRow, CATEGORY_COLUMN) || !has(firstRow, TARGET_PROFILE_ID_COLUMN)) {
    throw new Error(`Les colonnes "${CATEGORY_COLUMN}" et "${TARGET_PROFILE_ID_COLUMN}" sont obligatoires`);
  }

  const targetProfilesGroupedByCategory = groupBy(parsedCsvData, CATEGORY_COLUMN);
  const parsedCategories = Object.keys(targetProfilesGroupedByCategory);

  const invalidCategories = parsedCategories.filter(negate(_isSupportedCategory));
  const validCategories = parsedCategories.filter(_isSupportedCategory);
  let invalidTargetProfiles: $TSFixMe = [];

  const result = await bluebird.mapSeries(validCategories, function (category: $TSFixMe) {
    const targetProfiles = targetProfilesGroupedByCategory[category].map((row: $TSFixMe) => row[TARGET_PROFILE_ID_COLUMN]);
    const [validTargetProfilesIds, invalidTargetProfilesIds] = partition(targetProfiles, (targetProfileId: $TSFixMe) => Number.isInteger(parseInt(targetProfileId))
    );
    invalidTargetProfiles = [...invalidTargetProfiles, ...invalidTargetProfilesIds];

    return setCategoryToTargetProfiles(category, validTargetProfilesIds);
  });

  return { totalUpdatedRows: sum(result), invalidCategories, invalidTargetProfiles };
}

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
if (require.main === module) {
  main()
    .then(function () {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log('🎉 Everything went fine !');
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.exit(0);
    })
    .catch(function (error) {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.error('❌ Something went wrong...');
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.error(error);
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.exit(1);
    });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'setCategor... Remove this comment to see the full error message
async function setCategoryToTargetProfiles(category: $TSFixMe, targetProfileIds: $TSFixMe) {
  return knex('target-profiles').whereIn('id', targetProfileIds).update({
    category,
  });
}

function _isSupportedCategory(category: $TSFixMe) {
  const supportedCategories = Object.values(categories);
  return supportedCategories.includes(category);
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  setCategoriesToTargetProfiles,
  setCategoryToTargetProfiles,
};
