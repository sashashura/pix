const { knex } = require('../../lib/infrastructure/bookshelf');
const DomainTransaction = require('../../lib/infrastructure/DomainTransaction');
const { MembershipUpdateError, UserCantBeCreatedError } = require('../../lib/domain/errors');
const _ = require('lodash');

const INITIAL_ID = 300000;

function _buildMembership(iteration) {
  const organizationId = process.argv[3];
  const memberRole = process.argv[4];
  const initialIdStart = parseInt(process.argv[5]) || INITIAL_ID;

  return {
    organizationRole: memberRole,
    organizationId: organizationId,
    userId: initialIdStart + iteration,
    disabledAt: null,
  };
}

function _buildUser(iteration) {
  const initialIdStart = parseInt(process.argv[5]) || INITIAL_ID;
  return {
    firstName: `firstName${initialIdStart + iteration}`,
    lastName: `lastName${initialIdStart + iteration}`,
    email: `firstName.lastName-${initialIdStart + iteration}@example.net`.toLowerCase(),
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

async function addManyMembersToExistingOrganization(numberOfUsers) {
  const manyUsers = _.times(numberOfUsers, _buildUser);

  try {
    await knex.batchInsert('users', manyUsers).transacting(DomainTransaction.emptyTransaction().knexTransaction);
  } catch (err) {
    console.log(err);
    throw new UserCantBeCreatedError();
  }

  const manyMemberShips = _.times(numberOfUsers, _buildMembership);

  try {
    await knex
      .batchInsert('memberships', manyMemberShips)
      .transacting(DomainTransaction.emptyTransaction().knexTransaction);
  } catch (err) {
    console.log(err);
    throw new MembershipUpdateError();
  }
}

async function main() {
  const numberOfUsers = process.argv[2];
  const organizationId = process.argv[3];
  const memberRole = process.argv[4];
  const initialIdStart = parseInt(process.argv[5]) || INITIAL_ID;
  console.log(
    `Starting adding ${numberOfUsers} users with ${memberRole} role to organization with id ${organizationId}`
  );
  console.log(`User ids starting at ${initialIdStart}`);

  await addManyMembersToExistingOrganization(numberOfUsers);

  console.log('\nDone.');
}

if (require.main === module) {
  main().then(
    () => process.exit(0),
    (err) => {
      console.error(err);
      process.exit(1);
    }
  );
}

module.exports = {
  addManyMembersToExistingOrganization,
};
