// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex } = require('../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'addTag'.
  addTag,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkData'... Remove this comment to see the full error message
  checkData,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createOrUp... Remove this comment to see the full error message
  createOrUpdateOrganizations,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../scripts/create-or-update-sco-agri-organizations');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logoUrl'.
const logoUrl = require('../../../scripts/logo/default-sco-agri-organization-logo-base64');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Scripts | create-or-update-sco-agri-organizations', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkData', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should keep all data', async function () {
      // given
      const csvData = [
        ['a100', 'Lycée Charles De Gaulle', 'cdg@example.net'],
        ['b200', 'Collège Marie Curie'],
      ];

      const expectedResult = [
        {
          externalId: 'A100',
          name: 'Lycée Charles De Gaulle',
          email: 'cdg@example.net',
        },
        {
          externalId: 'B200',
          name: 'Collège Marie Curie',
        },
      ];

      // when
      const result = await checkData({ csvData });

      // then
      expect(result).to.deep.have.members(expectedResult);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should keep only one data when a whole line is empty', async function () {
      // given
      const csvData = [
        ['a100', 'Lycée Charles De Gaulle'],
        ['', ''],
      ];

      const expectedResult = [
        {
          externalId: 'A100',
          name: 'Lycée Charles De Gaulle',
        },
      ];

      // when
      const result = await checkData({ csvData });

      // then
      expect(result).to.deep.have.members(expectedResult);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should keep only one data when an externalId is missing', async function () {
      // given
      const csvData = [
        ['a100', 'Lycée Charles De Gaulle'],
        ['', 'Collège Marie Curie'],
      ];

      const expectedResult = [
        {
          externalId: 'A100',
          name: 'Lycée Charles De Gaulle',
        },
      ];

      // when
      const result = await checkData({ csvData });

      // then
      expect(result).to.deep.have.members(expectedResult);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should keep only one data when name is missing', async function () {
      // given
      const csvData = [
        ['a100', 'Lycée Charles De Gaulle'],
        ['b200', ''],
      ];

      const expectedResult = [
        {
          externalId: 'A100',
          name: 'Lycée Charles De Gaulle',
        },
      ];

      // when
      const result = await checkData({ csvData });

      // then
      expect(result).to.deep.have.members(expectedResult);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createOrUpdateOrganizations', function () {
    let organization: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      organization = databaseBuilder.factory.buildOrganization();
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When organization already exists', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should update name, email, isManagingStudents and logo url', async function () {
        // given
        const organizationsByExternalId = {};
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        organizationsByExternalId[organization.externalId] = {
          id: organization.id,
          externalId: organization.externalId,
        };
        const checkedData = [
          {
            externalId: organization.externalId,
            name: 'New Name',
            email: 'new@example.net',
          },
        ];

        // when
        const updatedOrganizations = await createOrUpdateOrganizations({ organizationsByExternalId, checkedData });

        // then
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        expect(updatedOrganizations[0].name).to.equal(checkedData[0].name);
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        expect(updatedOrganizations[0].email).to.equal(checkedData[0].email);
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        expect(updatedOrganizations[0].isManagingStudents).to.be.true;
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        expect(updatedOrganizations[0].logoUrl).to.equal(logoUrl);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When organization does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should create the organization', async function () {
        // given
        const organizationsByExternalId = {};
        const checkedData = [
          {
            externalId: 'EXTERNAL',
            name: 'New Name',
            email: 'new@example.net',
          },
        ];

        // when
        const createdOrganizations = await createOrUpdateOrganizations({ organizationsByExternalId, checkedData });

        // then
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        expect(createdOrganizations[0].name).to.equal(checkedData[0].name);
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        expect(createdOrganizations[0].externalId).to.equal(checkedData[0].externalId);
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        expect(createdOrganizations[0].email).to.equal(checkedData[0].email);
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        expect(createdOrganizations[0].logoUrl).to.equal(logoUrl);
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        expect(createdOrganizations[0].provinceCode).to.equal('EXT');
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        expect(createdOrganizations[0].type).to.equal('SCO');
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        expect(createdOrganizations[0].isManagingStudents).to.be.true;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#addTag', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When AGRICULTURE tag does not exist', function () {
      // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
      afterEach(function () {
        return knex('tags').delete();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should create it', async function () {
        // given
        const organizations: $TSFixMe = [];

        // when
        await addTag(organizations);

        // then
        const tagsInDB = await knex('tags').select();
        expect(tagsInDB.length).to.equal(1);
        expect(tagsInDB[0].name).to.equal('AGRICULTURE');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When AGRICULTURE tag already exists in DB', function () {
      let agriTag: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        agriTag = databaseBuilder.factory.buildTag({ name: 'AGRICULTURE' });
        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
      afterEach(function () {
        return knex('organization-tags').delete();
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('When organization does not have an AGRICULTURE tag', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should add AGRICULTURE tag to the organization', async function () {
          // given
          const organization = databaseBuilder.factory.buildOrganization({ type: 'SCO' });
          await databaseBuilder.commit();

          // when
          await addTag([organization]);

          // then
          const organizationTagsInDB = await knex('organization-tags').select();
          expect(organizationTagsInDB.length).to.equal(1);
          expect(organizationTagsInDB[0].organizationId).to.equal(organization.id);
          expect(organizationTagsInDB[0].tagId).to.equal(agriTag.id);
        });
      });
    });
  });
});
