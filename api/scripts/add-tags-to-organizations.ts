// Usage: node add-tags-to-organizations.js path/file.csv
// To use on file with columns |organizationId, tagName|

'use strict';
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config();
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationTagRepository = require('../lib/infrastructure/repositories/organization-tag-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tagReposit... Remove this comment to see the full error message
const tagRepository = require('../lib/infrastructure/repositories/tag-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationTag = require('../lib/domain/models/OrganizationTag');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'parseCsv'.
const { parseCsv } = require('./helpers/csvHelpers');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const uniq = require('lodash/uniq');

// @ts-expect-error TS(2393): Duplicate function implementation.
function checkData({
  csvData
}: $TSFixMe) {
  return csvData
    // @ts-expect-error TS(7031): Binding element 'organizationId' implicitly has an... Remove this comment to see the full error message
    .map(([organizationId, tagName]) => {
      if (!organizationId && !tagName) {
        // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
        if (require.main === module) process.stdout.write('Found empty line in input file.');
        return null;
      }
      if (!organizationId) {
        // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
        if (require.main === module) process.stdout.write(`A line is missing an organizationId for tag ${tagName}`);
        return null;
      }
      if (!tagName) {
        // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
        if (require.main === module)
          // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
          process.stdout.write(`A line is missing a tag name for organization id ${organizationId}`);
        return null;
      }
      return { organizationId, tagName };
    })
    .filter((data: $TSFixMe) => !!data);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'retrieveTa... Remove this comment to see the full error message
async function retrieveTagsByName({
  checkedData
}: $TSFixMe) {
  const uniqTagNames = uniq(checkedData.map((data: $TSFixMe) => data.tagName));

  const tagByNames = new Map();
  for (let i = 0; i < uniqTagNames.length; i++) {
    const name = uniqTagNames[i];
    const tag = await tagRepository.findByName({ name });

    if (tag === null) {
      throw new Error(`The tag with name ${name} does not exist.`);
    }
    tagByNames.set(name, tag);
  }
  return tagByNames;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'addTagsToO... Remove this comment to see the full error message
async function addTagsToOrganizations({
  tagsByName,
  checkedData
}: $TSFixMe) {
  for (let i = 0; i < checkedData.length; i++) {
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    if (require.main === module) process.stdout.write(`\n${i + 1}/${checkedData.length} `);

    const { organizationId, tagName } = checkedData[i];
    const tagId = tagsByName.get(tagName).id;

    const isExisting = await organizationTagRepository.isExistingByOrganizationIdAndTagId({ organizationId, tagId });

    if (!isExisting) {
      // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
      if (require.main === module) process.stdout.write(`Adding tag: ${tagName} to organization: ${organizationId} `);

      const organizationTag = new OrganizationTag({ organizationId, tagId });
      await organizationTagRepository.create(organizationTag);

      // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
      if (require.main === module) process.stdout.write('===> ✔');
    } else {
      // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
      if (require.main === module)
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        process.stdout.write(`Tag: ${tagName} already exists for organization: ${organizationId} `);
    }
  }
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Starting script add-tags-to-organizations');

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
    console.log('Retrieving tags by name... ');
    const tagsByName = await retrieveTagsByName({ checkedData });
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('ok');

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Adding tags to organizations…');
    await addTagsToOrganizations({ tagsByName, checkedData });
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
  addTagsToOrganizations,
  retrieveTagsByName,
  checkData,
};
