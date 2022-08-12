// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder, databaseBuilder, knex, catchErr, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../lib/domain/models/CampaignParticipationStatuses');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../../../../lib/domain/models/CampaignTypes');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationLearner = require('../../../../lib/domain/models/OrganizationLearner');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserWithOr... Remove this comment to see the full error message
const UserWithOrganizationLearner = require('../../../../lib/domain/models/UserWithOrganizationLearner');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationLearnerForAdmin = require('../../../../lib/domain/read-models/OrganizationLearnerForAdmin');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
  NotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationLearnersCouldNotBeSavedError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationLearnerNotFound,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserCouldN... Remove this comment to see the full error message
  UserCouldNotBeReconciledError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
  UserNotFoundError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationLearnerRepository = require('../../../../lib/infrastructure/repositories/organization-learner-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../../../lib/infrastructure/DomainTransaction');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Repository | organization-learner-repository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByIds', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return all the organizationLearners for given organizationLearner IDs', async function () {
      // given
      const organizationLearner1 = databaseBuilder.factory.buildOrganizationLearner();
      const organizationLearner2 = databaseBuilder.factory.buildOrganizationLearner();
      const ids = [organizationLearner1.id, organizationLearner2.id];
      await databaseBuilder.commit();

      // when
      const organizationLearnersResult = await organizationLearnerRepository.findByIds({ ids });

      // then
      const anyOrganizationLearner = organizationLearnersResult[0];
      expect(anyOrganizationLearner).to.be.an.instanceOf(OrganizationLearner);
      expect(anyOrganizationLearner.firstName).to.equal(organizationLearner1.firstName);
      expect(anyOrganizationLearner.lastName).to.equal(organizationLearner1.lastName);
      expect(anyOrganizationLearner.birthdate).to.deep.equal(organizationLearner1.birthdate);
      expect(_.map(organizationLearnersResult, 'id')).to.have.members([
        organizationLearner1.id,
        organizationLearner2.id,
      ]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return empty array when there are no result', async function () {
      // given
      databaseBuilder.factory.buildOrganizationLearner({ id: 1 });
      databaseBuilder.factory.buildOrganizationLearner({ id: 2 });
      const notFoundIds = [3, 4];
      await databaseBuilder.commit();

      // when
      const organizationLearners = await organizationLearnerRepository.findByIds({ ids: notFoundIds });

      // then
      expect(organizationLearners).to.be.empty;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByOrganizationId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return instances of OrganizationLearner', async function () {
      // given
      const organization = databaseBuilder.factory.buildOrganization();
      const organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        userId: null,
      });

      await databaseBuilder.commit();

      // when
      const organizationLearners = await organizationLearnerRepository.findByOrganizationId({
        organizationId: organization.id,
      });

      // then
      const anyOrganizationLearner = organizationLearners[0];
      expect(anyOrganizationLearner).to.be.an.instanceOf(OrganizationLearner);

      expect(anyOrganizationLearner.firstName).to.equal(organizationLearner.firstName);
      expect(anyOrganizationLearner.lastName).to.equal(organizationLearner.lastName);
      expect(anyOrganizationLearner.birthdate).to.deep.equal(organizationLearner.birthdate);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return all the organizationLearners for a given organization ID', async function () {
      // given
      const organization_1 = databaseBuilder.factory.buildOrganization();
      const organization_2 = databaseBuilder.factory.buildOrganization();

      const user = databaseBuilder.factory.buildUser();

      const firstOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization_1.id,
      });
      const secondOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization_1.id,
        userId: user.id,
      });
      databaseBuilder.factory.buildOrganizationLearner({ organizationId: organization_2.id });

      await databaseBuilder.commit();

      // when
      const organizationLearners = await organizationLearnerRepository.findByOrganizationId({
        organizationId: organization_1.id,
      });

      // then
      expect(_.map(organizationLearners, 'id')).to.have.members([
        firstOrganizationLearner.id,
        secondOrganizationLearner.id,
      ]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should order organizationLearners by lastName and then by firstName with no sensitive case', async function () {
      // given
      const organization = databaseBuilder.factory.buildOrganization();

      const firstOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        lastName: 'Grenier',
      });
      const secondOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        lastName: 'Avatar',
        firstName: 'Xavier',
      });
      const thirdOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        lastName: 'Avatar',
        firstName: 'Arthur',
      });
      const fourthOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        lastName: 'Avatar',
        firstName: 'MATHURIN',
      });

      await databaseBuilder.commit();

      // when
      const organizationLearners = await organizationLearnerRepository.findByOrganizationId({
        organizationId: organization.id,
      });

      // then
      expect(_.map(organizationLearners, 'id')).to.deep.include.ordered.members([
        thirdOrganizationLearner.id,
        fourthOrganizationLearner.id,
        secondOrganizationLearner.id,
        firstOrganizationLearner.id,
      ]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return empty array when there are no result', async function () {
      // given
      const organization = databaseBuilder.factory.buildOrganization();
      await databaseBuilder.commit();

      // when
      const organizationLearners = await organizationLearnerRepository.findByOrganizationId({
        organizationId: organization.id,
      });

      // then
      expect(organizationLearners).to.be.empty;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByOrganizationIdAndUpdatedAtOrderByDivision', function () {
    const afterBeginningOfThe2020SchoolYear = new Date('2020-10-15');
    let clock: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      clock = sinon.useFakeTimers(afterBeginningOfThe2020SchoolYear);
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      clock.restore();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return instances of OrganizationLearner', async function () {
      // given
      const organization = databaseBuilder.factory.buildOrganization();
      const organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        userId: null,
        division: '3A',
        updatedAt: new Date(),
      });

      await databaseBuilder.commit();

      // when
      const paginatedOrganizationLearners =
        await organizationLearnerRepository.findByOrganizationIdAndUpdatedAtOrderByDivision({
          organizationId: organization.id,
          page: {
            size: 10,
            number: 1,
          },
          filter: { divisions: ['3A'] },
        });

      // then
      const expectedOrganizationLearner = domainBuilder.buildOrganizationLearner({
        ...organizationLearner,
        organization,
      });
      expect(paginatedOrganizationLearners.data[0]).to.deepEqualInstance(expectedOrganizationLearner);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return all the organizationLearners for a given organization ID', async function () {
      // given
      const organization_1 = databaseBuilder.factory.buildOrganization();
      const organization_2 = databaseBuilder.factory.buildOrganization();

      const user = databaseBuilder.factory.buildUser();

      const firstOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization_1.id,
        division: '3A',
        updatedAt: new Date(),
      });
      const secondOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization_1.id,
        userId: user.id,
        division: '3A',
        updatedAt: new Date(),
      });
      databaseBuilder.factory.buildOrganizationLearner({ organizationId: organization_2.id });

      await databaseBuilder.commit();

      // when
      const organizationLearners = await organizationLearnerRepository.findByOrganizationIdAndUpdatedAtOrderByDivision({
        organizationId: organization_1.id,
        page: {
          size: 10,
          number: 1,
        },
        filter: { divisions: ['3A'] },
      });

      // then
      const expectedFirstOrganizationLearner = domainBuilder.buildOrganizationLearner({
        ...firstOrganizationLearner,
        organization: organization_1,
      });
      const expectedSecondOrganizationLearner = domainBuilder.buildOrganizationLearner({
        ...secondOrganizationLearner,
        organization: organization_1,
      });
      expect(organizationLearners.data).to.deepEqualArray([
        expectedFirstOrganizationLearner,
        expectedSecondOrganizationLearner,
      ]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not return disabled organizationLearners for a given organization ID', async function () {
      // given
      const organization = databaseBuilder.factory.buildOrganization();
      const user = databaseBuilder.factory.buildUser();
      const notDisabledOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        isDisabled: false,
        organizationId: organization.id,
        division: '3A',
        updatedAt: new Date(),
      });
      databaseBuilder.factory.buildOrganizationLearner({
        isDisabled: true,
        organizationId: organization.id,
        userId: user.id,
        division: '3A',
        updatedAt: new Date(),
      });

      await databaseBuilder.commit();

      // when
      const organizationLearners = await organizationLearnerRepository.findByOrganizationIdAndUpdatedAtOrderByDivision({
        organizationId: organization.id,
        page: {
          size: 10,
          number: 1,
        },
        filter: { divisions: ['3A'] },
      });

      // then
      const expectedNotDisabledOrganizationLearner = domainBuilder.buildOrganizationLearner({
        ...notDisabledOrganizationLearner,
        organization,
      });
      expect(organizationLearners.data).to.deepEqualArray([expectedNotDisabledOrganizationLearner]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should order organizationLearners by division and last name and then first name with no sensitive case', async function () {
      // given
      const organization = databaseBuilder.factory.buildOrganization();

      const organizationLearner3B = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        division: '3b',
        updatedAt: new Date(),
      });
      const organizationLearner3ABA = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        division: '3A',
        lastName: 'B',
        firstName: 'A',
        updatedAt: new Date(),
      });
      const organizationLearner3ABB = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        division: '3A',
        lastName: 'B',
        firstName: 'B',
        updatedAt: new Date(),
      });
      const organizationLearnerT2 = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        division: 'T2',
        updatedAt: new Date(),
      });
      const organizationLearnerT1CB = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        division: 't1',
        lastName: 'C',
        firstName: 'B',
        updatedAt: new Date(),
      });
      const organizationLearnerT1CA = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        division: 't1',
        lastName: 'C',
        firstName: 'A',
        updatedAt: new Date(),
      });

      await databaseBuilder.commit();

      // when
      const organizationLearners = await organizationLearnerRepository.findByOrganizationIdAndUpdatedAtOrderByDivision({
        organizationId: organization.id,
        page: {
          size: 10,
          number: 1,
        },
        filter: {},
      });

      // then
      const expectedOrganizationLearner3ABA = domainBuilder.buildOrganizationLearner({
        ...organizationLearner3ABA,
        organization,
      });
      const expectedOrganizationLearner3ABB = domainBuilder.buildOrganizationLearner({
        ...organizationLearner3ABB,
        organization,
      });
      const expectedOrganizationLearner3B = domainBuilder.buildOrganizationLearner({
        ...organizationLearner3B,
        organization,
      });
      const expectedOrganizationLearnerT1CA = domainBuilder.buildOrganizationLearner({
        ...organizationLearnerT1CA,
        organization,
      });
      const expectedOrganizationLearnerT1CB = domainBuilder.buildOrganizationLearner({
        ...organizationLearnerT1CB,
        organization,
      });
      const expectedOrganizationLearnerT2 = domainBuilder.buildOrganizationLearner({
        ...organizationLearnerT2,
        organization,
      });
      expect(organizationLearners.data).to.deepEqualArray([
        expectedOrganizationLearner3ABA,
        expectedOrganizationLearner3ABB,
        expectedOrganizationLearner3B,
        expectedOrganizationLearnerT1CA,
        expectedOrganizationLearnerT1CB,
        expectedOrganizationLearnerT2,
      ]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('when there are two students and we ask for pages of one student, it should return one student on page two', async function () {
      // given
      const organization = databaseBuilder.factory.buildOrganization();

      const organizationLearner3B = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        division: '3b',
        updatedAt: new Date(),
      });

      databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        division: '3A',
        lastName: 'B',
        firstName: 'A',
        updatedAt: new Date(),
      });

      await databaseBuilder.commit();

      // when
      const organizationLearners = await organizationLearnerRepository.findByOrganizationIdAndUpdatedAtOrderByDivision({
        organizationId: organization.id,
        page: {
          size: 1,
          number: 2,
        },
        filter: {},
      });

      // then
      const expectedOrganizationLearnerInPage1 = domainBuilder.buildOrganizationLearner({
        ...organizationLearner3B,
        organization,
      });
      expect(organizationLearners.data).to.deepEqualArray([expectedOrganizationLearnerInPage1]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should filter out students registered after August 15, 2020', async function () {
      // given
      const organization = databaseBuilder.factory.buildOrganization();

      const beforeTheDate = new Date('2020-08-14T10:00:00Z');
      const afterTheDate = new Date('2020-08-16T10:00:00Z');
      databaseBuilder.factory.buildOrganizationLearner({ organizationId: organization.id, updatedAt: beforeTheDate });
      const earlierOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        updatedAt: afterTheDate,
      });

      await databaseBuilder.commit();

      // when
      const organizationLearners = await organizationLearnerRepository.findByOrganizationIdAndUpdatedAtOrderByDivision({
        organizationId: organization.id,
        page: {
          size: 10,
          number: 1,
        },
        filter: {},
      });

      // then
      const expectedEarlierOrganizationLearner = domainBuilder.buildOrganizationLearner({
        ...earlierOrganizationLearner,
        organization,
      });
      expect(organizationLearners.data).to.deepEqualArray([expectedEarlierOrganizationLearner]);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByUserId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return instances of OrganizationLearner', async function () {
      // given
      const organization = databaseBuilder.factory.buildOrganization();
      const userId = databaseBuilder.factory.buildUser().id;
      const organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        userId,
      });

      await databaseBuilder.commit();

      // when
      const organizationLearners = await organizationLearnerRepository.findByUserId({ userId });

      // then
      const anyOrganizationLearner = organizationLearners[0];
      expect(anyOrganizationLearner).to.be.an.instanceOf(OrganizationLearner);

      expect(anyOrganizationLearner.firstName).to.equal(organizationLearner.firstName);
      expect(anyOrganizationLearner.lastName).to.equal(organizationLearner.lastName);
      expect(anyOrganizationLearner.birthdate).to.deep.equal(organizationLearner.birthdate);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return all the organizationLearners for a given user ID', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;

      const firstOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({ userId });
      const secondOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({ userId });

      await databaseBuilder.commit();

      // when
      const organizationLearners = await organizationLearnerRepository.findByUserId({ userId });

      // then
      expect(_.map(organizationLearners, 'id')).to.have.members([
        firstOrganizationLearner.id,
        secondOrganizationLearner.id,
      ]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should order organizationLearners by id', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const firstOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({ userId });
      const secondOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({ userId });
      const thirdOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({ userId });
      const fourthOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({ userId });

      await databaseBuilder.commit();

      // when
      const organizationLearners = await organizationLearnerRepository.findByUserId({ userId });

      // then
      expect(_.map(organizationLearners, 'id')).to.deep.include.ordered.members([
        firstOrganizationLearner.id,
        secondOrganizationLearner.id,
        thirdOrganizationLearner.id,
        fourthOrganizationLearner.id,
      ]);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isOrganizationLearnerIdLinkedToUserAndSCOOrganization', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when an organizationLearnermatches an id and matches also a given user id and a SCO organization', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const otherUserId = databaseBuilder.factory.buildUser().id;
      const firstScoOrganizationId = databaseBuilder.factory.buildOrganization({ type: 'SCO' }).id;
      const secondScoOrganizationId = databaseBuilder.factory.buildOrganization({ type: 'SCO' }).id;
      const supOrganizationId = databaseBuilder.factory.buildOrganization({ type: 'SUP' }).id;
      const matchingOrganizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({
        userId,
        organizationId: firstScoOrganizationId,
      }).id;
      databaseBuilder.factory.buildOrganizationLearner({ userId, organizationId: secondScoOrganizationId });
      databaseBuilder.factory.buildOrganizationLearner({
        userId: otherUserId,
        organizationId: secondScoOrganizationId,
      });
      databaseBuilder.factory.buildOrganizationLearner({ userId, organizationId: supOrganizationId });
      await databaseBuilder.commit();

      // when
      const isLinked = await organizationLearnerRepository.isOrganizationLearnerIdLinkedToUserAndSCOOrganization({
        userId,
        organizationLearnerId: matchingOrganizationLearnerId,
      });

      // then
      expect(isLinked).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when no organizationLearner matches an id and matches also a given user id and a SCO organization', async function () {
      // when
      const isLinked = await organizationLearnerRepository.isOrganizationLearnerIdLinkedToUserAndSCOOrganization({
        userId: 42,
        organizationLearnerId: 42,
      });

      // then
      expect(isLinked).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#disableAllOrganizationLearnersInOrganization', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should disable all organization learners for the given organization', async function () {
      const organization = databaseBuilder.factory.buildOrganization();
      const organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
      });
      const otherFirstOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner();
      await databaseBuilder.commit();

      await DomainTransaction.execute((domainTransaction: $TSFixMe) => {
        return organizationLearnerRepository.disableAllOrganizationLearnersInOrganization({
          domainTransaction,
          organizationId: organization.id,
        });
      });

      const results = await knex('organization-learners').select();
      const expectedDisabled = results.find((result: $TSFixMe) => result.id === organizationLearner.id);
      expect(expectedDisabled.isDisabled).to.be.true;
      const expectedActive = results.find((result: $TSFixMe) => result.id === otherFirstOrganizationLearner.id);
      expect(expectedActive.isDisabled).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the date when an organization learner is disabled', async function () {
      const organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        updatedAt: new Date('1970-01-01'),
      });
      await databaseBuilder.commit();

      await DomainTransaction.execute((domainTransaction: $TSFixMe) => {
        return organizationLearnerRepository.disableAllOrganizationLearnersInOrganization({
          domainTransaction,
          organizationId: organizationLearner.organizationId,
        });
      });

      const expectedDisabled = await knex('organization-learners').where('id', organizationLearner.id).first();
      expect(expectedDisabled.updatedAt).to.not.equal(organizationLearner.updatedAt);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should rollback when an error occurs during transaction', async function () {
      const organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        updatedAt: new Date('1970-01-01'),
      });
      await databaseBuilder.commit();

      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      await catchErr(async () => {
        await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          await organizationLearnerRepository.disableAllOrganizationLearnersInOrganization({
            domainTransaction,
            organizationId: organizationLearner.organizationId,
          });
          throw new Error('an error occurs within the domain transaction');
        });
      });

      const organizationLearnerNotDisabled = await knex('organization-learners')
        .where('id', organizationLearner.id)
        .first();
      expect(organizationLearnerNotDisabled.isDisabled).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#addOrUpdateOrganizationOfOrganizationLearners', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'when imported organization learner is in a different organization as an existing organization learner with the same national student id',
      function () {
        // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
        afterEach(function () {
          return knex('organization-learners').delete();
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('and same birthday', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should save the imported organization learner with the user id of the existing one', async function () {
            // given
            const nationalStudentId = '123456A';
            const birthdate = '2000-01-01';
            const anotherOrganizationId = databaseBuilder.factory.buildOrganization().id;
            const existingOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({
              id: 1,
              organizationId: databaseBuilder.factory.buildOrganization().id,
              nationalStudentId,
              birthdate,
              userId: databaseBuilder.factory.buildUser().id,
            });
            await databaseBuilder.commit();

            const importedOrganizationLearners = [
              new OrganizationLearner({
                lastName: 'Pipeau',
                firstName: 'Peaupi',
                birthdate,
                nationalStudentId,
                userId: null,
                isDisabled: false,
                organizationId: anotherOrganizationId,
              }),
            ];

            // when
            await DomainTransaction.execute((domainTransaction: $TSFixMe) => {
              return organizationLearnerRepository.addOrUpdateOrganizationOfOrganizationLearners(
                importedOrganizationLearners,
                anotherOrganizationId,
                domainTransaction
              );
            });

            // then
            const [newOrganizationLearner] = await organizationLearnerRepository.findByOrganizationId({
              organizationId: anotherOrganizationId,
            });
            expect(newOrganizationLearner).to.not.be.null;
            expect(newOrganizationLearner.userId).to.equal(existingOrganizationLearner.userId);
            expect(newOrganizationLearner.id).to.not.equal(existingOrganizationLearner.id);
            expect(newOrganizationLearner.organizationId).to.not.equal(existingOrganizationLearner.organizationId);
            expect(newOrganizationLearner.nationalStudentId).to.equal(existingOrganizationLearner.nationalStudentId);
            expect(newOrganizationLearner.birthdate).to.equal(existingOrganizationLearner.birthdate);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('and different birthday', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should save the organization learner without a user id', async function () {
            // given
            const nationalStudentId = '123456A';
            const anotherOrganizationId = databaseBuilder.factory.buildOrganization().id;
            const existingOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({
              organizationId: databaseBuilder.factory.buildOrganization().id,
              nationalStudentId,
              birthdate: '2000-01-01',
              userId: databaseBuilder.factory.buildUser().id,
            });
            await databaseBuilder.commit();

            const importedOrganizationLearners = [
              new OrganizationLearner({
                lastName: 'Pipeau',
                firstName: 'Peaupi',
                birthdate: '2003-01-01',
                nationalStudentId,
                userId: null,
                isDisabled: false,
                organizationId: anotherOrganizationId,
              }),
            ];

            // when
            await DomainTransaction.execute((domainTransaction: $TSFixMe) => {
              return organizationLearnerRepository.addOrUpdateOrganizationOfOrganizationLearners(
                importedOrganizationLearners,
                anotherOrganizationId,
                domainTransaction
              );
            });

            // then
            const existingOrganizationLearners = await organizationLearnerRepository.findByIds({
              ids: [existingOrganizationLearner.id],
            });
            expect(existingOrganizationLearners).to.have.length(1);
            expect(existingOrganizationLearner).to.deep.contain(existingOrganizationLearners[0]);

            const [newOrganizationLearner] = await organizationLearnerRepository.findByOrganizationId({
              organizationId: anotherOrganizationId,
            });
            expect(newOrganizationLearner).to.not.be.null;
            expect(newOrganizationLearner.userId).to.be.null;
            expect(newOrganizationLearner.id).to.not.equal(existingOrganizationLearner.id);
            expect(newOrganizationLearner.organizationId).to.equal(anotherOrganizationId);
            expect(newOrganizationLearner.nationalStudentId).to.equal(existingOrganizationLearner.nationalStudentId);
            expect(newOrganizationLearner.birthdate).to.not.equal(existingOrganizationLearner.birthdate);
          });
        });
      }
    );

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are only organizationLearners to create', function () {
      let organizationLearners: $TSFixMe;
      let organizationId: $TSFixMe;
      let firstOrganizationLearner: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        organizationId = databaseBuilder.factory.buildOrganization().id;
        await databaseBuilder.commit();

        firstOrganizationLearner = new OrganizationLearner({
          lastName: 'Pipeau',
          preferredLastName: 'Toto',
          firstName: 'Corinne',
          middleName: 'Dorothée',
          thirdName: 'Driss',
          sex: 'F',
          birthdate: '2000-01-01',
          birthCity: 'Perpi',
          birthCityCode: '123456',
          birthProvinceCode: '66',
          birthCountryCode: '100',
          MEFCode: 'MEF123456',
          status: 'ST',
          nationalStudentId: null,
          division: '4B',
          userId: null,
          isDisabled: false,
          organizationId,
        });

        organizationLearners = [firstOrganizationLearner];
      });

      // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
      afterEach(function () {
        return knex('organization-learners').delete();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should create all organizationLearners', async function () {
        // when
        await DomainTransaction.execute((domainTransaction: $TSFixMe) => {
          return organizationLearnerRepository.addOrUpdateOrganizationOfOrganizationLearners(
            organizationLearners,
            organizationId,
            domainTransaction
          );
        });

        // then
        const actualOrganizationLearners = await organizationLearnerRepository.findByOrganizationId({
          organizationId,
        });
        expect(actualOrganizationLearners).to.have.length(1);
        expect(_.omit(actualOrganizationLearners[0], ['updatedAt', 'id'])).to.deep.equal(
          _.omit(firstOrganizationLearner, ['updatedAt', 'id'])
        );
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are only organizationLearners to update', function () {
      let firstOrganizationLearner: $TSFixMe;
      let organizationId: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        organizationId = databaseBuilder.factory.buildOrganization().id;
        firstOrganizationLearner = {
          firstName: 'Lucy',
          lastName: 'Handmade',
          birthdate: '1990-12-31',
          nationalStudentId: 'INE1',
          organizationId,
        };

        databaseBuilder.factory.buildOrganizationLearner(firstOrganizationLearner);

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when an organizationLearner is already imported', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should update organizationLearners attributes', async function () {
          // given
          const organizationLearners = [
            new OrganizationLearner({
              firstName: 'Boba',
              lastName: 'Fett',
              birthdate: '1986-01-05',
              nationalStudentId: 'INE1',
              status: firstOrganizationLearner.status,
              organizationId,
            }),
          ];

          // when
          await DomainTransaction.execute((domainTransaction: $TSFixMe) => {
            return organizationLearnerRepository.addOrUpdateOrganizationOfOrganizationLearners(
              organizationLearners,
              organizationId,
              domainTransaction
            );
          });

          // then
          const [updatedOrganizationLearner] = await knex('organization-learners').where({
            organizationId,
          });

          expect(updatedOrganizationLearner).to.not.be.null;
          expect(updatedOrganizationLearner.firstName).to.be.equal(organizationLearners[0].firstName);
          expect(updatedOrganizationLearner.lastName).to.be.equal(organizationLearners[0].lastName);
          expect(updatedOrganizationLearner.birthdate).to.be.equal(organizationLearners[0].birthdate);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when an organizationLearner is already imported in several organizations', function () {
        let firstUpdatedOrganizationLearner: $TSFixMe;
        let otherFirstOrganizationLearner: $TSFixMe;
        let otherOrganizationId: $TSFixMe;
        let organizationLearners: $TSFixMe;

        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          otherOrganizationId = databaseBuilder.factory.buildOrganization().id;
          otherFirstOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({
            firstName: 'Lucie',
            lastName: 'Handmad',
            birthdate: '1990-12-31',
            nationalStudentId: firstOrganizationLearner.nationalStudentId,
            status: firstOrganizationLearner.status,
            organizationId: otherOrganizationId,
          });

          await databaseBuilder.commit();

          firstUpdatedOrganizationLearner = new OrganizationLearner({
            firstName: 'Lili',
            lastName: firstOrganizationLearner.lastName,
            birthdate: firstOrganizationLearner.birthdate,
            nationalStudentId: firstOrganizationLearner.nationalStudentId,
            organizationId,
            status: firstOrganizationLearner.status,
          });

          organizationLearners = [firstUpdatedOrganizationLearner];
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should update the organizationLearner only in the organization that imports the file', async function () {
          // when
          await DomainTransaction.execute((domainTransaction: $TSFixMe) => {
            return organizationLearnerRepository.addOrUpdateOrganizationOfOrganizationLearners(
              organizationLearners,
              organizationId,
              domainTransaction
            );
          });

          // then
          const [updatedOrganizationLearner] = await knex('organization-learners').where({
            organizationId,
          });
          const [notUpdatedOrganizationLearner] = await knex('organization-learners').where({
            organizationId: otherOrganizationId,
          });

          expect(updatedOrganizationLearner).to.not.be.null;
          expect(updatedOrganizationLearner.firstName).to.equal(firstUpdatedOrganizationLearner.firstName);
          expect(updatedOrganizationLearner.lastName).to.equal(firstUpdatedOrganizationLearner.lastName);
          expect(updatedOrganizationLearner.birthdate).to.equal(firstUpdatedOrganizationLearner.birthdate);

          expect(notUpdatedOrganizationLearner).to.not.be.null;
          expect(notUpdatedOrganizationLearner.firstName).to.equal(otherFirstOrganizationLearner.firstName);
          expect(notUpdatedOrganizationLearner.lastName).to.equal(otherFirstOrganizationLearner.lastName);
          expect(notUpdatedOrganizationLearner.birthdate).to.equal(otherFirstOrganizationLearner.birthdate);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when an organization learner disabled already exists', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should enable the updated organization learner', async function () {
          // given
          const organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
            nationalStudentId: 'INE1',
            isDisabled: true,
          });
          const { id, organizationId } = organizationLearner;
          await databaseBuilder.commit();

          // when
          await DomainTransaction.execute((domainTransaction: $TSFixMe) => {
            return organizationLearnerRepository.addOrUpdateOrganizationOfOrganizationLearners(
              [organizationLearner],
              organizationId,
              domainTransaction
            );
          });

          // then
          const expectedEnabled = await knex('organization-learners').where({ id }).first();

          expect(expectedEnabled.isDisabled).to.be.false;
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when an organizationLearner is saved with a userId already present in organization', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should save the organization learner with userId as null', async function () {
        const { id: organizationId } = databaseBuilder.factory.buildOrganization();
        const { id: userId } = databaseBuilder.factory.buildUser();
        databaseBuilder.factory.buildOrganizationLearner({
          nationalStudentId: 'INE1',
          userId,
        });
        databaseBuilder.factory.buildOrganizationLearner({
          nationalStudentId: 'INE2',
          organizationId: organizationId,
          userId,
        });
        await databaseBuilder.commit();

        // when
        const organizationLearner = domainBuilder.buildOrganizationLearner({ nationalStudentId: 'INE1' });
        await DomainTransaction.execute((domainTransaction: $TSFixMe) => {
          return organizationLearnerRepository.addOrUpdateOrganizationOfOrganizationLearners(
            [organizationLearner],
            organizationId,
            domainTransaction
          );
        });

        // then
        const expected = await knex('organization-learners')
          .where({ nationalStudentId: 'INE1', organizationId: organizationId })
          .first();

        expect(expected.userId).to.be.null;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should update the organization learner with userId as null', async function () {
        const { id: organizationId } = databaseBuilder.factory.buildOrganization();
        const { id: userId } = databaseBuilder.factory.buildUser();
        databaseBuilder.factory.buildOrganizationLearner({
          nationalStudentId: 'INE1',
          userId,
        });
        databaseBuilder.factory.buildOrganizationLearner({
          nationalStudentId: 'INE2',
          organizationId: organizationId,
          userId,
        });
        databaseBuilder.factory.buildOrganizationLearner({
          nationalStudentId: 'INE1',
          organizationId: organizationId,
          userId: null,
        });
        await databaseBuilder.commit();

        // when
        const organizationLearner = domainBuilder.buildOrganizationLearner({ nationalStudentId: 'INE1' });
        await DomainTransaction.execute((domainTransaction: $TSFixMe) => {
          return organizationLearnerRepository.addOrUpdateOrganizationOfOrganizationLearners(
            [organizationLearner],
            organizationId,
            domainTransaction
          );
        });

        // then
        const expected = await knex('organization-learners')
          .where({ nationalStudentId: 'INE1', organizationId: organizationId })
          .first();

        expect(expected.userId).to.be.null;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when several imported organization learners are reconciled with the same userId', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should save both organization learners with userId as null', async function () {
        const { id: organizationId } = databaseBuilder.factory.buildOrganization();
        const { id: userId } = databaseBuilder.factory.buildUser();
        databaseBuilder.factory.buildOrganizationLearner({
          nationalStudentId: 'INE1',
          userId,
        });
        databaseBuilder.factory.buildOrganizationLearner({
          nationalStudentId: 'INE2',
          userId,
        });
        await databaseBuilder.commit();

        // when
        const organizationLearner1 = domainBuilder.buildOrganizationLearner({ nationalStudentId: 'INE1' });
        const organizationLearner2 = domainBuilder.buildOrganizationLearner({ nationalStudentId: 'INE2' });
        await DomainTransaction.execute((domainTransaction: $TSFixMe) => {
          return organizationLearnerRepository.addOrUpdateOrganizationOfOrganizationLearners(
            [organizationLearner1, organizationLearner2],
            organizationId,
            domainTransaction
          );
        });

        // then
        const expected1 = await knex('organization-learners')
          .where({ nationalStudentId: 'INE1', organizationId })
          .first();
        const expected2 = await knex('organization-learners')
          .where({ nationalStudentId: 'INE2', organizationId })
          .first();

        expect(expected1.userId).to.be.null;
        expect(expected2.userId).to.be.null;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are organizationLearners in another organization', function () {
      let organizationLearners: $TSFixMe;
      let organizationId: $TSFixMe;
      let organizationLearnerFromFile: $TSFixMe;
      let userId: $TSFixMe;
      let nationalStudentId: $TSFixMe;
      const birthdate = '1990-12-31';

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        userId = databaseBuilder.factory.buildUser().id;
        nationalStudentId = 'salut';
        organizationId = databaseBuilder.factory.buildOrganization().id;
        const otherOrganizationId = databaseBuilder.factory.buildOrganization().id;
        databaseBuilder.factory.buildOrganizationLearner({
          organizationId: otherOrganizationId,
          nationalStudentId,
        });
        await databaseBuilder.commit();

        organizationLearnerFromFile = new OrganizationLearner({
          firstName: 'Lucy',
          lastName: 'Handmade',
          birthdate,
          nationalStudentId,
          organizationId,
        });

        organizationLearners = [organizationLearnerFromFile];
      });

      // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
      afterEach(function () {
        return knex('organization-learners').delete();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should create organizationLearner and reconcile it with the help of another organizationLearner', async function () {
        // given
        databaseBuilder.factory.buildOrganizationLearner({ nationalStudentId, birthdate, userId });
        databaseBuilder.factory.buildCertificationCourse({ userId });
        await databaseBuilder.commit();

        // when
        await DomainTransaction.execute((domainTransaction: $TSFixMe) => {
          return organizationLearnerRepository.addOrUpdateOrganizationOfOrganizationLearners(
            organizationLearners,
            organizationId,
            domainTransaction
          );
        });

        // then
        const newOrganizationLearner = await knex('organization-learners').where({
          organizationId,
          nationalStudentId,
        });
        expect(newOrganizationLearner[0].userId).to.equal(userId);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should update and reconcile organizationLearner with the help of another organizationLearner', async function () {
        // given
        databaseBuilder.factory.buildOrganizationLearner({
          organizationId,
          nationalStudentId,
          birthdate,
          userId: null,
        });
        databaseBuilder.factory.buildOrganizationLearner({ nationalStudentId, birthdate, userId });
        databaseBuilder.factory.buildCertificationCourse({ userId });
        await databaseBuilder.commit();

        // when
        await DomainTransaction.execute((domainTransaction: $TSFixMe) => {
          return organizationLearnerRepository.addOrUpdateOrganizationOfOrganizationLearners(
            organizationLearners,
            organizationId,
            domainTransaction
          );
        });

        // then
        const newOrganizationLearner = await knex('organization-learners')
          .where({ organizationId, nationalStudentId })
          .first();
        expect(newOrganizationLearner.userId).to.equal(userId);
        expect(newOrganizationLearner.firstName).to.equal(organizationLearnerFromFile.firstName);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when userId is already defined for an organizationLearner', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should update organizationLearner but not override userId', async function () {
          // given
          const expectedUserId = databaseBuilder.factory.buildOrganizationLearner({
            organizationId,
            nationalStudentId,
          }).userId;
          await databaseBuilder.commit();

          // when
          await DomainTransaction.execute((domainTransaction: $TSFixMe) => {
            return organizationLearnerRepository.addOrUpdateOrganizationOfOrganizationLearners(
              organizationLearners,
              organizationId,
              domainTransaction
            );
          });

          // then
          const alreadyReconciledOrganizationLearners = await knex('organization-learners')
            .where({
              nationalStudentId: organizationLearnerFromFile.nationalStudentId,
              organizationId: organizationId,
            })
            .first();
          expect(alreadyReconciledOrganizationLearners.userId).to.equal(expectedUserId);
          expect(alreadyReconciledOrganizationLearners.firstName).to.equal(organizationLearnerFromFile.firstName);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are organizationLearners to create and organizationLearners to update', function () {
      let organizationLearners: $TSFixMe;
      let organizationId: $TSFixMe;
      let organizationLearnerToCreate: $TSFixMe, organizationLearnerUpdated: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        organizationId = databaseBuilder.factory.buildOrganization().id;
        databaseBuilder.factory.buildOrganizationLearner({
          firstName: 'Lucy',
          lastName: 'Handmade',
          birthdate: '1990-12-31',
          nationalStudentId: 'INE1',
          organizationId,
        });
        await databaseBuilder.commit();

        organizationLearnerUpdated = new OrganizationLearner({
          firstName: 'Lucy',
          lastName: 'Handmade',
          birthdate: '1990-12-31',
          nationalStudentId: 'INE1',
          organizationId,
        });

        organizationLearnerToCreate = new OrganizationLearner({
          firstName: 'Harry',
          lastName: 'Covert',
          birthdate: '1990-01-01',
          nationalStudentId: 'INE2',
          organizationId,
        });

        organizationLearners = [organizationLearnerUpdated, organizationLearnerToCreate];
      });

      // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
      afterEach(function () {
        return knex('organization-learners').delete();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should update and create all organizationLearners', async function () {
        // when
        await DomainTransaction.execute((domainTransaction: $TSFixMe) => {
          return organizationLearnerRepository.addOrUpdateOrganizationOfOrganizationLearners(
            organizationLearners,
            organizationId,
            domainTransaction
          );
        });

        // then
        const actualOrganizationLearners = await knex('organization-learners').where({ organizationId });
        expect(actualOrganizationLearners).to.have.lengthOf(2);

        expect(_.map(actualOrganizationLearners, 'firstName')).to.have.members([
          organizationLearnerUpdated.firstName,
          organizationLearnerToCreate.firstName,
        ]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when an error occurs', function () {
      let organizationLearners: $TSFixMe;
      let organizationId: $TSFixMe;
      let firstOrganizationLearner, secondOrganizationLearner;
      const sameNationalStudentId = 'SAMEID123';

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        organizationId = databaseBuilder.factory.buildOrganization().id;
        await databaseBuilder.commit();

        firstOrganizationLearner = new OrganizationLearner({
          firstName: 'Lucy',
          lastName: 'Handmade',
          birthdate: '1990-12-31',
          nationalStudentId: sameNationalStudentId,
          organizationId,
        });

        secondOrganizationLearner = new OrganizationLearner({
          firstName: 'Harry',
          lastName: 'Covert',
          birthdate: '1990-01-01',
          nationalStudentId: sameNationalStudentId,
          organizationId,
        });

        organizationLearners = [firstOrganizationLearner, secondOrganizationLearner];
      });

      // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
      afterEach(function () {
        return knex('organization-learners').delete();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a OrganizationLearnersCouldNotBeSavedError on unicity errors', async function () {
        // when
        let error;
        await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          error = await catchErr(
            organizationLearnerRepository.addOrUpdateOrganizationOfOrganizationLearners,
            organizationLearnerRepository
          )(organizationLearners, organizationId, domainTransaction);
        });

        // then
        expect(error).to.be.instanceof(OrganizationLearnersCouldNotBeSavedError);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a OrganizationLearnersCouldNotBeSavedError', async function () {
        // when
        let error;
        await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          error = await catchErr(
            organizationLearnerRepository.addOrUpdateOrganizationOfOrganizationLearners,
            organizationLearnerRepository
          )([{ nationalStudentId: 'something' }], organizationId, domainTransaction);
        });

        // then
        expect(error).to.be.instanceof(OrganizationLearnersCouldNotBeSavedError);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('whenever an organization-learner is updated', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should update the updatedAt column in row', async function () {
        // given
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        const baseOrganizationLearner = {
          firstName: 'Lucy',
          lastName: 'Handmade',
          birthdate: '1990-12-31',
          nationalStudentId: 'INE1',
          organizationId,
        };
        const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner(baseOrganizationLearner).id;
        await databaseBuilder.commit();
        await knex('organization-learners')
          .update({ updatedAt: new Date('2019-01-01') })
          .where({ id: organizationLearnerId });
        const { updatedAt: beforeUpdatedAt } = await knex
          .select('updatedAt')
          .from('organization-learners')
          .where({ id: organizationLearnerId })
          .first();

        const organizationLearner_updated = new OrganizationLearner({
          ...baseOrganizationLearner,
          firstName: 'Lili',
        });

        // when
        await DomainTransaction.execute((domainTransaction: $TSFixMe) => {
          return organizationLearnerRepository.addOrUpdateOrganizationOfOrganizationLearners(
            [organizationLearner_updated],
            organizationId,
            domainTransaction
          );
        });

        // then
        const { updatedAt: afterUpdatedAt } = await knex
          .select('updatedAt')
          .from('organization-learners')
          .where({ id: organizationLearnerId })
          .first();

        expect(afterUpdatedAt).to.be.above(beforeUpdatedAt);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when an error occurs during transaction', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should rollback', async function () {
        // given
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        const organizationLearner = new OrganizationLearner({ organizationId });

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        await catchErr(async () => {
          await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
            await organizationLearnerRepository.addOrUpdateOrganizationOfOrganizationLearners(
              [organizationLearner],
              organizationId,
              domainTransaction
            );
            throw new Error('an error occurs within the domain transaction');
          });
        });

        // then
        const organizationLearners = await knex.from('organization-learners');
        expect(organizationLearners).to.deep.equal([]);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByOrganizationIdAndBirthdate', function () {
    let organization: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      organization = databaseBuilder.factory.buildOrganization();
      databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        userId: null,
        preferredLastName: 'Lee',
        lastName: 'Lieber',
        firstName: 'Stanley',
        middleName: 'Martin',
        thirdName: 'Stan',
        birthdate: '2000-03-31',
        studentNumber: '123A',
        isDisabled: false,
      });
      databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        userId: null,
        lastName: 'See',
        firstName: 'Johnny',
        birthdate: '2000-03-31',
        studentNumber: '456A',
        isDisabled: false,
      });
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return found organizationLearners with birthdate', async function () {
      // given
      const birthdate = '2000-03-31';

      // when
      const result = await organizationLearnerRepository.findByOrganizationIdAndBirthdate({
        organizationId: organization.id,
        birthdate,
      });

      // then
      expect(result.length).to.be.equal(2);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return empty array when there are no active organization-learners', async function () {
      // given
      const birthdate = '2001-01-01';
      databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        userId: null,
        lastName: 'Stark',
        firstName: 'Anthony',
        birthdate,
        studentNumber: '006A',
        isDisabled: true,
      });
      await databaseBuilder.commit();

      // when
      const result = await organizationLearnerRepository.findByOrganizationIdAndBirthdate({
        organizationId: organization.id,
        birthdate,
      });

      // then
      expect(result.length).to.be.equal(0);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return empty array when there are no organization-learners with the given birthdate', async function () {
      // given
      const birthdate = '2001-03-31';

      // when
      const result = await organizationLearnerRepository.findByOrganizationIdAndBirthdate({
        organizationId: organization.id,
        birthdate,
      });

      // then
      expect(result.length).to.be.equal(0);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return empty array when there is no organization-learners with the given organizationId', async function () {
      // given
      const birthdate = '2000-03-31';

      // when
      const result = await organizationLearnerRepository.findByOrganizationIdAndBirthdate({
        organizationId: '999',
        birthdate,
      });

      // then
      expect(result.length).to.be.equal(0);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#dissociateUserFromOrganizationLearner', function () {
    let organizationLearner: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      const user = databaseBuilder.factory.buildUser();
      organizationLearner = databaseBuilder.factory.buildOrganizationLearner({ userId: user.id });
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should delete association between user and organizationLearner', async function () {
      // when
      await organizationLearnerRepository.dissociateUserFromOrganizationLearner(organizationLearner.id);

      // then
      const organizationLearnerPatched = await organizationLearnerRepository.get(organizationLearner.id);
      expect(organizationLearnerPatched.userId).to.equal(null);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#reconcileUserToOrganizationLearner', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('organization-learners').delete();
    });

    let organization: $TSFixMe;
    let organizationLearner: $TSFixMe;
    let user: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      organization = databaseBuilder.factory.buildOrganization();
      organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        userId: null,
        firstName: 'Steeve',
        lastName: 'Roger',
      });
      user = databaseBuilder.factory.buildUser({ firstName: 'Steeve', lastName: 'Roger' });
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save association between user and organizationLearner', async function () {
      // when
      const organizationLearnerPatched = await organizationLearnerRepository.reconcileUserToOrganizationLearner({
        userId: user.id,
        organizationLearnerId: organizationLearner.id,
      });

      // then
      expect(organizationLearnerPatched).to.be.instanceof(OrganizationLearner);
      expect(organizationLearnerPatched.userId).to.equal(user.id);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an error when we don’t find the organizationLearner to update', async function () {
      // given
      const fakeStudentId = 1;

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(organizationLearnerRepository.reconcileUserToOrganizationLearner)({
        userId: user.id,
        organizationLearnerId: fakeStudentId,
      });

      // then
      expect(error).to.be.instanceOf(UserCouldNotBeReconciledError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an error when the userId to link don’t match a user', async function () {
      // given
      const fakeUserId = 1;

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(organizationLearnerRepository.reconcileUserToOrganizationLearner)({
        userId: fakeUserId,
        organizationLearnerId: organizationLearner.id,
      });

      // then
      expect(error).to.be.instanceOf(UserCouldNotBeReconciledError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an error when the organization learner is disabled', async function () {
      // given
      const disabledOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        userId: null,
        isDisabled: true,
      });

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(organizationLearnerRepository.reconcileUserToOrganizationLearner)({
        userId: user.id,
        organizationLearnerId: disabledOrganizationLearner.id,
      });

      // then
      expect(error).to.be.instanceOf(UserCouldNotBeReconciledError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#reconcileUserAndOrganization', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('organization-learners').delete();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the organizationLearner is active', function () {
      let organization: $TSFixMe;
      let organizationLearner: $TSFixMe;
      let user: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        organization = databaseBuilder.factory.buildOrganization();
        organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
          organizationId: organization.id,
          userId: null,
          firstName: 'Steeve',
          lastName: 'Roger',
          isDisabled: false,
        });
        user = databaseBuilder.factory.buildUser({ firstName: 'Steeve', lastName: 'Roger' });
        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should save association between user and organization', async function () {
        // when
        const organizationLearnerPatched =
          await organizationLearnerRepository.reconcileUserByNationalStudentIdAndOrganizationId({
            userId: user.id,
            nationalStudentId: organizationLearner.nationalStudentId,
            organizationId: organization.id,
          });

        // then
        expect(organizationLearnerPatched).to.be.instanceof(OrganizationLearner);
        expect(organizationLearnerPatched.userId).to.equal(user.id);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an error when we don’t find the organizationLearner for this organization to update', async function () {
        // given
        const fakeOrganizationId = 1;

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(organizationLearnerRepository.reconcileUserByNationalStudentIdAndOrganizationId)({
          userId: user.id,
          nationalStudentId: organizationLearner.nationalStudentId,
          organizationId: fakeOrganizationId,
        });

        // then
        expect(error).to.be.instanceof(UserCouldNotBeReconciledError);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an error when we don’t find the organizationLearner for this nationalStudentId to update', async function () {
        // given
        const fakeNationalStudentId = 1;

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(organizationLearnerRepository.reconcileUserByNationalStudentIdAndOrganizationId)({
          userId: user.id,
          nationalStudentId: fakeNationalStudentId,
          organizationId: organization.id,
        });

        // then
        expect(error).to.be.instanceof(UserCouldNotBeReconciledError);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an error when the userId to link don’t match a user', async function () {
        // given
        const fakeUserId = 1;

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(organizationLearnerRepository.reconcileUserByNationalStudentIdAndOrganizationId)({
          userId: fakeUserId,
          nationalStudentId: organizationLearner.nationalStudentId,
          organizationId: organization.id,
        });

        // then
        expect(error).to.be.instanceof(UserCouldNotBeReconciledError);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the organizationLearner is disabled', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an error', async function () {
        const { id: organizationId } = databaseBuilder.factory.buildOrganization();
        const { id: userId } = databaseBuilder.factory.buildUser({ firstName: 'Natasha', lastName: 'Romanoff' });
        const organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
          organizationId,
          userId: null,
          firstName: 'Natasha',
          lastName: 'Romanoff',
          isDisabled: true,
        });
        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(organizationLearnerRepository.reconcileUserByNationalStudentIdAndOrganizationId)({
          userId,
          nationalStudentId: organizationLearner.nationalStudentId,
          organizationId,
        });

        // then
        expect(error).to.be.instanceof(UserCouldNotBeReconciledError);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findOneByUserIdAndOrganizationId', function () {
    let userId: $TSFixMe;
    let organizationId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      organizationId = databaseBuilder.factory.buildOrganization().id;
      userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildOrganizationLearner({ organizationId, userId });
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return instance of OrganizationLearner linked to the given userId and organizationId', async function () {
      // when
      const organizationLearner = await organizationLearnerRepository.findOneByUserIdAndOrganizationId({
        userId,
        organizationId,
      });

      // then
      expect(organizationLearner).to.be.an.instanceOf(OrganizationLearner);
      expect(organizationLearner.userId).to.equal(userId);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null if there is no organizationLearner linked to the given userId', async function () {
      // given
      const otherUserId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();

      // when
      const result = await organizationLearnerRepository.findOneByUserIdAndOrganizationId({
        userId: otherUserId,
        organizationId,
      });

      // then
      expect(result).to.equal(null);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null if there is no organizationLearner linked to the given organizationId', async function () {
      // given
      const otherOrganizationId = databaseBuilder.factory.buildOrganization().id;
      await databaseBuilder.commit();

      // when
      const result = await organizationLearnerRepository.findOneByUserIdAndOrganizationId({
        userId,
        organizationId: otherOrganizationId,
      });

      // then
      expect(result).to.equal(null);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    let organizationLearnerId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner().id;
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an instance of OrganizationLearner', async function () {
      // when
      const organizationLearner = await organizationLearnerRepository.get(organizationLearnerId);

      // then
      expect(organizationLearner).to.be.an.instanceOf(OrganizationLearner);
      expect(organizationLearner.id).to.equal(organizationLearnerId);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a NotFoundError if no organizationLearner is found', async function () {
      // given
      const nonExistentStudentId = 678;

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(organizationLearnerRepository.get)(nonExistentStudentId);

      // then
      expect(result).to.be.instanceOf(NotFoundError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getOrganizationLearnerForAdmin', function () {
    let organizationLearnerId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner().id;
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an instance of OrganizationLearnerForAdmin', async function () {
      // when
      const organizationLearner = await organizationLearnerRepository.getOrganizationLearnerForAdmin(
        organizationLearnerId
      );

      // then
      expect(organizationLearner).to.be.an.instanceOf(OrganizationLearnerForAdmin);
      expect(organizationLearner.id).to.equal(organizationLearnerId);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a NotFoundError if no organizationLearner is found', async function () {
      // given
      const nonExistentOrganizationLearnerId = 678;

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(organizationLearnerRepository.getOrganizationLearnerForAdmin)(
        nonExistentOrganizationLearnerId
      );

      // then
      expect(result).to.be.instanceOf(NotFoundError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getLatestOrganizationLearner', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the latest organization learner', async function () {
      // given
      const expectedUserId = databaseBuilder.factory.buildUser().id;
      const latestOrganizationId = databaseBuilder.factory.buildOrganization({ id: 1 }).id;
      const oldestOrganizationId = databaseBuilder.factory.buildOrganization({ id: 3 }).id;

      const studentInformation = {
        ine: '123456789AA',
        birthdate: '2000-12-07',
      };
      databaseBuilder.factory.buildOrganizationLearner({
        id: 1,
        organizationId: latestOrganizationId,
        userId: expectedUserId,
        birthdate: studentInformation.birthdate,
        nationalStudentId: studentInformation.ine,
        updatedAt: new Date('2013-01-01T15:00:00Z'),
      });
      databaseBuilder.factory.buildOrganizationLearner({
        id: 80,
        organizationId: oldestOrganizationId,
        userId: expectedUserId,
        birthdate: studentInformation.birthdate,
        nationalStudentId: studentInformation.ine,
        updatedAt: new Date('2000-01-01T15:00:00Z'),
      });

      await databaseBuilder.commit();

      // when
      const organizationLearner = await organizationLearnerRepository.getLatestOrganizationLearner({
        birthdate: studentInformation.birthdate,
        nationalStudentId: studentInformation.ine,
      });

      // then
      expect(organizationLearner.organizationId).to.equal(1);
      expect(organizationLearner.id).to.equal(1);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a UserNotFoundError if INE is invalid', async function () {
      // given
      const studentInformation = {
        ine: '123456789AB',
        birthdate: '2000-12-07',
      };
      databaseBuilder.factory.buildOrganizationLearner({
        birthdate: studentInformation.birthdate,
        nationalStudentId: studentInformation.ine,
      });

      await databaseBuilder.commit();

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(organizationLearnerRepository.getLatestOrganizationLearner)({
        nationalStudentId: '222256789AB',
        birthdate: '2000-12-07',
      });

      // then
      expect(result).to.be.instanceOf(UserNotFoundError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a UserNotFoundError if userId is null', async function () {
      // given
      const studentInformation = {
        ine: '123456789AB',
        birthdate: '2000-12-07',
      };
      databaseBuilder.factory.buildOrganizationLearner({
        birthdate: studentInformation.birthdate,
        nationalStudentId: studentInformation.ine,
        userId: null,
      });

      await databaseBuilder.commit();

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(organizationLearnerRepository.getLatestOrganizationLearner)({
        nationalStudentId: '123456789AB',
        birthdate: '2000-12-07',
      });

      // then
      expect(result).to.be.instanceOf(UserNotFoundError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findPaginatedFilteredOrganizationLearners', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return instances of UserWithOrganizationLearner', async function () {
      // given
      const organization = databaseBuilder.factory.buildOrganization();
      databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        userId: null,
      });
      await databaseBuilder.commit();

      // when
      const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
        organizationId: organization.id,
      });

      // then
      expect(data[0]).to.be.an.instanceOf(UserWithOrganizationLearner);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return all the UserWithOrganizationLearner for a given organization ID', async function () {
      // given
      const organization_1 = databaseBuilder.factory.buildOrganization();
      const organization_2 = databaseBuilder.factory.buildOrganization();

      const user = databaseBuilder.factory.buildUser();

      const firstOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization_1.id,
      });
      const secondOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization_1.id,
        userId: user.id,
      });
      databaseBuilder.factory.buildOrganizationLearner({ organizationId: organization_2.id });

      await databaseBuilder.commit();

      // when
      const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
        organizationId: organization_1.id,
      });

      // then
      expect(_.map(data, 'id')).to.have.members([firstOrganizationLearner.id, secondOrganizationLearner.id]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return only once the same organization learner', async function () {
      // given
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const campaignId = databaseBuilder.factory.buildCampaign({ organizationId, name: 'some campaign' }).id;
      const otherCampaignId = databaseBuilder.factory.buildCampaign({ organizationId, name: 'other campaign' }).id;
      const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({ organizationId }).id;

      databaseBuilder.factory.buildCampaignParticipation({ campaignId, organizationLearnerId });
      databaseBuilder.factory.buildCampaignParticipation({ campaignId: otherCampaignId, organizationLearnerId });
      await databaseBuilder.commit();

      // when
      const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
        organizationId,
      });

      // then

      expect(data).to.have.lengthOf(1);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the organization learners not disabled', async function () {
      // given
      const organization = databaseBuilder.factory.buildOrganization();
      const organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        isDisabled: false,
        organizationId: organization.id,
      });
      databaseBuilder.factory.buildOrganizationLearner({ isDisabled: true, organizationId: organization.id });
      await databaseBuilder.commit();

      // when
      const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
        organizationId: organization.id,
      });

      // then
      expect(data).to.have.lengthOf(1);
      expect(data[0].id).to.equal(organizationLearner.id);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should order organizationLearners by lastName and then by firstName with no sensitive case', async function () {
      // given
      const organization = databaseBuilder.factory.buildOrganization();

      const firstOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        lastName: 'Grenier',
      });
      const secondOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        lastName: 'Avatar',
        firstName: 'Xavier',
      });
      const thirdOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        lastName: 'Avatar',
        firstName: 'Arthur',
      });
      const fourthOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        lastName: 'Avatar',
        firstName: 'MATHURIN',
      });

      await databaseBuilder.commit();

      // when
      const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
        organizationId: organization.id,
      });

      // then
      expect(_.map(data, 'id')).to.deep.include.ordered.members([
        thirdOrganizationLearner.id,
        fourthOrganizationLearner.id,
        secondOrganizationLearner.id,
        firstOrganizationLearner.id,
      ]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('When organizationLearner is filtered', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return organization learners filtered by lastname', async function () {
        // given
        const organization = databaseBuilder.factory.buildOrganization();

        databaseBuilder.factory.buildOrganizationLearner({ organizationId: organization.id, lastName: 'Grenier' });
        databaseBuilder.factory.buildOrganizationLearner({ organizationId: organization.id, lastName: 'Avatar' });
        databaseBuilder.factory.buildOrganizationLearner({ organizationId: organization.id, lastName: 'UvAtur' });
        await databaseBuilder.commit();

        // when
        const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
          organizationId: organization.id,
          filter: { lastName: 'Vat' },
        });

        // then
        expect(_.map(data, 'lastName')).to.deep.equal(['Avatar', 'UvAtur']);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return organization learners filtered by firstname', async function () {
        // given
        const organization = databaseBuilder.factory.buildOrganization();

        databaseBuilder.factory.buildOrganizationLearner({
          organizationId: organization.id,
          firstName: 'Foo',
          lastName: '1',
        });
        databaseBuilder.factory.buildOrganizationLearner({
          organizationId: organization.id,
          firstName: 'Bar',
          lastName: '2',
        });
        databaseBuilder.factory.buildOrganizationLearner({
          organizationId: organization.id,
          firstName: 'Baz',
          lastName: '3',
        });
        await databaseBuilder.commit();

        // when
        const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
          organizationId: organization.id,
          filter: { firstName: 'ba' },
        });

        // then
        expect(_.map(data, 'firstName')).to.deep.equal(['Bar', 'Baz']);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return organization learners filtered by student number', async function () {
        // given
        const organization = databaseBuilder.factory.buildOrganization();

        databaseBuilder.factory.buildOrganizationLearner({
          organizationId: organization.id,
          firstName: 'Foo',
          lastName: '1',
          studentNumber: 'FOO123',
        });
        databaseBuilder.factory.buildOrganizationLearner({
          organizationId: organization.id,
          firstName: 'Bar',
          lastName: '2',
          studentNumber: 'BAR123',
        });
        databaseBuilder.factory.buildOrganizationLearner({
          organizationId: organization.id,
          firstName: 'Baz',
          lastName: '3',
          studentNumber: 'BAZ123',
        });
        await databaseBuilder.commit();

        // when
        const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
          organizationId: organization.id,
          filter: { studentNumber: 'ba' },
        });

        // then
        expect(_.map(data, 'studentNumber')).to.deep.equal(['BAR123', 'BAZ123']);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return organization learners filtered by division', async function () {
        // given
        const organization = databaseBuilder.factory.buildOrganization();

        databaseBuilder.factory.buildOrganizationLearner({
          organizationId: organization.id,
          lastName: '1',
          division: '4A',
        });
        databaseBuilder.factory.buildOrganizationLearner({
          organizationId: organization.id,
          lastName: '2',
          division: '3B',
        });
        databaseBuilder.factory.buildOrganizationLearner({
          organizationId: organization.id,
          lastName: '3',
          division: '3A',
        });
        await databaseBuilder.commit();

        // when
        const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
          organizationId: organization.id,
          filter: { divisions: ['3A', '3B'] },
        });

        // then
        expect(_.map(data, 'division')).to.deep.equal(['3B', '3A']);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return organization learners filtered by group', async function () {
        // given
        const organization = databaseBuilder.factory.buildOrganization();

        databaseBuilder.factory.buildOrganizationLearner({
          organizationId: organization.id,
          lastName: '1',
          group: '4A',
        });
        databaseBuilder.factory.buildOrganizationLearner({
          organizationId: organization.id,
          lastName: '2',
          group: '3B',
        });
        databaseBuilder.factory.buildOrganizationLearner({
          organizationId: organization.id,
          lastName: '3',
          group: '3A',
        });
        await databaseBuilder.commit();

        // when
        const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
          organizationId: organization.id,
          filter: { groups: ['3A', '3B'] },
        });

        // then
        expect(_.map(data, 'group')).to.deep.equal(['3B', '3A']);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return organization learners filtered by firstname AND lastname', async function () {
        // given
        const organization = databaseBuilder.factory.buildOrganization();

        databaseBuilder.factory.buildOrganizationLearner({
          organizationId: organization.id,
          firstName: 'John',
          lastName: 'Rambo',
        });
        databaseBuilder.factory.buildOrganizationLearner({
          organizationId: organization.id,
          firstName: 'Jane',
          lastName: 'Rambo',
        });
        databaseBuilder.factory.buildOrganizationLearner({
          organizationId: organization.id,
          firstName: 'Chuck',
          lastName: 'Norris',
        });
        await databaseBuilder.commit();

        // when
        const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
          organizationId: organization.id,
          filter: { firstName: 'ja', lastName: 'ram' },
        });

        // then
        expect(_.map(data, 'firstName')).to.deep.equal(['Jane']);
      });

      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('When organizationLearner is filtered by user connexion type', function () {
        let organizationId: $TSFixMe;

        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          // given
          organizationId = databaseBuilder.factory.buildOrganization().id;

          databaseBuilder.factory.buildOrganizationLearnerWithUser({
            organizationId,
            lastName: 'Rambo',
            user: { email: 'john@rambo.com', username: null },
          });
          databaseBuilder.factory.buildOrganizationLearnerWithUser({
            organizationId,
            lastName: 'Willis',
            user: { email: null, username: 'willy' },
          });
          const organizationLearnerOfUserWithSamlId = databaseBuilder.factory.buildOrganizationLearnerWithUser({
            organizationId,
            lastName: 'Norris',
            user: { email: null, username: null },
          });
          databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
            externalIdentifier: 'chucky',
            userId: organizationLearnerOfUserWithSamlId.userId,
          });
          databaseBuilder.factory.buildOrganizationLearnerWithUser({
            organizationId,
            lastName: 'Lee',
            user: { email: null, username: null },
          });
          await databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return organization learners filtered by "none" user connexion', async function () {
          // when
          const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
            organizationId,
            filter: { connexionType: 'none' },
          });

          // then
          expect(_.map(data, 'lastName')).to.deep.equal(['Lee']);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return organization learners filtered by "identifiant" user connexion', async function () {
          // when
          const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
            organizationId,
            filter: { connexionType: 'identifiant' },
          });

          // then
          expect(_.map(data, 'lastName')).to.deep.equal(['Willis']);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return organization learners filtered by "email" user connexion', async function () {
          // when
          const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
            organizationId,
            filter: { connexionType: 'email' },
          });

          // then
          expect(_.map(data, 'lastName')).to.deep.equal(['Rambo']);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return organization learners filtered by "mediacentre" user connexion', async function () {
          // when
          const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
            organizationId,
            filter: { connexionType: 'mediacentre' },
          });

          // then
          expect(_.map(data, 'lastName')).to.deep.equal(['Norris']);
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return organization learners paginated', async function () {
        // given
        const organization = databaseBuilder.factory.buildOrganization();

        databaseBuilder.factory.buildOrganizationLearner({
          organizationId: organization.id,
          firstName: 'Foo',
          lastName: '1',
        });
        databaseBuilder.factory.buildOrganizationLearner({
          organizationId: organization.id,
          firstName: 'Bar',
          lastName: '2',
        });
        await databaseBuilder.commit();

        // when
        const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
          organizationId: organization.id,
          page: { number: 2, size: 1 },
        });

        // then
        expect(_.map(data, 'firstName')).to.deep.equal(['Bar']);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('When organizationLearner is reconciled and authenticated by email (and/or) username', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return all organizationLearner properties including the reconciled user:email,username', async function () {
        // given
        const organization = databaseBuilder.factory.buildOrganization();
        const user = databaseBuilder.factory.buildUser();
        const organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
          organizationId: organization.id,
          userId: user.id,
        });
        const expectedUserWithOrganizationLearner = new UserWithOrganizationLearner({
          id: organizationLearner.id,
          firstName: organizationLearner.firstName,
          lastName: organizationLearner.lastName,
          birthdate: organizationLearner.birthdate,
          organizationId: organizationLearner.organizationId,
          username: user.username,
          userId: organizationLearner.userId,
          email: user.email,
          isAuthenticatedFromGAR: false,
          studentNumber: organizationLearner.studentNumber,
          division: organizationLearner.division,
          group: organizationLearner.group,
          participationCount: 0,
          lastParticipationDate: null,
          campaignName: null,
          campaignType: null,
          participationStatus: null,
        });
        await databaseBuilder.commit();

        // when
        const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
          organizationId: organization.id,
        });

        // then
        expect(data[0]).to.deep.equal(expectedUserWithOrganizationLearner);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('When organizationLearner is reconciled  and  authenticated from GAR', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return isAuthenticatedFromGAR property equal to true', async function () {
        // given
        const organization = databaseBuilder.factory.buildOrganization();
        const user = databaseBuilder.factory.buildUser({
          username: null,
          email: null,
        });
        databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
          externalIdentifier: 'samlId',
          userId: user.id,
        });
        const organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
          organizationId: organization.id,
          userId: user.id,
        });
        const expectedUserWithOrganizationLearner = new UserWithOrganizationLearner({
          id: organizationLearner.id,
          firstName: organizationLearner.firstName,
          lastName: organizationLearner.lastName,
          birthdate: organizationLearner.birthdate,
          organizationId: organizationLearner.organizationId,
          username: null,
          email: null,
          userId: organizationLearner.userId,
          isAuthenticatedFromGAR: true,
          studentNumber: organizationLearner.studentNumber,
          division: organizationLearner.division,
          group: organizationLearner.group,
          participationCount: 0,
          lastParticipationDate: null,
          campaignName: null,
          campaignType: null,
          participationStatus: null,
        });
        await databaseBuilder.commit();

        // when
        const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
          organizationId: organization.id,
        });

        // then
        expect(data[0]).to.deep.equal(expectedUserWithOrganizationLearner);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('When organizationLearner is not reconciled', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return empty email, username, userId', async function () {
        // given
        const organization = databaseBuilder.factory.buildOrganization();
        const organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
          organizationId: organization.id,
          userId: null,
        });

        const expectedUserWithOrganizationLearner = new UserWithOrganizationLearner({
          id: organizationLearner.id,
          firstName: organizationLearner.firstName,
          lastName: organizationLearner.lastName,
          birthdate: organizationLearner.birthdate,
          organizationId: organizationLearner.organizationId,
          username: null,
          email: null,
          userId: organizationLearner.userId,
          isAuthenticatedFromGAR: false,
          studentNumber: organizationLearner.studentNumber,
          division: organizationLearner.division,
          group: organizationLearner.group,
          participationCount: 0,
          lastParticipationDate: null,
          campaignName: null,
          campaignType: null,
          participationStatus: null,
        });
        await databaseBuilder.commit();

        // when
        const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
          organizationId: organization.id,
        });

        // then
        expect(data[0]).to.deep.equal(expectedUserWithOrganizationLearner);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('campaign information', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return campaign name and type when there is at least a participation', async function () {
        // given
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        const campaignId = databaseBuilder.factory.buildCampaign({
          organizationId,
          name: 'some campaign name',
          type: CampaignTypes.PROFILES_COLLECTION,
        }).id;
        const userId = databaseBuilder.factory.buildUser().id;
        const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({ organizationId, userId }).id;
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, organizationLearnerId });
        await databaseBuilder.commit();

        const expectedAttributes = {
          campaignName: 'some campaign name',
          campaignType: CampaignTypes.PROFILES_COLLECTION,
        };

        // when
        const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
          organizationId,
        });

        // then
        expect(data[0].campaignName).to.deep.equal(expectedAttributes.campaignName);
        expect(data[0].campaignType).to.deep.equal(expectedAttributes.campaignType);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return null when there is no participation', async function () {
        // given
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        const userId = databaseBuilder.factory.buildUser().id;
        databaseBuilder.factory.buildOrganizationLearner({ organizationId, userId });
        await databaseBuilder.commit();

        // when
        const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
          organizationId,
        });

        // then
        expect(data[0].campaignName).to.deep.equal(null);
        expect(data[0].campaignType).to.deep.equal(null);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return campaign name and type only for a campaign in the given organization', async function () {
        // given
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        const campaignId = databaseBuilder.factory.buildCampaign({
          name: 'some campaign name',
        }).id;
        const userId = databaseBuilder.factory.buildUser().id;
        const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({ organizationId, userId }).id;
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, organizationLearnerId });
        await databaseBuilder.commit();

        // when
        const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
          organizationId,
        });

        // then
        expect(data[0].campaignName).to.equal(null);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('#participationStatus', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return participation status when there is at least a participation', async function () {
        // given
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        const campaignId = databaseBuilder.factory.buildCampaign({
          organizationId,
          name: 'some campaign name',
          type: CampaignTypes.PROFILES_COLLECTION,
        }).id;
        const userId = databaseBuilder.factory.buildUser().id;
        const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({ organizationId, userId }).id;
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          organizationLearnerId,
          status: CampaignParticipationStatuses.TO_SHARE,
        });
        await databaseBuilder.commit();

        // when
        const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
          organizationId,
        });

        // then
        expect(data[0].participationStatus).to.deep.equal(CampaignParticipationStatuses.TO_SHARE);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return null when there is no participation', async function () {
        // given
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        const userId = databaseBuilder.factory.buildUser().id;
        databaseBuilder.factory.buildOrganizationLearner({ organizationId, userId });
        await databaseBuilder.commit();

        // when
        const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
          organizationId,
        });

        // then
        expect(data[0].participationStatus).to.deep.equal(null);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('#participationCount', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should count participations in several campaigns', async function () {
        // given
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        const campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
        const otherCampaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
        const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({ organizationId }).id;

        databaseBuilder.factory.buildCampaignParticipation({ campaignId, organizationLearnerId });
        databaseBuilder.factory.buildCampaignParticipation({ campaignId: otherCampaignId, organizationLearnerId });
        await databaseBuilder.commit();

        // when
        const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
          organizationId,
        });

        // then
        const participationCountAsArray = data.map((result: $TSFixMe) => result.participationCount);
        expect(participationCountAsArray).to.deep.equal([2]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should count only participations not deleted', async function () {
        // given
        const deletedBy = databaseBuilder.factory.buildUser().id;
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        const campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
        const otherCampaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
        const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({ organizationId }).id;

        databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          organizationLearnerId,
          deletedAt: null,
          deletedBy: null,
        });
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId: otherCampaignId,
          organizationLearnerId,
          deletedAt: new Date(),
          deletedBy,
        });
        await databaseBuilder.commit();

        // when
        const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
          organizationId,
        });

        // then
        const participationCountAsArray = data.map((result: $TSFixMe) => result.participationCount);
        expect(participationCountAsArray).to.deep.equal([1]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should count only participations not improved', async function () {
        // given
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        const campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
        const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({ organizationId }).id;

        databaseBuilder.factory.buildCampaignParticipation({ campaignId, organizationLearnerId, isImproved: true });
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, organizationLearnerId, isImproved: false });
        await databaseBuilder.commit();

        // when
        const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
          organizationId,
        });

        // then
        const participationCountAsArray = data.map((result: $TSFixMe) => result.participationCount);
        expect(participationCountAsArray).to.deep.equal([1]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should count 0 participation when organizationLearner has no participation', async function () {
        // given
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        databaseBuilder.factory.buildOrganizationLearner({ organizationId });
        await databaseBuilder.commit();

        // when
        const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
          organizationId,
        });

        // then
        const participationCountAsArray = data.map((result: $TSFixMe) => result.participationCount);
        expect(participationCountAsArray).to.deep.equal([0]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('#lastParticipationDate', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should take the last participation date', async function () {
        // given
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        const campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
        const otherCampaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
        const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({ organizationId }).id;

        const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          organizationLearnerId,
          createdAt: new Date('2022-01-01'),
        });
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId: otherCampaignId,
          organizationLearnerId,
          createdAt: new Date('2021-01-01'),
        });
        await databaseBuilder.commit();

        // when
        const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
          organizationId,
        });

        // then
        const lastParticipationDatesAsArray = data.map((result: $TSFixMe) => result.lastParticipationDate);
        expect(lastParticipationDatesAsArray).to.deep.equal([campaignParticipation.createdAt]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should take the last participation date not deleted', async function () {
        // given
        const deletedBy = databaseBuilder.factory.buildUser().id;
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        const campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
        const otherCampaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
        const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({ organizationId }).id;

        const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          organizationLearnerId,
          deletedAt: null,
          deletedBy: null,
          createdAt: new Date('2021-02-01'),
        });
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId: otherCampaignId,
          organizationLearnerId,
          deletedAt: new Date(),
          deletedBy,
          createdAt: new Date('2022-01-01'),
        });
        await databaseBuilder.commit();

        // when
        const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
          organizationId,
        });

        // then
        const lastParticipationDatesAsArray = data.map((result: $TSFixMe) => result.lastParticipationDate);
        expect(lastParticipationDatesAsArray).to.deep.equal([campaignParticipation.createdAt]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should take the last participation date not improved', async function () {
        // given
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        const campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
        const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({ organizationId }).id;

        databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          organizationLearnerId,
          isImproved: true,
          createdAt: new Date('2022-01-01'),
        });
        const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          organizationLearnerId,
          isImproved: false,
          createdAt: new Date('2021-01-01'),
        });
        await databaseBuilder.commit();

        // when
        const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
          organizationId,
        });

        // then
        const lastParticipationDatesAsArray = data.map((result: $TSFixMe) => result.lastParticipationDate);
        expect(lastParticipationDatesAsArray).to.deep.equal([campaignParticipation.createdAt]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should be null when organizationLearner has no participation', async function () {
        // given
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        databaseBuilder.factory.buildOrganizationLearner({ organizationId });
        await databaseBuilder.commit();

        // when
        const { data } = await organizationLearnerRepository.findPaginatedFilteredOrganizationLearners({
          organizationId,
        });

        // then
        const lastParticipationDatesAsArray = data.map((result: $TSFixMe) => result.lastParticipationDate);
        expect(lastParticipationDatesAsArray).to.deep.equal([null]);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateUserIdWhereNull', function () {
    let userId: $TSFixMe;
    let organizationLearnerId;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update userId if it was null before', async function () {
      // given
      organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({
        userId: null,
      }).id;
      await databaseBuilder.commit();

      // when
      const updatedOrganizationLearner = await organizationLearnerRepository.updateUserIdWhereNull({
        organizationLearnerId,
        userId,
      });

      // then
      expect(updatedOrganizationLearner.userId).to.equal(userId);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw where organizationLearner is already linked with a user', async function () {
      // given
      organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({
        userId,
      }).id;
      await databaseBuilder.commit();

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(organizationLearnerRepository.updateUserIdWhereNull)({
        organizationLearnerId,
        userId,
      });

      // then
      expect(error).to.be.an.instanceOf(OrganizationLearnerNotFound);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isActive', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true when there is no organization learner', async function () {
      const userId = databaseBuilder.factory.buildUser().id;
      const campaignId = databaseBuilder.factory.buildCampaign().id;
      databaseBuilder.factory.buildCampaignParticipation({ userId, campaignId });
      await databaseBuilder.commit();

      const isActive = await organizationLearnerRepository.isActive({ userId, campaignId });

      expect(isActive).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true when the organization learner is active', async function () {
      const userId = databaseBuilder.factory.buildUser().id;
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
      databaseBuilder.factory.buildCampaignParticipation({ userId, campaignId });
      databaseBuilder.factory.buildOrganizationLearner({ userId, organizationId, isDisabled: false });
      await databaseBuilder.commit();

      const isActive = await organizationLearnerRepository.isActive({ userId, campaignId });

      expect(isActive).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false when the organization learner is disabled', async function () {
      const userId = databaseBuilder.factory.buildUser().id;
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
      databaseBuilder.factory.buildCampaignParticipation({ userId, campaignId });
      databaseBuilder.factory.buildOrganizationLearner({ userId, organizationId, isDisabled: true });
      await databaseBuilder.commit();

      const isActive = await organizationLearnerRepository.isActive({ userId, campaignId });

      expect(isActive).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('takes into account only organization learner for the given userId', async function () {
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
      const userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildCampaignParticipation({ userId, campaignId });
      databaseBuilder.factory.buildOrganizationLearner({ userId, organizationId, isDisabled: true });

      const otherUserId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildCampaignParticipation({ userId: otherUserId, campaignId });
      databaseBuilder.factory.buildOrganizationLearner({ userId: otherUserId, organizationId, isDisabled: false });
      await databaseBuilder.commit();

      const isActive = await organizationLearnerRepository.isActive({ userId: otherUserId, campaignId });

      expect(isActive).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('takes into account only organization learner for the given campaignId', async function () {
      const userId = databaseBuilder.factory.buildUser().id;
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
      databaseBuilder.factory.buildCampaignParticipation({ userId, campaignId });
      databaseBuilder.factory.buildOrganizationLearner({ userId, organizationId, isDisabled: true });

      const otherOrganizationId = databaseBuilder.factory.buildOrganization().id;
      const otherCampaignId = databaseBuilder.factory.buildCampaign({ organizationId: otherOrganizationId }).id;
      databaseBuilder.factory.buildCampaignParticipation({ userId, campaignId: otherCampaignId });
      databaseBuilder.factory.buildOrganizationLearner({
        userId,
        organizationId: otherOrganizationId,
        isDisabled: false,
      });
      await databaseBuilder.commit();

      const isActive = await organizationLearnerRepository.isActive({ userId, campaignId: otherCampaignId });

      expect(isActive).to.be.true;
    });
  });
});
