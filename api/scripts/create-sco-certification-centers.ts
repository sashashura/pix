// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'parseCsvWi... Remove this comment to see the full error message
const { parseCsvWithHeader } = require('./helpers/csvHelpers');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../lib/infrastructure/bookshelf');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'prepareDat... Remove this comment to see the full error message
function prepareDataForInsert(rawCertificationCenters: $TSFixMe) {
  return rawCertificationCenters.map(({
    name,
    uai
  }: $TSFixMe) => {
    return {
      name: name.trim(),
      externalId: uai,
      type: 'SCO',
    };
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createScoC... Remove this comment to see the full error message
function createScoCertificationCenters(certificationCenters: $TSFixMe) {
  return Bookshelf.knex.batchInsert('certification-centers', certificationCenters);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Starting creating SCO certification centers.');

  try {
    // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
    const filePath = process.argv[2];

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Reading and parsing csv data file... ');
    const csvData = await parseCsvWithHeader(filePath);
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('ok');

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Preparing data and add SCO type... ');
    const certificationCenters = prepareDataForInsert(csvData);
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('ok');

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Creating Certification Centers...');
    await createScoCertificationCenters(certificationCenters);
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('\nDone.');
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
module.exports = {
  prepareDataForInsert,
  createScoCertificationCenters,
};
