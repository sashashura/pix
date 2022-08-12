// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, knex, databaseBuilder, catchErr, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../../lib/domain/models/Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationInvitation = require('../../../../lib/domain/models/OrganizationInvitation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationInvitationRepository = require('../../../../lib/infrastructure/repositories/organization-invitation-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfO... Remove this comment to see the full error message
const BookshelfOrganizationInvitation = require('../../../../lib/infrastructure/orm-models/OrganizationInvitation');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | OrganizationInvitationRepository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#create', function () {
    let organizationId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      organizationId = databaseBuilder.factory.buildOrganization().id;
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('organization-invitations').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save the organization invitation in db', async function () {
      // given
      const email = 'member@organization.org';
      const status = OrganizationInvitation.StatusType.PENDING;
      const code = 'ABCDEFGH01';
      const role = Membership.roles.ADMIN;

      // when
      const savedInvitation = await organizationInvitationRepository.create({ organizationId, email, code, role });

      // then
      expect(savedInvitation).to.be.instanceof(OrganizationInvitation);
      expect(savedInvitation.organizationId).equal(organizationId);
      expect(savedInvitation.email).equal(email);
      expect(savedInvitation.status).equal(status);
      expect(savedInvitation.code).equal(code);
      expect(savedInvitation.role).equal(role);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    let insertedOrganizationInvitation: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      insertedOrganizationInvitation = databaseBuilder.factory.buildOrganizationInvitation();
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should get the organization-invitation from db', async function () {
      // when
      const foundOrganizationInvitation = await organizationInvitationRepository.get(insertedOrganizationInvitation.id);

      // then
      expect(foundOrganizationInvitation).to.be.an.instanceof(OrganizationInvitation);
      expect(foundOrganizationInvitation.organizationId).to.equal(insertedOrganizationInvitation.organizationId);
      expect(foundOrganizationInvitation.email).to.equal(insertedOrganizationInvitation.email);
      expect(foundOrganizationInvitation.status).to.equal(insertedOrganizationInvitation.status);
      expect(foundOrganizationInvitation.code).to.equal(insertedOrganizationInvitation.code);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a rejection when organization-invitation id is not found', async function () {
      // given
      const nonExistentId = 10083;

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const requestErr = await catchErr(organizationInvitationRepository.get)(nonExistentId);

      // then
      expect(requestErr).to.be.instanceOf(NotFoundError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getByIdAndCode', function () {
    let insertedOrganizationInvitation: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      insertedOrganizationInvitation = databaseBuilder.factory.buildOrganizationInvitation();
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should get the organization-invitation by id and code', async function () {
      // given
      const { id, code } = insertedOrganizationInvitation;

      // when
      const foundOrganizationInvitation = await organizationInvitationRepository.getByIdAndCode({ id, code });

      // then
      expect(foundOrganizationInvitation).to.be.an.instanceof(OrganizationInvitation);
      expect(foundOrganizationInvitation.organizationId).to.equal(insertedOrganizationInvitation.organizationId);
      expect(foundOrganizationInvitation.email).to.equal(insertedOrganizationInvitation.email);
      expect(foundOrganizationInvitation.status).to.equal(insertedOrganizationInvitation.status);
      expect(foundOrganizationInvitation.code).to.equal(insertedOrganizationInvitation.code);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a rejection when organization-invitation id and code are not found', async function () {
      // given
      const nonExistentId = 10083;
      const nonExistentCode = 'ABCDEF';

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const requestErr = await catchErr(organizationInvitationRepository.getByIdAndCode)({
        id: nonExistentId,
        code: nonExistentCode,
      });

      // then
      expect(requestErr).to.be.instanceOf(NotFoundError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#markAsAccepted', function () {
    let organizationInvitation: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      organizationInvitation = databaseBuilder.factory.buildOrganizationInvitation();
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an Organization-invitation domain object', async function () {
      // when
      const organizationInvitationSaved = await organizationInvitationRepository.markAsAccepted(
        organizationInvitation.id
      );

      // then
      expect(organizationInvitationSaved).to.be.an.instanceof(OrganizationInvitation);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not add row in table organization-invitations', async function () {
      // given
      const nbOrganizationInvitationsBeforeUpdate = await BookshelfOrganizationInvitation.count();

      // when
      await organizationInvitationRepository.markAsAccepted(organizationInvitation.id);

      // then
      const nbOrganizationInvitationsAfterUpdate = await BookshelfOrganizationInvitation.count();
      expect(nbOrganizationInvitationsAfterUpdate).to.equal(nbOrganizationInvitationsBeforeUpdate);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update model in database', async function () {
      // given
      const statusAccepted = OrganizationInvitation.StatusType.ACCEPTED;

      // when
      const organizationInvitationSaved = await organizationInvitationRepository.markAsAccepted(
        organizationInvitation.id
      );

      // then
      expect(organizationInvitationSaved.id).to.equal(organizationInvitation.id);
      expect(organizationInvitationSaved.organizationId).to.equal(organizationInvitation.organizationId);
      expect(organizationInvitationSaved.email).to.equal(organizationInvitation.email);
      expect(organizationInvitationSaved.status).to.equal(statusAccepted);
      expect(organizationInvitationSaved.code).to.equal(organizationInvitation.code);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#markAsCancelled', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the cancelled organization invitation', async function () {
      // given
      const now = new Date('2021-01-02');
      const clock = sinon.useFakeTimers(now);
      const organizationInvitation = databaseBuilder.factory.buildOrganizationInvitation({
        updatedAt: new Date('2020-01-01T00:00:00Z'),
        status: OrganizationInvitation.StatusType.PENDING,
      });
      await databaseBuilder.commit();

      // when
      const organizationInvitationSaved = await organizationInvitationRepository.markAsCancelled({
        id: organizationInvitation.id,
      });

      // then
      expect(organizationInvitationSaved).to.be.an.instanceof(OrganizationInvitation);
      expect(organizationInvitationSaved.id).to.equal(organizationInvitation.id);
      expect(organizationInvitationSaved.organizationId).to.equal(organizationInvitation.organizationId);
      expect(organizationInvitationSaved.email).to.equal(organizationInvitation.email);
      expect(organizationInvitationSaved.status).to.equal(OrganizationInvitation.StatusType.CANCELLED);
      expect(organizationInvitationSaved.code).to.equal(organizationInvitation.code);
      expect(organizationInvitationSaved.updatedAt).to.be.deep.equal(now);
      clock.restore();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a not found error', async function () {
      // given
      const notExistingInvitationId = '5';

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(organizationInvitationRepository.markAsCancelled)({ id: notExistingInvitationId });

      // then
      expect(error).to.be.an.instanceOf(NotFoundError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findOnePendingByOrganizationIdAndEmail', function () {
    let organizationInvitation: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      // given
      databaseBuilder.factory.buildOrganizationInvitation({
        status: OrganizationInvitation.StatusType.ACCEPTED,
      });
      organizationInvitation = databaseBuilder.factory.buildOrganizationInvitation({
        status: OrganizationInvitation.StatusType.PENDING,
      });
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should retrieve one pending organization-invitation with given organizationId and email', async function () {
      const { organizationId, email } = organizationInvitation;

      // when
      const foundOrganizationInvitation = await organizationInvitationRepository.findOnePendingByOrganizationIdAndEmail(
        { organizationId, email }
      );

      // then
      expect(_.omit(foundOrganizationInvitation, 'organizationName')).to.deep.equal(organizationInvitation);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should retrieve one pending organization-invitation with given organizationId and case-insensitive email', async function () {
      const { organizationId, email } = organizationInvitation;

      const upperEmail = email.toUpperCase();
      // when
      const foundOrganizationInvitation = await organizationInvitationRepository.findOnePendingByOrganizationIdAndEmail(
        { organizationId, email: upperEmail }
      );

      // then
      expect(_.omit(foundOrganizationInvitation, 'organizationName')).to.deep.equal(organizationInvitation);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findPendingByOrganizationId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should find only pending organization-invitations from db by organizationId', async function () {
      // given
      const organization = databaseBuilder.factory.buildOrganization();

      databaseBuilder.factory.buildOrganizationInvitation({
        organizationId: organization.id,
        status: OrganizationInvitation.StatusType.PENDING,
      });
      databaseBuilder.factory.buildOrganizationInvitation({
        organizationId: organization.id,
        status: OrganizationInvitation.StatusType.PENDING,
      });
      databaseBuilder.factory.buildOrganizationInvitation({
        organizationId: organization.id,
        status: OrganizationInvitation.StatusType.ACCEPTED,
      });
      await databaseBuilder.commit();

      // when
      const foundOrganizationInvitations = await organizationInvitationRepository.findPendingByOrganizationId({
        organizationId: organization.id,
      });

      // then
      expect(foundOrganizationInvitations.length).to.equal(2);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return organization-invitations from most recent to oldest', async function () {
      // given
      const organization = databaseBuilder.factory.buildOrganization();
      const oldestOrganizationInvitationUpdatedAt = new Date('2019-02-01T00:00:00Z');
      const organizationInvitationUpdatedAt = new Date('2020-02-01T00:00:00Z');
      const latestOrganizationInvitationUpdatedAt = new Date('2021-02-01T00:00:00Z');

      databaseBuilder.factory.buildOrganizationInvitation({
        organizationId: organization.id,
        status: OrganizationInvitation.StatusType.PENDING,
        updatedAt: latestOrganizationInvitationUpdatedAt,
      });
      databaseBuilder.factory.buildOrganizationInvitation({
        organizationId: organization.id,
        status: OrganizationInvitation.StatusType.PENDING,
        updatedAt: organizationInvitationUpdatedAt,
      });
      databaseBuilder.factory.buildOrganizationInvitation({
        organizationId: organization.id,
        status: OrganizationInvitation.StatusType.PENDING,
        updatedAt: oldestOrganizationInvitationUpdatedAt,
      });
      await databaseBuilder.commit();

      // when
      const foundOrganizationInvitations = await organizationInvitationRepository.findPendingByOrganizationId({
        organizationId: organization.id,
      });

      // then
      expect(foundOrganizationInvitations[0].updatedAt).to.deep.equal(latestOrganizationInvitationUpdatedAt);
      expect(foundOrganizationInvitations[1].updatedAt).to.deep.equal(organizationInvitationUpdatedAt);
      expect(foundOrganizationInvitations[2].updatedAt).to.deep.equal(oldestOrganizationInvitationUpdatedAt);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an empty array on no result', async function () {
      // when
      const foundOrganizationInvitations = await organizationInvitationRepository.findPendingByOrganizationId({
        organizationId: 2978,
      });

      // then
      expect(foundOrganizationInvitations).to.deep.equal([]);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateModificationDate', function () {
    let clock: $TSFixMe;
    const now = new Date('2021-01-02');

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      clock = sinon.useFakeTimers(now);
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      clock.restore();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the modification date', async function () {
      // given
      const organizationId = 2323;
      databaseBuilder.factory.buildOrganization({
        id: organizationId,
      });
      const organizationInvitation = databaseBuilder.factory.buildOrganizationInvitation({
        organizationId,
        status: OrganizationInvitation.StatusType.PENDING,
        organizationName: 'super orga',
        updatedAt: new Date('2020-01-01T00:00:00Z'),
      });
      await databaseBuilder.commit();

      // when
      const result = await organizationInvitationRepository.updateModificationDate(organizationInvitation.id);

      // then
      const expectedUpdatedOrganizationInvitation = {
        ...organizationInvitation,
        updatedAt: now,
      };
      expect(result).to.be.instanceOf(OrganizationInvitation);
      expect(_.omit(result, 'organizationName')).to.be.deep.equal(expectedUpdatedOrganizationInvitation);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a not found error', async function () {
      // given
      const wrongOrganizationInvitationId = 1;
      databaseBuilder.factory.buildOrganization({ id: 23 });
      databaseBuilder.factory.buildOrganizationInvitation({
        organizationId: 23,
        status: OrganizationInvitation.StatusType.PENDING,
        updatedAt: new Date('2020-01-01T00:00:00Z'),
      });
      await databaseBuilder.commit();

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(organizationInvitationRepository.updateModificationDate)(
        wrongOrganizationInvitationId
      );

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });
});
