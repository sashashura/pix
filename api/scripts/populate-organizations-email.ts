// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'parseCsvWi... Remove this comment to see the full error message
const { parseCsvWithHeader } = require('../scripts/helpers/csvHelpers');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfO... Remove this comment to see the full error message
const BookshelfOrganization = require('../lib/infrastructure/orm-models/Organization');

async function updateOrganizationEmailByExternalId(externalId: $TSFixMe, email: $TSFixMe) {
  return BookshelfOrganization.where({ externalId })
    .save({ email }, { patch: true })
    .catch((err: $TSFixMe) => {
      if (err instanceof BookshelfOrganization.NoRowsUpdatedError) {
        // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
        console.error(`Organization not found for External ID ${externalId}`);
        return;
      }
      throw err;
    });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'populateOr... Remove this comment to see the full error message
async function populateOrganizations(objectsFromFile: $TSFixMe) {
  return bluebird.mapSeries(objectsFromFile, ({
    uai,
    email
  }: $TSFixMe) => {
    return updateOrganizationEmailByExternalId(uai, email);
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log("Start populating organization's email");

  try {
    // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
    const filePath = process.argv[2];

    if (!filePath) {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log('Usage: populate-organizations-email.js <FILE_NAME>.csv');
      // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
      process.exit(1);
    }

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Reading and parsing csv file (checking headers)... ');
    const csvData = await parseCsvWithHeader(filePath);
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log(`Successfully read ${csvData.length} records.`);

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Populating organizations (existing emails will be updated)... ');
    await populateOrganizations(csvData);
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('\nOrganization successfully populated.');
  } catch (error) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error('\n', error);
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
module.exports = populateOrganizations;
