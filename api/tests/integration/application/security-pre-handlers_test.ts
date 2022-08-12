const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'HttpTestSe... Remove this comment to see the full error message
  HttpTestServer,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../lib/application/security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ROLES'.
const { ROLES } = require('../../../lib/domain/constants').PIX_ADMIN;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Application | SecurityPreHandlers', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('check admin member roles for pix admin routes', function () {
    let httpServerTest: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      const moduleUnderTest = {
        name: 'security-test',
        register: async function (server: $TSFixMe) {
          server.route([
            {
              method: 'GET',
              path: '/api/admin/users',
              handler: (r: $TSFixMe, h: $TSFixMe) => h.response().code(200),
              config: {
                pre: [
                  {
                    method: (request: $TSFixMe, h: $TSFixMe) =>
                      securityPreHandlers.adminMemberHasAtLeastOneAccessOf([
                        securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
                        securityPreHandlers.checkAdminMemberHasRoleCertif,
                      ])(request, h),
                  },
                ],
              },
            },
          ]);
        },
      };
      httpServerTest = new HttpTestServer();
      await httpServerTest.register(moduleUnderTest);
      httpServerTest.setupAuthentication();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns 403 when user is not an admin member', async function () {
      const user = databaseBuilder.factory.buildUser();

      await databaseBuilder.commit();

      const options = {
        method: 'GET',
        url: '/api/admin/users',
        headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
      };

      const response = await httpServerTest.requestObject(options);
      expect(response.statusCode).to.equal(403);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns 403 when user is and admin member without one of the allowed roles', async function () {
      const user = databaseBuilder.factory.buildUser.withRole({ disabledAt: null, role: ROLES.METIER });

      await databaseBuilder.commit();

      const options = {
        method: 'GET',
        url: '/api/admin/users',
        headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
      };

      const response = await httpServerTest.requestObject(options);
      expect(response.statusCode).to.equal(403);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns 403 when user is and admin member with one of the allowed roles but is disabled', async function () {
      const user = databaseBuilder.factory.buildUser.withRole({ disabledAt: new Date() });

      await databaseBuilder.commit();

      const response = await httpServerTest.requestObject({
        method: 'GET',
        url: '/api/admin/users',
        headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
      });
      expect(response.statusCode).to.equal(403);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns 200 when user is and admin member with one of the allowed roles', async function () {
      const user = databaseBuilder.factory.buildUser.withRole({ disabledAt: null });

      await databaseBuilder.commit();

      const options = {
        method: 'GET',
        url: '/api/admin/users',
        headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
      };

      const response = await httpServerTest.requestObject(options);
      expect(response.statusCode).to.equal(200);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkUserBelongsToOrganization', function () {
    let httpServerTest: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      const moduleUnderTest = {
        name: 'security-test',
        register: async function (server: $TSFixMe) {
          server.route([
            {
              method: 'GET',
              path: '/check/{id}',
              handler: (r: $TSFixMe, h: $TSFixMe) => h.response().code(200),
              config: {
                pre: [
                  {
                    method: securityPreHandlers.checkUserBelongsToOrganization,
                  },
                ],
              },
            },
          ]);
        },
      };
      httpServerTest = new HttpTestServer();
      await httpServerTest.register(moduleUnderTest);
      httpServerTest.setupAuthentication();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns 403 when user is not in the organization', async function () {
      const { id: userId } = databaseBuilder.factory.buildUser();
      const { id: organizationId } = databaseBuilder.factory.buildOrganization();
      await databaseBuilder.commit();

      const options = {
        method: 'GET',
        url: `/check/${organizationId}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      const response = await httpServerTest.requestObject(options);

      expect(response.statusCode).to.equal(403);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns 200 when the user belongs to the organization', async function () {
      const { id: userId } = databaseBuilder.factory.buildUser();
      const { id: organizationId } = databaseBuilder.factory.buildOrganization();
      databaseBuilder.factory.buildMembership({ userId, organizationId });
      await databaseBuilder.commit();

      const options = {
        method: 'GET',
        url: `/check/${organizationId}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      const response = await httpServerTest.requestObject(options);

      expect(response.statusCode).to.equal(200);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkUserIsMemberOfAnOrganization', function () {
    let httpServerTest: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      const moduleUnderTest = {
        name: 'security-test',
        register: async function (server: $TSFixMe) {
          server.route([
            {
              method: 'GET',
              path: '/framework/tubes',
              handler: (r: $TSFixMe, h: $TSFixMe) => h.response().code(200),
              config: {
                pre: [
                  {
                    method: securityPreHandlers.checkUserIsMemberOfAnOrganization,
                  },
                ],
              },
            },
          ]);
        },
      };
      httpServerTest = new HttpTestServer();
      await httpServerTest.register(moduleUnderTest);
      httpServerTest.setupAuthentication();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns 403 when user is not a member of an organization', async function () {
      const { id: userId } = databaseBuilder.factory.buildUser();
      await databaseBuilder.commit();

      const options = {
        method: 'GET',
        url: '/framework/tubes',
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      const response = await httpServerTest.requestObject(options);

      expect(response.statusCode).to.equal(403);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns 200 when the user is a member of an organization', async function () {
      const { id: userId } = databaseBuilder.factory.buildUser();
      const { id: organizationId } = databaseBuilder.factory.buildOrganization();
      databaseBuilder.factory.buildMembership({ userId, organizationId });
      await databaseBuilder.commit();

      const options = {
        method: 'GET',
        url: '/framework/tubes',
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      const response = await httpServerTest.requestObject(options);

      expect(response.statusCode).to.equal(200);
    });
  });
});
