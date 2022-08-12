// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, generateValidRequestAuthorizationHeader, databaseBuilder } = require('../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../lib/domain/models/Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../lib/application/security-pre-handlers');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Application | SecurityPreHandlers', function () {
  const jsonApiError403 = {
    errors: [
      {
        code: 403,
        title: 'Forbidden access',
        detail: 'Missing or insufficient permissions.',
      },
    ],
  };

  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkAdminMemberHasRoleSuperAdmin', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a well formed JSON API error when user is not authorized', async function () {
      // given
      const options = {
        method: 'PATCH',
        url: '/api/cache',
        headers: { authorization: generateValidRequestAuthorizationHeader() },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(403);
      expect(response.result).to.deep.equal(jsonApiError403);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkRequestedUserIsAuthenticatedUser', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a well formed JSON API error when user in query params is not the same as authenticated', async function () {
      // given
      const options = {
        method: 'GET',
        url: '/api/users/1/memberships',
        headers: { authorization: generateValidRequestAuthorizationHeader(2) },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(403);
      expect(response.result).to.deep.equal(jsonApiError403);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkUserBelongsToScoOrganizationAndManagesStudents', function () {
    let userId: $TSFixMe;
    let organizationId;
    let options: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userId = databaseBuilder.factory.buildUser().id;
      options = {
        method: 'GET',
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a well formed JSON API error when user is in a not sco organization', async function () {
      // given
      organizationId = databaseBuilder.factory.buildOrganization({ type: 'SUP' }).id;
      databaseBuilder.factory.buildMembership({ userId, organizationId });

      options.url = `/api/organizations/${organizationId}/students`;

      await databaseBuilder.commit();

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(403);
      expect(response.result).to.deep.equal(jsonApiError403);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a well formed JSON API error when user is in a sco orga that does not manage students', async function () {
      // given
      organizationId = databaseBuilder.factory.buildOrganization({ type: 'SCO', isManagingStudents: false }).id;
      databaseBuilder.factory.buildMembership({ userId, organizationId });

      options.url = `/api/organizations/${organizationId}/students`;

      await databaseBuilder.commit();

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(403);
      expect(response.result).to.deep.equal(jsonApiError403);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a well formed JSON API error when membership is disabled', async function () {
      // given
      organizationId = databaseBuilder.factory.buildOrganization({ type: 'SCO', isManagingStudents: true }).id;
      databaseBuilder.factory.buildMembership({ userId, organizationId, disabledAt: new Date() });

      options.url = `/api/organizations/${organizationId}/students`;

      await databaseBuilder.commit();

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(403);
      expect(response.result).to.deep.equal(jsonApiError403);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkUserIsAdminInOrganization', function () {
    let userId: $TSFixMe;
    let organizationId: $TSFixMe;
    let options: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userId = databaseBuilder.factory.buildUser().id;
      organizationId = databaseBuilder.factory.buildOrganization().id;
      options = {
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
        method: 'GET',
        url: `/api/organizations/${organizationId}/invitations`,
      };

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a well formed JSON API error when user is not admin in the organization', async function () {
      // given
      databaseBuilder.factory.buildMembership({
        userId,
        organizationId,
        organizationRole: Membership.roles.MEMBER,
      });

      await databaseBuilder.commit();

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(403);
      expect(response.result).to.deep.equal(jsonApiError403);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a well formed JSON API error when user is admin in the organization, but membership is disabled', async function () {
      // given
      databaseBuilder.factory.buildMembership({
        userId,
        organizationId,
        organizationRole: Membership.roles.ADMIN,
        disabledAt: new Date(),
      });

      await databaseBuilder.commit();

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(403);
      expect(response.result).to.deep.equal(jsonApiError403);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkUserIsAdminInSCOOrganizationAndManagesStudents', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      server.route({
        method: 'GET',
        path: '/test_route/{id}',
        handler: (r: $TSFixMe, h: $TSFixMe) => h.response({}).code(200),
        config: {
          pre: [
            {
              method: securityPreHandlers.checkUserIsAdminInSCOOrganizationManagingStudents,
            },
          ],
        },
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('respond 403 when the user is not member of the SCO organization managing students', async function () {
      const userId = databaseBuilder.factory.buildUser().id;
      const organizationId = databaseBuilder.factory.buildOrganization({ type: 'SCO', isManagingStudents: true }).id;

      await databaseBuilder.commit();

      const options = {
        method: 'GET',
        url: `/test_route/${organizationId}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      const response = await server.inject(options);

      expect(response.statusCode).to.equal(403);
      expect(response.result).to.deep.equal(jsonApiError403);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('respond 200 when the user is admin in the orga and it is SCO orga managing students', async function () {
      const userId = databaseBuilder.factory.buildUser().id;
      const organizationId = databaseBuilder.factory.buildOrganization({ type: 'SCO', isManagingStudents: true }).id;
      databaseBuilder.factory.buildMembership({
        userId,
        organizationId,
        organizationRole: Membership.roles.ADMIN,
      });

      await databaseBuilder.commit();

      const options = {
        method: 'GET',
        url: `/test_route/${organizationId}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      const response = await server.inject(options);

      expect(response.statusCode).to.equal(200);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkUserIsAdminInSUPOrganizationAndManagesStudents', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      server.route({
        method: 'GET',
        path: '/test_route/{id}',
        handler: (r: $TSFixMe, h: $TSFixMe) => h.response({}).code(200),
        config: {
          pre: [
            {
              method: securityPreHandlers.checkUserIsAdminInSUPOrganizationManagingStudents,
            },
          ],
        },
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('respond 403 when the user is not member of the SUP organization managing students', async function () {
      const userId = databaseBuilder.factory.buildUser().id;
      const organizationId = databaseBuilder.factory.buildOrganization({ type: 'SUP', isManagingStudents: true }).id;

      await databaseBuilder.commit();

      const options = {
        method: 'GET',
        url: `/test_route/${organizationId}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      const response = await server.inject(options);

      expect(response.statusCode).to.equal(403);
      expect(response.result).to.deep.equal(jsonApiError403);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('respond 200 when the user is admin in the organization and which id not a SUP organization managing students', async function () {
      const userId = databaseBuilder.factory.buildUser().id;
      const organizationId = databaseBuilder.factory.buildOrganization({ type: 'SUP', isManagingStudents: true }).id;
      databaseBuilder.factory.buildMembership({
        userId,
        organizationId,
        organizationRole: Membership.roles.ADMIN,
      });

      await databaseBuilder.commit();

      const options = {
        method: 'GET',
        url: `/test_route/${organizationId}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      const response = await server.inject(options);

      expect(response.statusCode).to.equal(200);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#adminMemberHasAtLeastOneAccessOf', function () {
    let userId: $TSFixMe;
    let organizationId: $TSFixMe;
    let options: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userId = databaseBuilder.factory.buildUser().id;
      organizationId = databaseBuilder.factory.buildOrganization().id;

      options = {
        method: 'GET',
        url: `/api/organizations/${organizationId}/memberships`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a well formed JSON API error when user is neither in the organization nor SUPERADMIN', async function () {
      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(403);
      expect(response.result).to.deep.equal(jsonApiError403);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a well formed JSON API error when user is in the orga, but membership is disabled', async function () {
      // given
      databaseBuilder.factory.buildMembership({ userId, organizationId, disabledAt: new Date() });
      await databaseBuilder.commit();

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(403);
      expect(response.result).to.deep.equal(jsonApiError403);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkUserIsMemberOfAnOrganization', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a well formed JSON API error when user is not authorized', async function () {
      // given
      const options = {
        method: 'GET',
        url: '/api/frameworks/pix/areas',
        headers: { authorization: generateValidRequestAuthorizationHeader() },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(403);
      expect(response.result).to.deep.equal(jsonApiError403);
    });
  });
});
