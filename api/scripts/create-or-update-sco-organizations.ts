// Usage: BASE_URL=... PIXMASTER_EMAIL=... PIXMASTER_PASSWORD=... node create-or-update-sco-organizations.js path/file.csv
// To use on file with columns |externalId, name|

'use strict';
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config();
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'request'.
const request = require('request-promise-native');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logoUrl'.
const logoUrl = require('./logo/default-sco-organization-logo-base64');
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
      const [externalIdLowerCase, name] = data;

      if (!externalIdLowerCase && !name) {
        // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
        if (require.main === module) process.stdout.write('Found empty line in input file.');
        return null;
      }
      if (!externalIdLowerCase) {
        // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
        if (require.main === module) process.stdout.write(`A line is missing an externalId for name ${name}`);
        return null;
      }
      if (!name) {
        // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
        if (require.main === module)
          // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
          process.stdout.write(`A line is missing a name for external id ${externalIdLowerCase}`);
        return null;
      }
      const externalId = externalIdLowerCase.toUpperCase();

      return { externalId, name: name.trim() };
    })
    .filter((data: $TSFixMe) => !!data);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createOrUp... Remove this comment to see the full error message
async function createOrUpdateOrganizations({
  accessToken,
  organizationsByExternalId,
  checkedData
}: $TSFixMe) {
  for (let i = 0; i < checkedData.length; i++) {
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    if (require.main === module) process.stdout.write(`\n${i + 1}/${checkedData.length} `);

    const { externalId, name } = checkedData[i];
    const organization = organizationsByExternalId[externalId];

    if (organization && (name !== organization.name || !organization['logo-url'])) {
      await request(_buildPatchOrganizationRequestObject(accessToken, { id: organization.id, name, logoUrl }));
    } else if (!organization) {
      await request(
        _buildPostOrganizationRequestObject(accessToken, {
          name,
          externalId,
          provinceCode: externalId.substring(0, 3),
          type: 'SCO',
        })
      );
    }
  }
}

// @ts-expect-error TS(2393): Duplicate function implementation.
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

// @ts-expect-error TS(2393): Duplicate function implementation.
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
          name: organization.name,
          'logo-url': organization.logoUrl,
        },
      },
    },
  };
}

function _buildPostOrganizationRequestObject(accessToken: $TSFixMe, organization: $TSFixMe) {
  return {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    baseUrl,
    url: '/api/organizations',
    json: true,
    body: {
      data: {
        type: 'organizations',
        attributes: {
          name: organization.name,
          type: organization.type,
          'external-id': organization.externalId,
          'province-code': organization.provinceCode,
          'logo-url': logoUrl,
        },
      },
    },
  };
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Starting creating or updating SCO organizations.');

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
    console.log('Creating or updating organizations...');
    await createOrUpdateOrganizations({ accessToken, organizationsByExternalId, checkedData });
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
  createOrUpdateOrganizations,
};
