// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'path'.
const path = require('path');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fs'.
const fs = require('fs');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'request'.
const request = require('request-promise-native');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'papa'.
const papa = require('papaparse');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CSV_HEADER... Remove this comment to see the full error message
const CSV_HEADERS = {
  ID: 'ID de certification',
  FIRST_NAME: 'Prenom du candidat',
  LAST_NAME: 'Nom du candidat',
  BIRTHDATE: 'Date de naissance du candidat',
  BIRTHPLACE: 'Lieu de naissance du candidat',
  EXTERNAL_ID: 'Identifiant Externe',
};

function assertFileValidity(err: $TSFixMe, filePath: $TSFixMe) {
  if (err && err.code === 'ENOENT') {
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

function readMyData(data: $TSFixMe, baseUrl: $TSFixMe, accessToken: $TSFixMe) {
  // We delete the BOM UTF8 at the beginning of the CSV,
  // otherwise the first element is wrongly parsed.
  const csvRawData = data.toString('utf8').replace(/^\uFEFF/, '');

  const parsedCSVData = papa.parse(csvRawData, { header: true });

  const certifications = convertCSVDataIntoCertifications(parsedCSVData);
  const options = { baseUrl, accessToken, certifications };

  saveCertifications(options)
    .then((errorObjects) => {
      _logErrorObjects(errorObjects);
    })
    .then(() => {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log('\nFin du script');
    });
}

function convertCSVDataIntoCertifications(csvParsingResult: $TSFixMe) {
  const dataRows = csvParsingResult.data;
  return dataRows.reduce((certifications: $TSFixMe, dataRow: $TSFixMe) => {
    const certification = {
    id: parseInt(dataRow[CSV_HEADERS.ID]),
    firstName: dataRow[(CSV_HEADERS as $TSFixMe).FIRST_NAME],
    lastName: dataRow[(CSV_HEADERS as $TSFixMe).LAST_NAME],
    birthdate: dataRow[(CSV_HEADERS as $TSFixMe).BIRTHDATE],
    birthplace: dataRow[(CSV_HEADERS as $TSFixMe).BIRTHPLACE],
    externalId: dataRow[CSV_HEADERS.EXTERNAL_ID],
};
    certifications.push(certification);
    return certifications;
  }, []);
}

function _buildRequestObject(baseUrl: $TSFixMe, accessToken: $TSFixMe, certification: $TSFixMe) {
  return {
    headers: { authorization: `Bearer ${accessToken}` },
    method: 'PATCH',
    baseUrl,
    url: `/api/certification-courses/${certification.id}`,
    json: true,
    body: {
      data: {
        type: 'certifications',
        id: certification.id,
        attributes: {
          'first-name': certification.firstName,
          'last-name': certification.lastName,
          birthplace: certification.birthplace,
          birthdate: certification.birthdate,
          'external-id': certification.externalId,
        },
      },
    },
  };
}

/**
 * @param options
 * - baseUrl: String
 * - accessToken: String
 * - certifications: Array[Object]
 */
function saveCertifications(options: $TSFixMe) {
  const errorObjects: $TSFixMe = [];

  const promises = options.certifications.map((certification: $TSFixMe) => {
    const requestConfig = _buildRequestObject(options.baseUrl, options.accessToken, certification);
    return request(requestConfig).catch((err: $TSFixMe) => {
      errorObjects.push({
        errorMessage: err.message,
        certification: certification,
      });
    });
  });
  return Promise.all(promises).then(() => {
    return errorObjects;
  });
}

function _logErrorObjects(errorObjects: $TSFixMe) {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Téléversement des certifications sur le serveur : OK');
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log(`\nIl y a eu ${errorObjects.length} erreurs`);
  errorObjects.forEach((errorObject: $TSFixMe) => {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log(`  > id de la certification : ${errorObject.certification.id} - erreur : ${errorObject.errorMessage}`);
  });
}

/**
 * Usage: node import-certifications-from-csv.js http://localhost:3000 jwt.access.token my_file.csv
 */
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
function main() {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log("Début du script d'import");
  try {
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    const baseUrl = process.argv[2];
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    const accessToken = process.argv[3];

    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    const filePath = process.argv[4];

    fs.open(filePath, 'r', (err: $TSFixMe, data: $TSFixMe) => {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log('\nTest de validité du fichier...');
      assertFileValidity(err, filePath);
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log('Test de validité du fichier : OK');

      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log('\nTéléversement des certifications sur le serveur...');
      readMyData(data, baseUrl, accessToken);
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
  convertCSVDataIntoCertifications,
  saveCertifications,
};
