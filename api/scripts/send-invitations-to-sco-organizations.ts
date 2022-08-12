// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'parseCsvWi... Remove this comment to see the full error message
const { parseCsvWithHeader } = require('../scripts/helpers/csvHelpers');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../lib/infrastructure/utils/bookshelf-to-domain-converter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfO... Remove this comment to see the full error message
const BookshelfOrganization = require('../lib/infrastructure/orm-models/Organization');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationInvitationService = require('../lib/domain/services/organization-invitation-service');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationRepository = require('../lib/infrastructure/repositories/organization-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationInvitationRepository = require('../lib/infrastructure/repositories/organization-invitation-repository');

const TAGS = ['JOIN_ORGA'];

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getOrganiz... Remove this comment to see the full error message
async function getOrganizationByExternalId(externalId: $TSFixMe) {
  return BookshelfOrganization.where({ externalId })
    .fetch()
    .then((organization: $TSFixMe) => bookshelfToDomainConverter.buildDomainObject(BookshelfOrganization, organization))
    .catch((err: $TSFixMe) => {
      if (err instanceof BookshelfOrganization.NotFoundError) {
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
        throw new NotFoundError(`Organization not found for External ID ${externalId}`);
      }
      throw err;
    });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildInvit... Remove this comment to see the full error message
async function buildInvitation({
  externalId,
  email
}: $TSFixMe) {
  const { id: organizationId } = await getOrganizationByExternalId(externalId);
  return { organizationId, email };
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'prepareDat... Remove this comment to see the full error message
async function prepareDataForSending(objectsFromFile: $TSFixMe) {
  return bluebird.mapSeries(objectsFromFile, ({
    uai,
    email
  }: $TSFixMe) => {
    return buildInvitation({ externalId: uai, email });
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sendJoinOr... Remove this comment to see the full error message
async function sendJoinOrganizationInvitations(invitations: $TSFixMe, tags: $TSFixMe) {
  return bluebird.mapSeries(invitations, ({
    organizationId,
    email
  }: $TSFixMe, index: $TSFixMe) => {
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    if (require.main === module) {
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.stdout.write(`${index}/${invitations.length}\r`);
    }

    return organizationInvitationService.createOrganizationInvitation({
      organizationRepository,
      organizationInvitationRepository,
      organizationId,
      email,
      tags,
    });
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Start sending "join SCO organization" invitations to users.');

  try {
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    const filePath = process.argv[2];
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    const argTags = process.argv[3];
    const tags = argTags ? [argTags] : TAGS;

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Reading and parsing csv file... ');
    const csvData = await parseCsvWithHeader(filePath);
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log(`Succesfully read ${csvData.length} records.`);

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Preparing data before sending... ');
    const invitations = await prepareDataForSending(csvData);
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('ok');

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Sending invitations...');
    await sendJoinOrganizationInvitations(invitations, tags);
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
  getOrganizationByExternalId,
  buildInvitation,
  prepareDataForSending,
  sendJoinOrganizationInvitations,
};
