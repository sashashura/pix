// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex, sinon } = require('../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'populateOr... Remove this comment to see the full error message
const populateOrganizations = require('../../../scripts/populate-organizations-email');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Scripts | populate-organizations-email.js', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#populateOrganizations', function () {
    const externalId1 = 'uai1';
    const externalId2 = 'uai2';

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      databaseBuilder.factory.buildOrganization({ externalId: externalId1, email: 'first.last@example.net' });
      databaseBuilder.factory.buildOrganization({ externalId: externalId2 });

      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      sinon.stub(console, 'error');

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should populate organization's email", async function () {
      // given
      const csvData = [
        { uai: 'uai1', email: 'uai1@example.net' },
        { uai: 'uai2', email: 'uai2@example.net' },
        { uai: 'unknown', email: 'unknown@example.net' },
      ];

      // when
      await populateOrganizations(csvData);

      // then
      const organizations = await knex('organizations').select('externalId as uai', 'email');
      expect(organizations).to.deep.include(csvData[0]);
      expect(organizations).to.deep.include(csvData[1]);
      expect(organizations).to.not.deep.include(csvData[2]);
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      // eslint-disable-next-line no-console
      expect(console.error).to.have.been.calledWith('Organization not found for External ID unknown');
    });
  });
});
