const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'insertUser... Remove this comment to see the full error message
  insertUserWithRoleSuperAdmin,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ROLES'.
const { ROLES } = require('../../../../lib/domain/constants').PIX_ADMIN;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Application | Admin-members | Routes', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/admin-members/me', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 http status code', async function () {
      // given
      databaseBuilder.factory.buildUser.withRole();
      const admin = await insertUserWithRoleSuperAdmin();
      await databaseBuilder.commit();
      const server = await createServer();

      // when
      const response = await server.inject({
        headers: {
          authorization: generateValidRequestAuthorizationHeader(admin.id),
        },
        method: 'GET',
        url: '/api/admin/admin-members/me',
      });

      // then
      expect(response.statusCode).to.equal(200);
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 404 http status code when user is not a member of pix admin and has no role', async function () {
      // given
      const user = databaseBuilder.factory.buildUser();
      await databaseBuilder.commit();
      const server = await createServer();

      // when
      const response = await server.inject({
        headers: {
          authorization: generateValidRequestAuthorizationHeader(user.id),
        },
        method: 'GET',
        url: '/api/admin/admin-members/me',
      });

      // then
      expect(response.statusCode).to.equal(404);
      expect(response.statusMessage).to.equal('Not Found');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/admin-members', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 http status code when admin member has role "SUPER_ADMIN"', async function () {
      // given
      const admin = databaseBuilder.factory.buildUser.withRole({
        id: 1234,
        firstName: 'Super',
        lastName: 'Papa',
        email: 'super.papa@example.net',
        password: 'Password123',
        role: ROLES.SUPER_ADMIN,
      });

      await databaseBuilder.commit();
      const server = await createServer();

      // when
      const response = await server.inject({
        headers: {
          authorization: generateValidRequestAuthorizationHeader(admin.id),
        },
        method: 'GET',
        url: `/api/admin/admin-members`,
      });

      // then
      expect(response.statusCode).to.equal(200);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/admin/admin-members/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 http status code if admin member has role "SUPER_ADMIN"', async function () {
      // given
      const superAdmin = databaseBuilder.factory.buildUser.withRole();
      const pixAdminUserToUpdate = databaseBuilder.factory.buildUser.withRole();
      const pixAdminRole = databaseBuilder.factory.buildPixAdminRole({
        userId: pixAdminUserToUpdate.id,
        role: ROLES.SUPPORT,
      });
      await databaseBuilder.commit();
      const server = await createServer();

      // when
      const response = await server.inject({
        headers: {
          authorization: generateValidRequestAuthorizationHeader(superAdmin.id),
        },
        method: 'PATCH',
        url: `/api/admin/admin-members/${pixAdminRole.id}`,
        payload: {
          data: {
            attributes: {
              role: ROLES.CERTIF,
            },
          },
        },
      });

      // then
      expect(response.statusCode).to.equal(200);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PUT /api/admin/admin-members/{id}/deactivate', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 204 http status code if admin member has role "SUPER_ADMIN" and admin member has been successfully deactivated', async function () {
      // given
      const superAdmin = await databaseBuilder.factory.buildUser.withRole({ role: ROLES.SUPER_ADMIN });
      const user = databaseBuilder.factory.buildUser();
      const adminMemberToDeactivate = databaseBuilder.factory.buildPixAdminRole({
        userId: user.id,
        role: ROLES.SUPPORT,
      });

      await databaseBuilder.commit();
      const server = await createServer();

      // when
      const response = await server.inject({
        headers: {
          authorization: generateValidRequestAuthorizationHeader(superAdmin.id),
        },
        method: 'PUT',
        url: `/api/admin/admin-members/${adminMemberToDeactivate.id}/deactivate`,
      });

      // then
      expect(response.statusCode).to.equal(204);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/admin/admin-members', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when admin member has role "SUPER_ADMIN"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a response with an HTTP status code 201', async function () {
        // given
        const adminMemberWithRoleSuperAdmin = databaseBuilder.factory.buildUser.withRole({
          firstName: 'jaune',
          lastName: 'attends',
          email: 'jaune.attends@example.net',
          password: 'j@Un3@Tt3nds',
          role: ROLES.SUPER_ADMIN,
        });
        const user = databaseBuilder.factory.buildUser({
          id: 1101,
          firstName: '11',
          lastName: '01',
          email: '11.01@example.net',
        });
        await databaseBuilder.commit();
        const server = await createServer();

        // when
        const { statusCode, result } = await server.inject({
          headers: {
            authorization: generateValidRequestAuthorizationHeader(adminMemberWithRoleSuperAdmin.id),
          },
          method: 'POST',
          url: '/api/admin/admin-members',
          payload: {
            data: {
              attributes: {
                email: user.email,
                role: ROLES.CERTIF,
              },
            },
          },
        });

        // then
        expect(statusCode).to.equal(201);
        expect(result.data.attributes['user-id']).to.equal(1101);
        expect(result.data.attributes.role).to.equal('CERTIF');
        expect(result.data.attributes.email).to.equal('11.01@example.net');
      });
    });
  });
});
