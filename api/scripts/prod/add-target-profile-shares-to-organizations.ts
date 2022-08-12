// Usage: node add-target-profile-shares-to-organizations.js path/file.csv
// To use on file with columns |externalId, targetProfileId-targetProfileId-targetProfileId|

'use strict';
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config();
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileShareRepository = require('../../lib/infrastructure/repositories/target-profile-share-repository');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'findOrgani... Remove this comment to see the full error message
  findOrganizationsByExternalIds,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizeOr... Remove this comment to see the full error message
  organizeOrganizationsByExternalId,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../helpers/organizations-by-external-id-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'parseCsv'.
const { parseCsv } = require('../helpers/csvHelpers');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkData'... Remove this comment to see the full error message
function checkData({
  csvData
}: $TSFixMe) {
  return csvData
    // @ts-expect-error TS(7031): Binding element 'externalId' implicitly has an 'an... Remove this comment to see the full error message
    .map(([externalId, targetProfileList]) => {
      if (!externalId && !targetProfileList) {
        // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
        if (require.main === module) process.stdout.write('Found empty line in input file.');
        return null;
      }
      if (!externalId) {
        // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
        if (require.main === module)
          // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
          process.stdout.write(`A line is missing an externalId for target profile ${targetProfileList}`);
        return null;
      }
      if (!targetProfileList) {
        // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
        if (require.main === module)
          // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
          process.stdout.write(`A line is missing a targetProfileIdList for external id ${externalId}`);
        return null;
      }
      const targetProfileIdList = targetProfileList.split('-').filter((targetProfile: $TSFixMe) => !!targetProfile.trim());

      return { externalId, targetProfileIdList };
    })
    .filter((data: $TSFixMe) => !!data);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'addTargetP... Remove this comment to see the full error message
async function addTargetProfileSharesToOrganizations({
  organizationsByExternalId,
  checkedData
}: $TSFixMe) {
  for (let i = 0; i < checkedData.length; i++) {
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    if (require.main === module) process.stdout.write(`\n${i + 1}/${checkedData.length} `);

    const { externalId, targetProfileIdList } = checkedData[i];
    const organization = organizationsByExternalId[externalId];

    if (organization && organization.id) {
      // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
      if (require.main === module)
        // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
        process.stdout.write(`Adding targetProfiles: ${targetProfileIdList} to organizationId: ${organization.id} `);
      await targetProfileShareRepository.addTargetProfilesToOrganization({
        organizationId: organization.id,
        targetProfileIdList,
      });
      // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
      if (require.main === module) process.stdout.write('===> ✔');
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    } else if (require.main === module) {
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.stdout.write(`Organization ${externalId} not found`);
    }
  }
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Starting script add-target-profile-shares-to-organizations');

  try {
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    const filePath = process.argv[2];

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Reading and parsing csv data file... ');
    const csvData = await parseCsv(filePath);
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('ok');

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Checking data... ');
    const checkedData = checkData({ csvData });
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('ok');

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Fetching existing organizations... ');
    const organizations = await findOrganizationsByExternalIds({ checkedData });

    const organizationsByExternalId = organizeOrganizationsByExternalId(organizations);
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('ok');

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Adding target profiles shares to organizations…');
    await addTargetProfileSharesToOrganizations({ organizationsByExternalId, checkedData });
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('\nDone.');
  } catch (error) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error(error);

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
  addTargetProfileSharesToOrganizations,
  checkData,
};
