// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SCO_MIDDLE... Remove this comment to see the full error message
const { SCO_MIDDLE_SCHOOL_ID } = require('../../../db/seeds/data/organizations-sco-builder');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../lib/infrastructure/bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfO... Remove this comment to see the full error message
const BookshelfOrganizationLearner = require('../../../lib/infrastructure/orm-models/OrganizationLearner');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const { databaseBuilder } = require('../../test-helper');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'addManyDiv... Remove this comment to see the full error message
  addManyDivisionsAndStudentsToScoCertificationCenter,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../scripts/data-generation/add-many-divisions-and-students-to-sco-organization');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Scripts | add-many-divisions-and-students-to-sco-organization', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#addManyDivisionsAndStudentsToScoCertificationCenter', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('organization-learners').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should insert many divisions and organization learners', async function () {
      // given
      const numberOfDivisionsToCreate = 4;
      const numberOfStudentsPerDivision = 30;
      const numberOfOrganizationLearnerToCreate = numberOfDivisionsToCreate * numberOfStudentsPerDivision;

      databaseBuilder.factory.buildOrganization({
        id: SCO_MIDDLE_SCHOOL_ID,
        type: 'SCO',
        name: 'Collège The Night Watch',
        isManagingStudents: true,
        email: 'sco.generic.account@example.net',
        externalId: 123,
        provinceCode: '12',
      });

      await databaseBuilder.commit();

      // when
      await addManyDivisionsAndStudentsToScoCertificationCenter(numberOfDivisionsToCreate, SCO_MIDDLE_SCHOOL_ID);
      const numberOfCreatedOrganizationLearners = await _getNumberOfOrganizationLearners();
      const createdDivisions = await _getDistinctDivisions();

      // then
      expect(numberOfCreatedOrganizationLearners).to.equal(numberOfOrganizationLearnerToCreate);
      expect(createdDivisions.length).to.equal(numberOfDivisionsToCreate);
    });
  });
});

// @ts-expect-error TS(2393): Duplicate function implementation.
function _getNumberOfOrganizationLearners() {
  return BookshelfOrganizationLearner.count().then((number: $TSFixMe) => parseInt(number, 10));
}

function _getDistinctDivisions() {
  return knex('organization-learners').distinct('division');
}
