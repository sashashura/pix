// Usage: scalingo scalingo --region osc-secnum-fr1 -a pix-api-production run --file file.csv node scripts/create-or-update-sco-agri-organizations.js /tmp/uploads/file.csv
// To use on file with columns |externalId, name, email| (email is optional)

'use strict';
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config();

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logoUrl'.
const logoUrl = require('./logo/default-sco-agri-organization-logo-base64');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'findOrgani... Remove this comment to see the full error message
  findOrganizationsByExternalIds,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizeOr... Remove this comment to see the full error message
  organizeOrganizationsByExternalId,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('./helpers/organizations-by-external-id-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'parseCsv'.
const { parseCsv } = require('./helpers/csvHelpers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../lib/domain/models/Organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tag'.
const Tag = require('../lib/domain/models/Tag');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationTag = require('../lib/domain/models/OrganizationTag');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationRepository = require('../lib/infrastructure/repositories/organization-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tagReposit... Remove this comment to see the full error message
const tagRepository = require('../lib/infrastructure/repositories/tag-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationTagRepository = require('../lib/infrastructure/repositories/organization-tag-repository');

const TAG_NAME = 'AGRICULTURE';

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkData'... Remove this comment to see the full error message
function checkData({
  csvData
}: $TSFixMe) {
  return csvData
    .map((data: $TSFixMe) => {
      const [externalIdLowerCase, name, email] = data;

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

      const checkedData = {
        externalId: externalIdLowerCase.toUpperCase(),
        name: name.trim(),
      };

      if (email) {
        (checkedData as $TSFixMe).email = email.trim();
      }

      return checkedData;
    })
    .filter((data: $TSFixMe) => !!data);
}

// @ts-expect-error TS(2393): Duplicate function implementation.
async function createOrUpdateOrganizations({
  organizationsByExternalId,
  checkedData
}: $TSFixMe) {
  const createdOrUpdatedOrganizations = [];
  for (let i = 0; i < checkedData.length; i++) {
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    if (require.main === module) process.stdout.write(`\n${i + 1}/${checkedData.length} `);

    const { externalId, name, email } = checkedData[i];
    let organization = organizationsByExternalId[externalId];

    if (organization) {
      organization.name = name;
      organization.email = email;
      organization.isManagingStudents = true;
      organization.logoUrl = logoUrl;
      createdOrUpdatedOrganizations.push(await organizationRepository.update(organization));
    } else {
      organization = new Organization({
        name,
        externalId,
        email,
        provinceCode: externalId.substring(0, 3),
        type: 'SCO',
        isManagingStudents: true,
        logoUrl,
      });
      createdOrUpdatedOrganizations.push(await organizationRepository.create(organization));
    }
  }
  return createdOrUpdatedOrganizations;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'addTag'.
async function addTag(organizations: $TSFixMe) {
  let tag = await tagRepository.findByName({ name: TAG_NAME });

  if (!tag) {
    tag = await tagRepository.create(new Tag({ name: TAG_NAME }));
  }

  for (let i = 0; i < organizations.length; i++) {
    const organizationId = organizations[i].id;
    const isExisting = await organizationTagRepository.isExistingByOrganizationIdAndTagId({
      organizationId,
      tagId: tag.id,
    });

    if (!isExisting) {
      await organizationTagRepository.create(new OrganizationTag({ organizationId, tagId: tag.id }));
    }
  }
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Starting creating or updating SCO AGRICULTURE organizations.');

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
    console.log('Creating or updating organizations...');
    const createOrUpdatedOrganizations = await createOrUpdateOrganizations({ organizationsByExternalId, checkedData });
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('ok');

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Adding AGRICULTURE tag...');
    await addTag(createOrUpdatedOrganizations);
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
  addTag,
  checkData,
  createOrUpdateOrganizations,
};
