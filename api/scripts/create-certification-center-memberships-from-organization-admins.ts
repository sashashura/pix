'use strict';

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'parseCsvWi... Remove this comment to see the full error message
const { parseCsvWithHeader } = require('./helpers/csvHelpers');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../lib/domain/models/Membership');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../lib/infrastructure/bookshelf');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getCertifi... Remove this comment to see the full error message
async function getCertificationCenterIdWithMembershipsUserIdByExternalId(externalId: $TSFixMe) {
  const certificationCenterIdWithMemberships = await knex('certification-centers')
    .select('certification-centers.id', 'certification-center-memberships.userId')
    .leftJoin(
      'certification-center-memberships',
      'certification-centers.id',
      'certification-center-memberships.certificationCenterId'
    )
    .where('certification-centers.externalId', '=', externalId);

  return {
    id: certificationCenterIdWithMemberships[0].id,
    certificationCenterMemberships: _(certificationCenterIdWithMemberships)
      .map((certificationCenterMembership: $TSFixMe) => certificationCenterMembership.userId)
      .compact()
      .value(),
  };
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getAdminMe... Remove this comment to see the full error message
async function getAdminMembershipsUserIdByOrganizationExternalId(externalId: $TSFixMe) {
  const adminMemberships = await knex('memberships')
    .select('memberships.userId')
    .innerJoin('organizations', 'memberships.organizationId', 'organizations.id')
    .innerJoin('users', 'users.id', 'memberships.userId')
    .where('organizationRole', Membership.roles.ADMIN)
    .whereNull('memberships.disabledAt')
    .where('organizations.externalId', '=', externalId)
    .where('users.firstName', '!~', 'prenom_.*\\d')
    .where('users.lastName', '!~', 'nom_.*\\d');

  return adminMemberships.map((adminMembership: $TSFixMe) => adminMembership.userId);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCerti... Remove this comment to see the full error message
function buildCertificationCenterMemberships({
  certificationCenterId,
  membershipUserIds
}: $TSFixMe) {
  return membershipUserIds.map((userId: $TSFixMe) => {
    return { certificationCenterId, userId };
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fetchCerti... Remove this comment to see the full error message
async function fetchCertificationCenterMembershipsByExternalId(externalId: $TSFixMe) {
  const certificationCenter = await getCertificationCenterIdWithMembershipsUserIdByExternalId(externalId);
  const membershipUserIds = await getAdminMembershipsUserIdByOrganizationExternalId(externalId);
  const missingMemberships = _.filter(membershipUserIds, (userId: $TSFixMe) => {
    return !certificationCenter.certificationCenterMemberships.includes(userId);
  });
  return buildCertificationCenterMemberships({
    certificationCenterId: certificationCenter.id,
    membershipUserIds: missingMemberships,
  });
}

// @ts-expect-error TS(2393): Duplicate function implementation.
async function prepareDataForInsert(rawExternalIds: $TSFixMe) {
  const externalIds = _.uniq(_.map(rawExternalIds, 'externalId'));
  const certificationCenterMembershipsLists = await bluebird.mapSeries(
    externalIds,
    fetchCertificationCenterMembershipsByExternalId
  );
  return certificationCenterMembershipsLists.flat();
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createCert... Remove this comment to see the full error message
async function createCertificationCenterMemberships(certificationCenterMemberships: $TSFixMe) {
  return knex.batchInsert('certification-center-memberships', certificationCenterMemberships);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Starting creating Certification Center memberships with a list of ExternalIds.');

  try {
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    const filePath = process.argv[2];

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Reading and parsing csv data file... ');
    const csvData = await parseCsvWithHeader(filePath);
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('ok');

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Data preparation before insertion into the database...');
    const certificationCenterMemberships = await prepareDataForInsert(csvData);
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('ok');

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Creating Certification Center Memberships into database...');
    await createCertificationCenterMemberships(certificationCenterMemberships);
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
  getCertificationCenterIdWithMembershipsUserIdByExternalId,
  getAdminMembershipsUserIdByOrganizationExternalId,
  buildCertificationCenterMemberships,
  fetchCertificationCenterMembershipsByExternalId,
  prepareDataForInsert,
  createCertificationCenterMemberships,
};
