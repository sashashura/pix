// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, expect, knex, domainBuilder, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../../../../lib/domain/models/Organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationRepository = require('../../../../lib/infrastructure/repositories/organization-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | Organization', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#create', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('organizations').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an Organization domain object', async function () {
      // given
      const organization = domainBuilder.buildOrganization();

      // when
      const organizationSaved = await organizationRepository.create(organization);

      // then
      expect(organizationSaved).to.be.an.instanceof(Organization);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should add a row in the table "organizations"', async function () {
      // given
      const { count: nbOrganizationsBeforeCreation } = await knex('organizations').count('*').first();

      // when
      await organizationRepository.create(domainBuilder.buildOrganization());

      // then
      const { count: nbOrganizationsAfterCreation } = await knex('organizations').count('*').first();
      expect(nbOrganizationsAfterCreation).to.equal(nbOrganizationsBeforeCreation + 1);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save model properties', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();

      const organization = domainBuilder.buildOrganization({ id: null, createdBy: userId });

      // when
      const organizationSaved = await organizationRepository.create(organization);

      // then
      expect(organizationSaved.id).to.not.be.undefined;
      expect(organizationSaved.name).to.equal(organization.name);
      expect(organizationSaved.type).to.equal(organization.type);
      expect(organizationSaved.logoUrl).to.equal(organization.logoUrl);
      expect(organizationSaved.externalId).to.equal(organization.externalId);
      expect(organizationSaved.provinceCode).to.equal(organization.provinceCode);
      expect(organizationSaved.createdBy).to.equal(organization.createdBy);
      expect(organizationSaved.documentationUrl).to.equal(organization.documentationUrl);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should insert default value for credit (0) when not defined', async function () {
      // given
      const organization = new Organization({
        name: 'organization',
        externalId: 'b400',
        type: 'PRO',
      });

      // when
      const organizationSaved = await organizationRepository.create(organization);

      // then
      expect(organizationSaved.credit).to.equal(Organization.defaultValues['credit']);
      expect(organizationSaved.email).to.be.null;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#update', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an Organization domain object with related tags', async function () {
      // given
      const organization = databaseBuilder.factory.buildOrganization({ id: 1 });
      const tagId = databaseBuilder.factory.buildTag().id;
      databaseBuilder.factory.buildOrganizationTag({ organizationId: 1, tagId });
      await databaseBuilder.commit();

      // when
      const organizationSaved = await organizationRepository.update(organization);

      // then
      expect(organizationSaved).to.be.an.instanceof(Organization);
      expect(organizationSaved.tags[0].id).to.be.equal(tagId);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not add row in table "organizations"', async function () {
      // given
      const organization = databaseBuilder.factory.buildOrganization({ id: 1 });
      await databaseBuilder.commit();
      const { count: nbOrganizationsBeforeUpdate } = await knex('organizations').count('*').first();

      // when
      await organizationRepository.update(organization);

      // then
      const { count: nbOrganizationsAfterUpdate } = await knex('organizations').count('*').first();
      expect(nbOrganizationsAfterUpdate).to.equal(nbOrganizationsBeforeUpdate);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update model in database', async function () {
      // given
      const { id: organizationId } = databaseBuilder.factory.buildOrganization();
      await databaseBuilder.commit();

      const organization = domainBuilder.buildOrganization({
        id: organizationId,
        name: 'New name',
        type: 'SCO',
        logoUrl: 'http://new.logo.url',
        externalId: '999Z527F',
        provinceCode: '999',
        isManagingStudents: true,
        credit: 50,
        email: 'email@example.net',
        documentationUrl: 'https://pix.fr/',
      });

      // when
      const organizationSaved = await organizationRepository.update(organization);

      // then
      expect(organizationSaved.id).to.equal(organization.id);
      expect(organizationSaved.name).to.equal('New name');
      expect(organizationSaved.type).to.equal('SCO');
      expect(organizationSaved.logoUrl).to.equal('http://new.logo.url');
      expect(organizationSaved.externalId).to.equal(organization.externalId);
      expect(organizationSaved.provinceCode).to.equal(organization.provinceCode);
      expect(organizationSaved.isManagingStudents).to.equal(organization.isManagingStudents);
      expect(organizationSaved.credit).to.equal(organization.credit);
      expect(organizationSaved.email).to.equal(organization.email);
      expect(organizationSaved.documentationUrl).to.equal('https://pix.fr/');
      expect(organizationSaved.showSkills).to.equal(organization.showSkills);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('success management', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a organization by provided id', async function () {
        // given
        const superAdminUserId = databaseBuilder.factory.buildUser().id;

        const insertedOrganization = databaseBuilder.factory.buildOrganization({
          type: 'SCO',
          name: 'Organization of the dark side',
          logoUrl: 'some logo url',
          credit: 154,
          externalId: '100',
          provinceCode: '75',
          isManagingStudents: 'true',
          email: 'sco.generic.account@example.net',
          documentationUrl: 'https://pix.fr/',
          createdBy: superAdminUserId,
          showNPS: true,
          formNPSUrl: 'https://pix.fr/',
          showSkills: false,
        });

        const expectedAttributes = {
          id: insertedOrganization.id,
          type: 'SCO',
          name: 'Organization of the dark side',
          logoUrl: 'some logo url',
          credit: 154,
          externalId: '100',
          provinceCode: '75',
          isManagingStudents: true,
          email: 'sco.generic.account@example.net',
          students: [],
          targetProfileShares: [],
          organizationInvitations: [],
          tags: [],
          documentationUrl: 'https://pix.fr/',
          createdBy: insertedOrganization.createdBy,
          showNPS: true,
          formNPSUrl: 'https://pix.fr/',
          showSkills: false,
          archivedAt: null,
        };

        await databaseBuilder.commit();

        // when
        const foundOrganization = await organizationRepository.get(insertedOrganization.id);

        // then
        expect(foundOrganization).to.deep.equal(expectedAttributes);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a rejection when organization id is not found', async function () {
        // given
        const nonExistentId = 10083;

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(organizationRepository.get)(nonExistentId);

        // then
        expect(error).to.be.an.instanceof(NotFoundError);
        expect((error as $TSFixMe).message).to.equal('Not found organization for ID 10083');
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when a target profile is shared with the organization', function () {
      let insertedOrganization: $TSFixMe;
      let sharedProfile: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        insertedOrganization = databaseBuilder.factory.buildOrganization();
        sharedProfile = databaseBuilder.factory.buildTargetProfile({
          isPublic: false,
        });
        databaseBuilder.factory.buildTargetProfileShare({
          organizationId: insertedOrganization.id,
          targetProfileId: sharedProfile.id,
        });

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a list of profile containing the shared profile', async function () {
        // when
        const organization = await organizationRepository.get(insertedOrganization.id);

        // then
        const firstTargetProfileShare = organization.targetProfileShares[0];
        expect(firstTargetProfileShare.targetProfileId).to.deep.equal(sharedProfile.id);
        expect(firstTargetProfileShare.organizationId).to.deep.equal(insertedOrganization.id);

        expect(firstTargetProfileShare.targetProfile).to.deep.equal(sharedProfile);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getIdByCertificationCenterId', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      _.map(
        [
          { id: 1, type: 'SCO', name: 'organization 1', externalId: '1234567' },
          { id: 2, type: 'SCO', name: 'organization 2', externalId: '1234568' },
          { id: 3, type: 'SUP', name: 'organization 3', externalId: '1234568' },
          { id: 4, type: 'SCO', name: 'organization 4', externalId: '1234569' },
          { id: 5, type: 'SCO', name: 'organization 5', externalId: '1234569' },
        ],
        (organization: $TSFixMe) => {
          databaseBuilder.factory.buildOrganization(organization);
        }
      );

      databaseBuilder.factory.buildCertificationCenter({
        id: 10,
        externalId: '1234568',
        type: 'SCO',
      });

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the id of the organization given the certification center id matching the same type', async function () {
      // when
      const organisationId = await organizationRepository.getIdByCertificationCenterId(10);

      // then
      expect(organisationId).to.equal(2);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if the id does not match a certification center with organization', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(organizationRepository.getIdByCertificationCenterId)(123456);

      // then
      expect(error).to.be.instanceOf(NotFoundError);
      expect((error as $TSFixMe).message).to.equal('Not found organization for certification center id 123456');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getScoOrganizationByExternalId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when there is an organization with given externalId', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the organization', async function () {
        // given
        databaseBuilder.factory.buildOrganization({
          id: 1,
          type: 'SCO',
          name: 'organization 1',
          externalId: '1234567',
          isManagingStudents: true,
        });
        await databaseBuilder.commit();

        // when
        const result = await organizationRepository.getScoOrganizationByExternalId('1234567');

        // then
        expect(result).to.be.instanceOf(Organization);
        expect(result.id).to.deep.equal(1);
        expect(result.type).to.deep.equal('SCO');
        expect(result.externalId).to.deep.equal('1234567');
        expect(result.isManagingStudents).to.deep.equal(true);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when there is no organization with given externalId', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an error if the externalId does not match an organization ', async function () {
        // given
        databaseBuilder.factory.buildOrganization({
          id: 1,
          type: 'SCO',
          name: 'organization 1',
          externalId: '1234567',
          isManagingStudents: true,
        });
        await databaseBuilder.commit();

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(organizationRepository.getScoOrganizationByExternalId)('AAAAAA');

        // then
        expect(error).to.be.instanceOf(NotFoundError);
        expect((error as $TSFixMe).message).to.equal('Could not find organization for externalId AAAAAA.');
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByExternalIdsFetchingIdsOnly', function () {
    let organizations: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      organizations = _.map(
        [
          { type: 'PRO', name: 'organization 1', externalId: '1234567' },
          { type: 'SCO', name: 'organization 2', externalId: '1234568' },
          { type: 'SUP', name: 'organization 3', externalId: '1234569' },
        ],
        (organization: $TSFixMe) => {
          return databaseBuilder.factory.buildOrganization(organization);
        }
      );

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the organizations that matches the filters', async function () {
      // given
      const externalIds = ['1234567', '1234569'];

      // when
      const foundOrganizations = await organizationRepository.findByExternalIdsFetchingIdsOnly(externalIds);

      // then
      expect(foundOrganizations).to.have.lengthOf(2);
      expect(foundOrganizations[0]).to.be.an.instanceof(Organization);
      expect(foundOrganizations[0].externalId).to.equal(organizations[0].externalId);
      expect(foundOrganizations[1].externalId).to.equal(organizations[2].externalId);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should only return id and externalId', async function () {
      // given
      const externalIds = ['1234567'];

      // when
      const foundOrganizations = await organizationRepository.findByExternalIdsFetchingIdsOnly(externalIds);

      // then
      expect(foundOrganizations[0].externalId).to.equal(organizations[0].externalId);
      expect(foundOrganizations[0].id).to.equal(organizations[0].id);
      expect(foundOrganizations[0].type).to.be.undefined;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findScoOrganizationsByUai', function () {
    let organizations: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      organizations = _.map(
        [
          { type: 'PRO', name: 'organization 1', externalId: '1234567', email: null },
          {
            type: 'SCO',
            name: 'organization 2',
            externalId: '1234568',
            email: 'sco.generic.account@example.net',
            archivedAt: new Date(),
          },
          { type: 'SUP', name: 'organization 3', externalId: '1234569', email: null },
          {
            type: 'SCO',
            name: 'organization 4',
            externalId: '0595401A',
            email: 'sco2.generic.account@example.net',
            archivedAt: null,
          },
          { type: 'SCO', name: 'organization 5', externalId: '0587996a', email: 'sco3.generic.account@example.net' },
          { type: 'SCO', name: 'organization 6', externalId: '058799Aa', email: 'sco4.generic.account@example.net' },
        ],
        (organization: $TSFixMe) => {
          return databaseBuilder.factory.buildOrganization(organization);
        }
      );

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return external identifier and email for SCO organizations matching given UAI', async function () {
      // given
      const uai = '1234568';
      const organizationSCO = organizations[1];

      // when
      const foundOrganization = await organizationRepository.findScoOrganizationsByUai({ uai });

      // then
      expect(foundOrganization).to.have.lengthOf(1);
      expect(foundOrganization[0]).to.be.an.instanceof(Organization);
      expect(foundOrganization[0].externalId).to.equal(organizationSCO.externalId);
      expect(foundOrganization[0].type).to.equal(organizationSCO.type);
      expect(foundOrganization[0].email).to.equal(organizationSCO.email);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return external identifier for SCO organizations matching given UAI with lower case', async function () {
      // given
      const uai = '0595401a';
      const organizationSCO = organizations[3];

      // when
      const foundOrganization = await organizationRepository.findScoOrganizationsByUai({ uai });

      // then
      expect(foundOrganization).to.have.lengthOf(1);
      expect(foundOrganization[0]).to.be.an.instanceof(Organization);
      expect(foundOrganization[0].externalId).to.equal(organizationSCO.externalId);
      expect(foundOrganization[0].type).to.equal(organizationSCO.type);
      expect(foundOrganization[0].email).to.equal(organizationSCO.email);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return external identifier for SCO organizations matching given UAI with Upper case', async function () {
      // given
      const uai = '0587996A';
      const organizationSCO = organizations[4];

      // when
      const foundOrganization = await organizationRepository.findScoOrganizationsByUai({ uai });

      // then
      expect(foundOrganization).to.have.lengthOf(1);
      expect(foundOrganization[0]).to.be.an.instanceof(Organization);
      expect(foundOrganization[0].externalId).to.equal(organizationSCO.externalId);
      expect(foundOrganization[0].type).to.equal(organizationSCO.type);
      expect(foundOrganization[0].email).to.equal(organizationSCO.email);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return external identifier for SCO organizations matching given UAI with Upper and lower case', async function () {
      // given
      const uai = '058799Aa';
      const organizationSCO = organizations[5];

      // when
      const foundOrganization = await organizationRepository.findScoOrganizationsByUai({ uai });

      // then
      expect(foundOrganization).to.have.lengthOf(1);
      expect(foundOrganization[0]).to.be.an.instanceof(Organization);
      expect(foundOrganization[0].externalId).to.equal(organizationSCO.externalId);
      expect(foundOrganization[0].type).to.equal(organizationSCO.type);
      expect(foundOrganization[0].email).to.equal(organizationSCO.email);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return external identifier for SCO organizations matching given UAI with lower and upper case', async function () {
      // given
      const uai = '058799aA';
      const organizationSCO = organizations[5];

      // when
      const foundOrganization = await organizationRepository.findScoOrganizationsByUai({ uai });

      // then
      expect(foundOrganization).to.have.lengthOf(1);
      expect(foundOrganization[0]).to.be.an.instanceof(Organization);
      expect(foundOrganization[0].externalId).to.equal(organizationSCO.externalId);
      expect(foundOrganization[0].type).to.equal(organizationSCO.type);
      expect(foundOrganization[0].email).to.equal(organizationSCO.email);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return archivedAt null value', async function () {
      // given
      const uai = '0595401A';

      // when
      const foundOrganization = await organizationRepository.findScoOrganizationsByUai({ uai });

      // then
      expect(foundOrganization[0].archivedAt).to.deep.equal(null);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when organization is archived', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return archivedAt attribute', async function () {
        // given
        const uai = '1234568';
        const organizationSCO = organizations[1];

        // when
        const foundOrganization = await organizationRepository.findScoOrganizationsByUai({ uai });

        // then
        expect(foundOrganization[0].archivedAt).to.deep.equal(organizationSCO.archivedAt);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findPaginatedFiltered', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are Organizations in the database', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        _.times(3, databaseBuilder.factory.buildOrganization);
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an Array of Organizations', async function () {
        // given
        const filter = {};
        const page = { number: 1, size: 10 };
        const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 3 };

        // when
        const { models: matchingOrganizations, pagination } = await organizationRepository.findPaginatedFiltered({
          filter,
          page,
        });

        // then
        expect(matchingOrganizations).to.exist;
        expect(matchingOrganizations).to.have.lengthOf(3);
        expect(matchingOrganizations[0]).to.be.an.instanceOf(Organization);
        expect(pagination).to.deep.equal(expectedPagination);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are lots of Organizations (> 10) in the database', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        _.times(12, databaseBuilder.factory.buildOrganization);
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return paginated matching Organizations', async function () {
        // given
        const filter = {};
        const page = { number: 1, size: 3 };
        const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 4, rowCount: 12 };

        // when
        const { models: matchingOrganizations, pagination } = await organizationRepository.findPaginatedFiltered({
          filter,
          page,
        });

        // then
        expect(matchingOrganizations).to.have.lengthOf(3);
        expect(pagination).to.deep.equal(expectedPagination);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is an Organization matching the "id"', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        databaseBuilder.factory.buildOrganization({ id: 123 });
        databaseBuilder.factory.buildOrganization({ id: 456 });
        databaseBuilder.factory.buildOrganization({ id: 789 });
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return only the Organization matching "id" if given in filters', async function () {
        // given
        const filter = { id: 123 };
        const page = { number: 1, size: 10 };
        const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 1 };

        // when
        const { models: matchingOrganizations, pagination } = await organizationRepository.findPaginatedFiltered({
          filter,
          page,
        });

        // then
        expect(matchingOrganizations).to.have.lengthOf(1);
        expect(matchingOrganizations[0].id).to.equal(123);
        expect(pagination).to.deep.equal(expectedPagination);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are multiple Organizations matching the same "name" search pattern', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        databaseBuilder.factory.buildOrganization({ name: 'Dragon & co' });
        databaseBuilder.factory.buildOrganization({ name: 'Dragonades & co' });
        databaseBuilder.factory.buildOrganization({ name: 'Broca & co' });
        databaseBuilder.factory.buildOrganization({ name: 'Donnie & co' });
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return only Organizations matching "name" if given in filters', async function () {
        // given
        const filter = { name: 'dra' };
        const page = { number: 1, size: 10 };
        const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 2 };

        // when
        const { models: matchingOrganizations, pagination } = await organizationRepository.findPaginatedFiltered({
          filter,
          page,
        });

        // then
        expect(matchingOrganizations).to.have.lengthOf(2);
        expect(_.map(matchingOrganizations, 'name')).to.have.members(['Dragon & co', 'Dragonades & co']);
        expect(pagination).to.deep.equal(expectedPagination);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are multiple Organizations matching the same "type" search pattern', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        databaseBuilder.factory.buildOrganization({ type: 'PRO' });
        databaseBuilder.factory.buildOrganization({ type: 'PRO' });
        databaseBuilder.factory.buildOrganization({ type: 'SUP' });
        databaseBuilder.factory.buildOrganization({ type: 'SCO' });
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return only Organizations matching "type" if given in filters', async function () {
        // given
        const filter = { type: 'S' };
        const page = { number: 1, size: 10 };
        const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 2 };

        // when
        const { models: matchingOrganizations, pagination } = await organizationRepository.findPaginatedFiltered({
          filter,
          page,
        });

        // then
        expect(_.map(matchingOrganizations, 'type')).to.have.members(['SUP', 'SCO']);
        expect(pagination).to.deep.equal(expectedPagination);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are multiple Organizations matching the same "externalId" search pattern', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        databaseBuilder.factory.buildOrganization({ externalId: '1234567A' });
        databaseBuilder.factory.buildOrganization({ externalId: '1234567B' });
        databaseBuilder.factory.buildOrganization({ externalId: '1234567C' });
        databaseBuilder.factory.buildOrganization({ externalId: '123456AD' });
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return only Organizations matching "externalId" if given in filters', async function () {
        // given
        const filter = { externalId: 'a' };
        const page = { number: 1, size: 10 };
        const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 2 };

        // when
        const { models: matchingOrganizations, pagination } = await organizationRepository.findPaginatedFiltered({
          filter,
          page,
        });

        // then
        expect(_.map(matchingOrganizations, 'externalId')).to.have.members(['1234567A', '123456AD']);
        expect(pagination).to.deep.equal(expectedPagination);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'when there are multiple Organizations matching the fields "name", "type" and "externalId" search pattern',
      function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          // Matching organizations
          databaseBuilder.factory.buildOrganization({ name: 'name_ok_1', type: 'SCO', externalId: '1234567A' });
          databaseBuilder.factory.buildOrganization({ name: 'name_ok_2', type: 'SCO', externalId: '1234568A' });
          databaseBuilder.factory.buildOrganization({ name: 'name_ok_3', type: 'SCO', externalId: '1234569A' });

          // Unmatching organizations
          databaseBuilder.factory.buildOrganization({ name: 'name_ko_4', type: 'SCO', externalId: '1234567B' });
          databaseBuilder.factory.buildOrganization({ name: 'name_ok_5', type: 'SUP', externalId: '1234567C' });

          return databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return only Organizations matching "name" AND "type" "AND" "externalId" if given in filters', async function () {
          // given
          const filter = { name: 'name_ok', type: 'SCO', externalId: 'a' };
          const page = { number: 1, size: 10 };
          const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 3 };

          // when
          const { models: matchingOrganizations, pagination } = await organizationRepository.findPaginatedFiltered({
            filter,
            page,
          });

          // then
          expect(_.map(matchingOrganizations, 'name')).to.have.members(['name_ok_1', 'name_ok_2', 'name_ok_3']);
          expect(_.map(matchingOrganizations, 'type')).to.have.members(['SCO', 'SCO', 'SCO']);
          expect(_.map(matchingOrganizations, 'externalId')).to.have.members(['1234567A', '1234568A', '1234569A']);
          expect(pagination).to.deep.equal(expectedPagination);
        });
      }
    );

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are filters that should be ignored', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        databaseBuilder.factory.buildOrganization({ provinceCode: 'ABC' });
        databaseBuilder.factory.buildOrganization({ provinceCode: 'DEF' });

        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should ignore the filters and retrieve all organizations', async function () {
        // given
        const filter = { provinceCode: 'ABC' };
        const page = { number: 1, size: 10 };
        const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 2 };

        // when
        const { models: matchingOrganizations, pagination } = await organizationRepository.findPaginatedFiltered({
          filter,
          page,
        });

        // then
        expect(_.map(matchingOrganizations, 'provinceCode')).to.have.members(['ABC', 'DEF']);
        expect(pagination).to.deep.equal(expectedPagination);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findPaginatedFilteredByTargetProfile', function () {
    let targetProfileId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      targetProfileId = databaseBuilder.factory.buildTargetProfile().id;
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are organizations linked to the target profile', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        _.times(2, () => {
          const organizationId = databaseBuilder.factory.buildOrganization().id;
          databaseBuilder.factory.buildTargetProfileShare({ organizationId, targetProfileId });
        });
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an Array of Organizations', async function () {
        // given
        const filter = {};
        const page = { number: 1, size: 10 };
        const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 2 };

        // when
        const { models: matchingOrganizations, pagination } =
          await organizationRepository.findPaginatedFilteredByTargetProfile({ targetProfileId, filter, page });

        // then
        expect(matchingOrganizations).to.exist;
        expect(matchingOrganizations).to.have.lengthOf(2);
        expect(matchingOrganizations[0]).to.be.an.instanceOf(Organization);
        expect(pagination).to.deep.equal(expectedPagination);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are lots of organizations (> 10) linked to the target profile', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        _.times(12, () => {
          const organizationId = databaseBuilder.factory.buildOrganization().id;
          databaseBuilder.factory.buildTargetProfileShare({ organizationId, targetProfileId });
        });
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return paginated matching Organizations', async function () {
        // given
        const filter = {};
        const page = { number: 1, size: 3 };
        const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 4, rowCount: 12 };

        // when
        const { models: matchingOrganizations, pagination } =
          await organizationRepository.findPaginatedFilteredByTargetProfile({ targetProfileId, filter, page });

        // then
        expect(matchingOrganizations).to.have.lengthOf(3);
        expect(pagination).to.deep.equal(expectedPagination);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a filter on "id"', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        const organizationId1 = databaseBuilder.factory.buildOrganization({ id: 123 }).id;
        const organizationId2 = databaseBuilder.factory.buildOrganization({ id: 456 }).id;
        databaseBuilder.factory.buildTargetProfileShare({ organizationId: organizationId1, targetProfileId });
        databaseBuilder.factory.buildTargetProfileShare({ organizationId: organizationId2, targetProfileId });
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return only organizations matching "id"', async function () {
        // given
        const filter = { id: 456 };
        const page = { number: 1, size: 10 };
        const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 1 };

        // when
        const { models: matchingOrganizations, pagination } =
          await organizationRepository.findPaginatedFilteredByTargetProfile({ targetProfileId, filter, page });

        // then
        expect(matchingOrganizations).to.have.lengthOf(1);
        expect(matchingOrganizations[0].id).to.equal(456);
        expect(pagination).to.deep.equal(expectedPagination);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are some filter on "name"', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        const organizationId1 = databaseBuilder.factory.buildOrganization({ name: 'Dragon & co' }).id;
        const organizationId2 = databaseBuilder.factory.buildOrganization({ name: 'Broca & co' }).id;
        databaseBuilder.factory.buildTargetProfileShare({ organizationId: organizationId1, targetProfileId });
        databaseBuilder.factory.buildTargetProfileShare({ organizationId: organizationId2, targetProfileId });
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return only organizations matching "name"', async function () {
        // given
        const filter = { name: 'dra' };
        const page = { number: 1, size: 10 };
        const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 1 };

        // when
        const { models: matchingOrganizations, pagination } =
          await organizationRepository.findPaginatedFilteredByTargetProfile({ targetProfileId, filter, page });

        // then
        expect(matchingOrganizations).to.have.lengthOf(1);
        expect(_.map(matchingOrganizations, 'name')).to.have.members(['Dragon & co']);
        expect(pagination).to.deep.equal(expectedPagination);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are some filter on "type"', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        const organizationId1 = databaseBuilder.factory.buildOrganization({ type: 'PRO' }).id;
        const organizationId2 = databaseBuilder.factory.buildOrganization({ type: 'SUP' }).id;
        databaseBuilder.factory.buildTargetProfileShare({ organizationId: organizationId1, targetProfileId });
        databaseBuilder.factory.buildTargetProfileShare({ organizationId: organizationId2, targetProfileId });
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return only organizations matching "type"', async function () {
        // given
        const filter = { type: 'S' };
        const page = { number: 1, size: 10 };
        const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 1 };

        // when
        const { models: matchingOrganizations, pagination } =
          await organizationRepository.findPaginatedFilteredByTargetProfile({ targetProfileId, filter, page });

        // then
        expect(_.map(matchingOrganizations, 'type')).to.have.members(['SUP']);
        expect(pagination).to.deep.equal(expectedPagination);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are some filter on "externalId"', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        const organizationId1 = databaseBuilder.factory.buildOrganization({ externalId: '1234567A' }).id;
        const organizationId2 = databaseBuilder.factory.buildOrganization({ externalId: '1234567B' }).id;
        databaseBuilder.factory.buildTargetProfileShare({ organizationId: organizationId1, targetProfileId });
        databaseBuilder.factory.buildTargetProfileShare({ organizationId: organizationId2, targetProfileId });
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return only organizations matching "externalId"', async function () {
        // given
        const filter = { externalId: 'a' };
        const page = { number: 1, size: 10 };
        const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 1 };

        // when
        const { models: matchingOrganizations, pagination } =
          await organizationRepository.findPaginatedFilteredByTargetProfile({ targetProfileId, filter, page });

        // then
        expect(_.map(matchingOrganizations, 'externalId')).to.have.members(['1234567A']);
        expect(pagination).to.deep.equal(expectedPagination);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are some filters on "name", "type" and "externalId"', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        // Matching organizations
        const organizationId1 = databaseBuilder.factory.buildOrganization({
          name: 'name_ok_1',
          type: 'SCO',
          externalId: '1234567A',
        }).id;
        const organizationId2 = databaseBuilder.factory.buildOrganization({
          name: 'name_ok_2',
          type: 'SCO',
          externalId: '1234568A',
        }).id;
        databaseBuilder.factory.buildTargetProfileShare({ organizationId: organizationId1, targetProfileId });
        databaseBuilder.factory.buildTargetProfileShare({ organizationId: organizationId2, targetProfileId });

        // Unmatching organizations
        const organizationId3 = databaseBuilder.factory.buildOrganization({
          name: 'name_ko_3',
          type: 'SCO',
          externalId: '1234567A',
        }).id;
        const organizationId4 = databaseBuilder.factory.buildOrganization({
          name: 'name_ok_4',
          type: 'SCO',
          externalId: '1234567B',
        }).id;
        const organizationId5 = databaseBuilder.factory.buildOrganization({
          name: 'name_ok_5',
          type: 'SUP',
          externalId: '1234567A',
        }).id;
        databaseBuilder.factory.buildTargetProfileShare({ organizationId: organizationId3, targetProfileId });
        databaseBuilder.factory.buildTargetProfileShare({ organizationId: organizationId4, targetProfileId });
        databaseBuilder.factory.buildTargetProfileShare({ organizationId: organizationId5, targetProfileId });

        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return only Organizations matching "name" AND "type" "AND" "externalId" if given in filters', async function () {
        // given
        const filter = { name: 'name_ok', type: 'SCO', externalId: 'a' };
        const page = { number: 1, size: 10 };
        const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 2 };

        // when
        const { models: matchingOrganizations, pagination } = await organizationRepository.findPaginatedFiltered({
          filter,
          page,
        });

        // then
        expect(_.map(matchingOrganizations, 'name')).to.have.members(['name_ok_1', 'name_ok_2']);
        expect(_.map(matchingOrganizations, 'type')).to.have.members(['SCO', 'SCO']);
        expect(_.map(matchingOrganizations, 'externalId')).to.have.members(['1234567A', '1234568A']);
        expect(pagination).to.deep.equal(expectedPagination);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are filters that should be ignored', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        const organizationId1 = databaseBuilder.factory.buildOrganization({ provinceCode: 'ABC' }).id;
        const organizationId2 = databaseBuilder.factory.buildOrganization({ provinceCode: 'DEF' }).id;
        databaseBuilder.factory.buildTargetProfileShare({ organizationId: organizationId1, targetProfileId });
        databaseBuilder.factory.buildTargetProfileShare({ organizationId: organizationId2, targetProfileId });
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should ignore the filters and retrieve all organizations', async function () {
        // given
        const filter = { provinceCode: 'DEF' };
        const page = { number: 1, size: 10 };
        const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 2 };

        // when
        const { models: matchingOrganizations, pagination } =
          await organizationRepository.findPaginatedFilteredByTargetProfile({ targetProfileId, filter, page });

        // then
        expect(_.map(matchingOrganizations, 'provinceCode')).to.have.members(['ABC', 'DEF']);
        expect(pagination).to.deep.equal(expectedPagination);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#batchCreateProOrganizations', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('organizations').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should add rows in the table "organizations"', async function () {
      // given
      const organization1 = domainBuilder.buildOrganization();
      const organization2 = domainBuilder.buildOrganization();

      // when
      await organizationRepository.batchCreateProOrganizations([organization1, organization2]);

      // then
      const foundOrganizations = await knex('organizations').select();
      expect(foundOrganizations.length).to.equal(2);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save organization attributes', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();

      const organization = domainBuilder.buildOrganization({
        id: null,
        externalId: '1237457A',
        name: 'Orga 1',
        provinceCode: '12',
        credit: 100,
        createdBy: userId,
        documentationUrl: 'http://example.net/',
      });

      // when
      await organizationRepository.batchCreateProOrganizations([organization]);

      // then
      const foundOrganizations = await knex('organizations').select();
      expect(foundOrganizations[0].id).to.not.be.undefined;
      expect(foundOrganizations[0].name).to.equal(organization.name);
      expect(foundOrganizations[0].externalId).to.equal(organization.externalId);
      expect(foundOrganizations[0].provinceCode).to.equal(organization.provinceCode);
      expect(foundOrganizations[0].createdBy).to.equal(organization.createdBy);
      expect(foundOrganizations[0].documentationUrl).to.equal(organization.documentationUrl);
    });
  });
});
