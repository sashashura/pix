// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'randomStri... Remove this comment to see the full error message
const randomString = require('randomstring');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationLearner = require('../../lib/domain/models/OrganizationLearner');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const { OrganizationLearnersCouldNotBeSavedError } = require('../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../lib/infrastructure/bookshelf');

// @ts-expect-error TS(2393): Duplicate function implementation.
function _buildOrganizationLearner(division: $TSFixMe, organizationId: $TSFixMe, iteration: $TSFixMe) {
  const birthdates = ['2001-01-05', '2002-11-15', '1995-06-25'];
  return new OrganizationLearner({
    firstName: `someFirstName${iteration}`,
    lastName: `someLastName${iteration}`,
    birthdate: birthdates[_.random(0, 2)],
    division,
    organizationId,
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'addManyDiv... Remove this comment to see the full error message
async function addManyDivisionsAndStudentsToScoCertificationCenter(numberOfDivisions: $TSFixMe, organizationId: $TSFixMe) {
  const divisions = [];
  for (let i = 0; i < numberOfDivisions; ++i) {
    const letters = randomString.generate({
      length: 2,
      charset: 'alphabetic',
      capitalization: 'uppercase',
      readable: true,
    });
    const numbers = randomString.generate({ length: 1, charset: 'numeric', readable: true });

    const generatedDivision = letters.concat(numbers);
    if (_.find(divisions, (division: $TSFixMe) => division === generatedDivision)) {
      --i;
    } else {
      divisions.push(generatedDivision);
    }
  }
  const numberOfStudentsPerDivision = 30;

  const manyStudents = _.flatMap(divisions, (division: $TSFixMe) => {
    return _.times(numberOfStudentsPerDivision, (iteration: $TSFixMe) => _buildOrganizationLearner(division, organizationId, iteration)
    );
  });

  try {
    await knex.batchInsert('organization-learners', manyStudents);
  } catch (err) {
    throw new OrganizationLearnersCouldNotBeSavedError();
  }
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Starting adding SCO students to certification center.');

  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  const numberOfDivisions = process.argv[2];
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  const organizationId = process.argv[3];

  await addManyDivisionsAndStudentsToScoCertificationCenter(numberOfDivisions, organizationId);

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
  addManyDivisionsAndStudentsToScoCertificationCenter,
};
