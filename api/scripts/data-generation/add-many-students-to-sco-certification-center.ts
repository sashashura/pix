// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SCO_MIDDLE... Remove this comment to see the full error message
const { SCO_MIDDLE_SCHOOL_ID } = require('../../db/seeds/data/organizations-sco-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationLearner = require('../../lib/domain/models/OrganizationLearner');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const { OrganizationLearnersCouldNotBeSavedError } = require('../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../lib/infrastructure/bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../lib/infrastructure/DomainTransaction');

function _buildOrganizationLearner(iteration: $TSFixMe) {
  const birthdates = ['2001-01-05', '2002-11-15', '1995-06-25'];
  const divisions = ['5eme', '4eme', '3eme'];
  return new OrganizationLearner({
    firstName: `someFirstName${iteration}`,
    lastName: `someLastName${iteration}`,
    birthdate: birthdates[_.random(0, 2)],
    division: divisions[_.random(0, 2)],
    organizationId: SCO_MIDDLE_SCHOOL_ID,
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'addManyStu... Remove this comment to see the full error message
async function addManyStudentsToScoCertificationCenter(numberOfStudents: $TSFixMe) {
  const manyStudents = _.times(numberOfStudents, _buildOrganizationLearner);
  try {
    await knex
      .batchInsert('organization-learners', manyStudents)
      .transacting(DomainTransaction.emptyTransaction().knexTransaction);
  } catch (err) {
    throw new OrganizationLearnersCouldNotBeSavedError();
  }
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Starting adding SCO students to certification center.');

  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  const numberOfStudents = process.argv[2];

  await addManyStudentsToScoCertificationCenter(numberOfStudents);

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
  addManyStudentsToScoCertificationCenter,
};
