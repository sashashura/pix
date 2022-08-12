// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../lib/infrastructure/bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../lib/infrastructure/DomainTransaction');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const { MembershipUpdateError, UserCantBeCreatedError, ForbiddenAccess } = require('../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'times'.
const times = require('lodash/times');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'INITIAL_ID... Remove this comment to see the full error message
const INITIAL_ID = 300000;

function _buildMembership(iteration: $TSFixMe) {
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  const organizationId = process.argv[3];
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  const memberRole = process.argv[4];
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  const initialIdStart = parseInt(process.argv[5]) || INITIAL_ID;

  return {
    organizationRole: memberRole,
    organizationId: organizationId,
    userId: initialIdStart + iteration,
    disabledAt: null,
  };
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _buildUser(iteration: $TSFixMe) {
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  const initialIdStart = parseInt(process.argv[5]) || INITIAL_ID;
  return {
    firstName: `firstName${initialIdStart + iteration}`,
    lastName: `lastName${initialIdStart + iteration}`,
    email: `firstname.lastname-${initialIdStart + iteration}@example.net`,
    id: initialIdStart + iteration,
    cgu: true,
    lastPixOrgaTermsOfServiceValidatedAt: null,
    lastPixCertifTermsOfServiceValidatedAt: null,
    mustValidateTermsOfService: false,
    pixOrgaTermsOfServiceAccepted: false,
    pixCertifTermsOfServiceAccepted: false,
    hasSeenAssessmentInstructions: false,
    isAnonymous: true,
  };
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'addManyMem... Remove this comment to see the full error message
async function addManyMembersToExistingOrganization({
  numberOfUsers
}: $TSFixMe) {
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  if (process.env.NODE_ENV === 'production') {
    throw new ForbiddenAccess();
  }

  const manyUsers = times(numberOfUsers, _buildUser);

  try {
    await knex.batchInsert('users', manyUsers).transacting(DomainTransaction.emptyTransaction().knexTransaction);
  } catch (err) {
    throw new UserCantBeCreatedError();
  }

  const manyMemberShips = times(numberOfUsers, _buildMembership);

  try {
    await knex
      .batchInsert('memberships', manyMemberShips)
      .transacting(DomainTransaction.emptyTransaction().knexTransaction);
  } catch (err) {
    throw new MembershipUpdateError();
  }
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  const numberOfUsers = process.argv[2];
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  const organizationId = process.argv[3];
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  const memberRole = process.argv[4];
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  const initialIdStart = parseInt(process.argv[5]) || INITIAL_ID;
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log(
    `Starting adding ${numberOfUsers} users with ${memberRole} role to organization with id ${organizationId}`
  );
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log(`User ids starting at ${initialIdStart}`);

  await addManyMembersToExistingOrganization({ numberOfUsers });

  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('\nDone.');
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
  addManyMembersToExistingOrganization,
};
