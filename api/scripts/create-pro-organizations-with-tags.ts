// Usage: node create-pro-organizations-with-tags.js path/file.csv
// To use on file with columns |externalId, name, provinceCode, credit, email, organizationInvitationRole, locale, tags, createdBy|

'use strict';
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config();

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkCsvHe... Remove this comment to see the full error message
const { checkCsvHeader, parseCsv, optionsWithHeader } = require('./helpers/csvHelpers');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createProO... Remove this comment to see the full error message
const createProOrganizationsWithTags = require('../lib/domain/usecases/create-pro-organizations-with-tags');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainTran... Remove this comment to see the full error message
const domainTransaction = require('../lib/infrastructure/DomainTransaction');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationInvitationRepository = require('../lib/infrastructure/repositories/organization-invitation-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationRepository = require('../lib/infrastructure/repositories/organization-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationTagRepository = require('../lib/infrastructure/repositories/organization-tag-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tagReposit... Remove this comment to see the full error message
const tagRepository = require('../lib/infrastructure/repositories/tag-repository');

const REQUIRED_FIELD_NAMES = [
  'externalId',
  'name',
  'provinceCode',
  'credit',
  'email',
  'organizationInvitationRole',
  'locale',
  'tags',
  'createdBy',
  'documentationUrl',
];

function cleanEmailPropertyFromOrganizations(organizationsToClean: $TSFixMe) {
  return organizationsToClean.map(({
    email,
    ...organization
  }: $TSFixMe) => ({
    ...organization,
    email: email?.trim().replaceAll(' ', '').toLowerCase(),
  }));
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createOrga... Remove this comment to see the full error message
async function createOrganizationWithTags(filePath: $TSFixMe) {
  await checkCsvHeader({
    filePath,
    requiredFieldNames: REQUIRED_FIELD_NAMES,
  });

  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Reading and parsing csv data file... ');
  const options = { ...optionsWithHeader };

  const organizationsToClean = await parseCsv(filePath, options);
  const organizations = cleanEmailPropertyFromOrganizations(organizationsToClean);

  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Creating PRO organizations...');
  const createdOrganizations = await createProOrganizationsWithTags({
    organizations,
    domainTransaction,
    organizationRepository,
    tagRepository,
    organizationTagRepository,
    organizationInvitationRepository,
  });
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('\nDone.');

  createdOrganizations.forEach((createdOrganization: $TSFixMe) => {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log(`${createdOrganization.id},${createdOrganization.name}`);
  });

  return 'Organizations created with success !';
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Starting creating PRO organizations.');
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  const filePath = process.argv[2];

  try {
    await createOrganizationWithTags(filePath);
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
  createOrganizationWithTags,
};
