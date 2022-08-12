// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkUserI... Remove this comment to see the full error message
const checkUserIsAdminAndManagingStudentsForOrganization = require('../../../../lib/application/usecases/checkUserIsAdminAndManagingStudentsForOrganization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../../lib/domain/models/Membership');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | API | checkUserIsAdminAndManagingStudentsForOrganization', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when the user does not belongs to the organization', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false', async function () {
      const organization = databaseBuilder.factory.buildOrganization({ type: 'SUP', isManagingStudents: true });
      const user = databaseBuilder.factory.buildUser();

      await databaseBuilder.commit();

      const belongsToSupOrganization = await checkUserIsAdminAndManagingStudentsForOrganization.execute(
        user.id,
        organization.id,
        'SUP'
      );

      expect(belongsToSupOrganization).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when the user belongs to the organization is admin, the organization manages students and has the correct type', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false', async function () {
      const organization = databaseBuilder.factory.buildOrganization({ type: 'SUP', isManagingStudents: true });
      const user = databaseBuilder.factory.buildUser();
      databaseBuilder.factory.buildMembership({
        userId: user.id,
        organizationId: organization.id,
        organizationRole: Membership.roles.ADMIN,
      });
      await databaseBuilder.commit();

      const belongsToSupOrganization = await checkUserIsAdminAndManagingStudentsForOrganization.execute(
        user.id,
        organization.id,
        'SUP'
      );

      expect(belongsToSupOrganization).to.be.true;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when the user belongs to the organization but is not admin,', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false', async function () {
      const organization = databaseBuilder.factory.buildOrganization({ type: 'SUP', isManagingStudents: true });
      const user = databaseBuilder.factory.buildUser();
      databaseBuilder.factory.buildMembership({
        userId: user.id,
        organizationId: organization.id,
        organizationRole: Membership.roles.MEMBER,
      });
      await databaseBuilder.commit();

      const belongsToSupOrganization = await checkUserIsAdminAndManagingStudentsForOrganization.execute(
        user.id,
        organization.id,
        'SUP'
      );

      expect(belongsToSupOrganization).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when the user belongs to an organization that is not managing students,', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false', async function () {
      const organization = databaseBuilder.factory.buildOrganization({ type: 'SUP', isManagingStudents: false });
      const user = databaseBuilder.factory.buildUser();
      databaseBuilder.factory.buildMembership({
        userId: user.id,
        organizationId: organization.id,
        organizationRole: Membership.roles.ADMIN,
      });
      await databaseBuilder.commit();

      const belongsToSupOrganization = await checkUserIsAdminAndManagingStudentsForOrganization.execute(
        user.id,
        organization.id,
        'SUP'
      );

      expect(belongsToSupOrganization).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when the user belongs to an organization that has not the given organization type,', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false', async function () {
      const organization = databaseBuilder.factory.buildOrganization({ type: 'SCO', isManagingStudents: true });
      const user = databaseBuilder.factory.buildUser();
      databaseBuilder.factory.buildMembership({
        userId: user.id,
        organizationId: organization.id,
        organizationRole: Membership.roles.ADMIN,
      });
      await databaseBuilder.commit();

      const belongsToSupOrganization = await checkUserIsAdminAndManagingStudentsForOrganization.execute(
        user.id,
        organization.id,
        'SUP'
      );

      expect(belongsToSupOrganization).to.be.false;
    });
  });
});
