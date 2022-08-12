'use strict';
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config();
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'path'.
const path = require('path');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fs'.
const fs = require('fs');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'access'.
const { access } = require('fs').promises;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'request'.
const request = require('request-promise-native');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'papa'.
const papa = require('papaparse');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CSV_HEADER... Remove this comment to see the full error message
const CSV_HEADERS = {
  ID: 'Orga_ID',
  EXTERNAL_ID: 'Code établissement (code UAI)',
};

// @ts-expect-error TS(2393): Duplicate function implementation.
async function assertFileValidity(filePath: $TSFixMe) {
  try {
    await access(filePath, fs.constants.F_OK);
  } catch (err) {
    const errorMessage = `File not found ${filePath}`;
    throw new Error(errorMessage);
  }
  const fileExtension = path.extname(filePath);
  if (fileExtension !== '.csv') {
    const errorMessage = `File extension not supported ${fileExtension}`;
    throw new Error(errorMessage);
  }
  return true;
}

function convertCSVDataIntoOrganizations(csvParsingResult: $TSFixMe) {
  const dataRows = csvParsingResult.data;
  return dataRows.reduce((organizations: $TSFixMe, dataRow: $TSFixMe) => {
    const externalId = dataRow[CSV_HEADERS.EXTERNAL_ID].toUpperCase();
    const organization = {
      id: parseInt(dataRow[CSV_HEADERS.ID]),
      externalId,
      provinceCode: externalId.substring(0, 3),
    };
    organizations.push(organization);
    return organizations;
  }, []);
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _buildRequestObject(accessToken: $TSFixMe, organization: $TSFixMe) {
  return {
    method: 'PATCH',
    headers: { authorization: `Bearer ${accessToken}` },
    // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
    baseUrl: process.env.BASE_URL,
    url: `/api/organizations/${organization.id}`,
    json: true,
    body: {
      data: {
        type: 'organizations',
        id: organization.id,
        attributes: {
          'external-id': organization.externalId,
          'province-code': organization.provinceCode,
        },
      },
    },
  };
}

function _buildTokenRequestObject() {
  return {
    method: 'POST',
    // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
    baseUrl: process.env.BASE_URL,
    url: '/api/token',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    form: {
      grant_type: 'password',
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      username: process.env.PIXMASTER_EMAIL,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      password: process.env.PIXMASTER_PASSWORD,
    },
    json: true,
  };
}

/**
 * @param options
 * - accessToken: String
 * - organizations: Array[Object]
 */
function saveOrganizations(options: $TSFixMe) {
  const errorObjects: $TSFixMe = [];

  const promises = options.organizations.map((organization: $TSFixMe) => {
    const requestConfig = _buildRequestObject(options.accessToken, organization);
    return request(requestConfig).catch((err: $TSFixMe) => {
      errorObjects.push({
        errorMessage: err.message,
        organization,
      });
    });
  });
  return Promise.all(promises).then(() => {
    return errorObjects;
  });
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _logErrorObjects(errorObjects: $TSFixMe) {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Mise à jour des organisations : OK');
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log(`\nIl y a eu ${errorObjects.length} erreurs`);
  errorObjects.forEach((errorObject: $TSFixMe) => {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log(`  > id de l'organization : ${errorObject.organization.id} - erreur : ${errorObject.errorMessage}`);
  });
}

/**
 * Usage: BASE_URL='url' (...) node update-sco-organizations-with-province-code-and-external-id.js my_file.csv
 */
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log("Début du script de mise à jour des Organisations avec l'ID externe et le département");
  try {
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    const filePath = process.argv[2];

    const response = await request(_buildTokenRequestObject());
    const accessToken = response.access_token;

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('\nTest de validité du fichier...');
    assertFileValidity(filePath);
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Test de validité du fichier : OK');

    fs.readFile(filePath, 'utf8', async function (err: $TSFixMe, data: $TSFixMe) {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log('\nMise à jour des organizations...');

      // We delete the BOM UTF8 at the beginning of the CSV,
      // otherwise the first element is wrongly parsed.
      const csvRawData = data.toString('utf8').replace(/^\uFEFF/, '');

      const parsedCSVData = papa.parse(csvRawData, { header: true });

      const organizations = convertCSVDataIntoOrganizations(parsedCSVData);
      const options = { accessToken, organizations };

      const errorObjects = await saveOrganizations(options);
      _logErrorObjects(errorObjects);

      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log('\nFin du script');
    });
  } catch (err) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error((err as $TSFixMe).message);
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    process.exit(1);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
if (require.main === module) {
  main();
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  assertFileValidity,
  convertCSVDataIntoOrganizations,
  saveOrganizations,
};
