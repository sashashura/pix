const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'insertOrga... Remove this comment to see the full error message
  insertOrganizationUserWithRoleAdmin,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'insertUser... Remove this comment to see the full error message
  insertUserWithRoleSuperAdmin,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationInvitation = require('../../../../lib/domain/models/OrganizationInvitation');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Route | Organizations', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('DELETE /api/organizations/{id}/invitations/{invitationId}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 204 HTTP status code', async function () {
      // given
      const server = await createServer();

      const { adminUser, organization } = await insertOrganizationUserWithRoleAdmin();
      const invitation = databaseBuilder.factory.buildOrganizationInvitation({
        organizationId: organization.id,
        status: OrganizationInvitation.StatusType.PENDING,
      });

      const options = {
        method: 'DELETE',
        url: `/api/organizations/${organization.id}/invitations/${invitation.id}`,
        headers: {
          authorization: generateValidRequestAuthorizationHeader(adminUser.id),
        },
      };

      await databaseBuilder.commit();

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(204);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('DELETE /api/admin/organizations/{organizationId}/invitations/{invitationId}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 204 HTTP status code', async function () {
      // given
      const server = await createServer();

      const adminMember = await insertUserWithRoleSuperAdmin();
      const { organization } = await insertOrganizationUserWithRoleAdmin();
      const invitation = databaseBuilder.factory.buildOrganizationInvitation({
        organizationId: organization.id,
        status: OrganizationInvitation.StatusType.PENDING,
      });

      const options = {
        method: 'DELETE',
        url: `/api/admin/organizations/${organization.id}/invitations/${invitation.id}`,
        headers: {
          authorization: generateValidRequestAuthorizationHeader(adminMember.id),
        },
      };

      await databaseBuilder.commit();

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(204);
    });
  });
});
