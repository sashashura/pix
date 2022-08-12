// Usage: BASE_URL=... PIXMASTER_EMAIL=... PIXMASTER_PASSWORD=... node update-sco-organizations-with-is-managing-students-to-true.js path/file.csv
// To use on file with columns |externalId|

'use strict';
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config();
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'request'.
const request = require('request-promise-native');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'findOrgani... Remove this comment to see the full error message
  findOrganizationsByExternalIds,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizeOr... Remove this comment to see the full error message
  organizeOrganizationsByExternalId,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('./helpers/organizations-by-external-id-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'parseCsv'.
const { parseCsv } = require('./helpers/csvHelpers');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'baseUrl'.
const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkData'... Remove this comment to see the full error message
function checkData({
  csvData
}: $TSFixMe) {
  return csvData
    .map((data: $TSFixMe) => {
      const [externalIdLowerCase] = data;

      if (!externalIdLowerCase) {
        // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
        if (require.main === module) process.stdout.write('Found empty line in input file.');
        return null;
      }
      const externalId = externalIdLowerCase.toUpperCase();

      return { externalId };
    })
    .filter((data: $TSFixMe) => !!data);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'updateOrga... Remove this comment to see the full error message
async function updateOrganizations({
  accessToken,
  organizationsByExternalId,
  checkedData
}: $TSFixMe) {
  for (let i = 0; i < checkedData.length; i++) {
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    if (require.main === module) process.stdout.write(`\n${i + 1}/${checkedData.length} `);

    const { externalId } = checkedData[i];
    const organization = organizationsByExternalId[externalId];

    if (organization) {
      await request(_buildPatchOrganizationRequestObject(accessToken, { id: organization.id }));
    }
  }
}

function _buildAccessTokenRequestObject() {
  return {
    method: 'POST',
    baseUrl,
    url: '/api/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
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

function _buildPatchOrganizationRequestObject(accessToken: $TSFixMe, organization: $TSFixMe) {
  return {
    method: 'PATCH',
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    baseUrl,
    url: `/api/organizations/${organization.id}`,
    json: true,
    body: {
      data: {
        type: 'organizations',
        id: organization.id,
        attributes: {
          'is-managing-students': true,
        },
      },
    },
  };
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Starting setting is-managing-students to true.');

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
    console.log('Requesting API access token... ');
    const { access_token: accessToken } = await request(_buildAccessTokenRequestObject());
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('ok');

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Fetching existing organizations... ');
    const organizations = await findOrganizationsByExternalIds({ checkedData });
    const organizationsByExternalId = organizeOrganizationsByExternalId(organizations);
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('ok');

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Updating organizations...');
    await updateOrganizations({ accessToken, organizationsByExternalId, checkedData });
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
  checkData,
  updateOrganizations,
};
