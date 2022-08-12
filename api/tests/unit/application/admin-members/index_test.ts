// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainBuil... Remove this comment to see the full error message
const { domainBuilder, expect, sinon, HttpTestServer } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ROLES'.
const { ROLES } = require('../../../../lib/domain/constants').PIX_ADMIN;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'adminMembe... Remove this comment to see the full error message
const adminMemberController = require('../../../../lib/application/admin-members/admin-member-controller');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const adminMembersRouter = require('../../../../lib/application/admin-members');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Router | admin-members-router', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/admin-members/me', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a response with an HTTP status code 200', async function () {
      // given
      const adminMember = domainBuilder.buildAdminMember();
      sinon.stub(adminMemberController, 'getCurrentAdminMember').returns(adminMember);
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(adminMembersRouter);

      // when
      const { statusCode } = await httpTestServer.request('GET', '/api/admin/admin-members/me');

      // then
      expect(adminMemberController.getCurrentAdminMember).to.have.be.called;
      expect(statusCode).to.equal(200);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/admin-members', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a response with an HTTP status code 200 when user has role "SUPER_ADMIN"', async function () {
      // given
      const adminMembers = [domainBuilder.buildAdminMember()];
      sinon.stub(adminMemberController, 'findAll').returns(adminMembers);
      sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').returns(true);
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(adminMembersRouter);

      // when
      const { statusCode } = await httpTestServer.request('GET', '/api/admin/admin-members');

      // then
      expect(securityPreHandlers.checkAdminMemberHasRoleSuperAdmin).to.have.be.called;
      expect(adminMemberController.findAll).to.have.be.called;
      expect(statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a response with an HTTP status code 403 if user does not have the rights', async function () {
      // given
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(403).takeover());

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(adminMembersRouter);

      // when
      const { statusCode } = await httpTestServer.request('GET', '/api/admin/admin-members');

      // then
      expect(securityPreHandlers.checkAdminMemberHasRoleSuperAdmin).to.have.be.called;
      expect(statusCode).to.equal(403);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/admin/admin-members', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has role "SUPER_ADMIN"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a response with an HTTP status code 201', async function () {
        // given
        const adminMember = domainBuilder.buildAdminMember();
        sinon
          .stub(adminMemberController, 'saveAdminMember')
          .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(adminMember).created());
        sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').returns(true);
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(adminMembersRouter);

        // when
        const { statusCode } = await httpTestServer.request('POST', '/api/admin/admin-members', {
          data: { type: 'admin-members', attributes: { role: ROLES.SUPER_ADMIN, email: 'fire.bot@example.net' } },
        });

        // then
        expect(statusCode).to.equal(201);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when role attribute is missing', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a response with an HTTP status code 400', async function () {
          // given
          sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').returns(true);
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(adminMembersRouter);

          // when
          const { statusCode } = await httpTestServer.request('POST', '/api/admin/admin-members', {
            data: { type: 'admin-members', attributes: { email: 'fire.bot@example.net' } },
          });

          // then
          expect(statusCode).to.equal(400);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when role attribute is not valid', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a response with an HTTP status code 400', async function () {
          // given
          const adminMember = domainBuilder.buildAdminMember();
          sinon.stub(adminMemberController, 'saveAdminMember').returns(adminMember);
          sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').returns(true);
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(adminMembersRouter);

          // when
          const { statusCode } = await httpTestServer.request('POST', '/api/admin/admin-members', {
            data: { type: 'admin-members', attributes: { role: 'My-Role', email: 'fire.bot@example.net' } },
          });

          // then
          expect(statusCode).to.equal(400);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when email attribute is missing', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a response with an HTTP status code 400', async function () {
          // given
          const adminMember = domainBuilder.buildAdminMember();
          sinon.stub(adminMemberController, 'saveAdminMember').returns(adminMember);
          sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').returns(true);
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(adminMembersRouter);

          // when
          const { statusCode } = await httpTestServer.request('POST', '/api/admin/admin-members', {
            data: { type: 'admin-members', attributes: { role: ROLES.SUPER_ADMIN } },
          });

          // then
          expect(statusCode).to.equal(400);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when email attribute is not valid', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a response with an HTTP status code 400', async function () {
          // given
          const adminMember = domainBuilder.buildAdminMember();
          sinon.stub(adminMemberController, 'saveAdminMember').returns(adminMember);
          sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').returns(true);
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(adminMembersRouter);

          // when
          const { statusCode } = await httpTestServer.request('POST', '/api/admin/admin-members', {
            data: { type: 'admin-members', attributes: { role: ROLES.SUPER_ADMIN, email: 'my-invalid-email' } },
          });

          // then
          expect(statusCode).to.equal(400);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when all attributes are missing', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a response with an HTTP status code 400', async function () {
          // given
          const adminMember = domainBuilder.buildAdminMember();
          sinon.stub(adminMemberController, 'saveAdminMember').returns(adminMember);
          sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').returns(true);
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(adminMembersRouter);

          // when
          const { statusCode } = await httpTestServer.request('POST', '/api/admin/admin-members', {
            data: { type: 'admin-members', attributes: {} },
          });

          // then
          expect(statusCode).to.equal(400);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user does not have role "SUPER_ADMIN"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a response with an HTTP status code 403', async function () {
        // given
        sinon
          .stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin')
          .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(403).takeover());
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(adminMembersRouter);

        // when
        const { statusCode } = await httpTestServer.request('POST', '/api/admin/admin-members', {
          data: { type: 'admin-members', attributes: { role: ROLES.SUPER_ADMIN, email: 'aqua.bot@example.net' } },
        });

        // then
        expect(statusCode).to.equal(403);
        expect(securityPreHandlers.checkAdminMemberHasRoleSuperAdmin).to.have.be.called;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/admin/admin-members/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when user has role "SUPER_ADMIN"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a response with an HTTP status code 200', async function () {
        // given
        const updatedAdminMember = domainBuilder.buildAdminMember();
        sinon.stub(adminMemberController, 'updateAdminMember').returns(updatedAdminMember);
        sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').returns(true);
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(adminMembersRouter);

        // when
        const { statusCode } = await httpTestServer.request('PATCH', '/api/admin/admin-members/1', {
          data: { type: 'admin-members', attributes: { role: ROLES.SUPER_ADMIN } },
        });

        // then
        expect(securityPreHandlers.checkAdminMemberHasRoleSuperAdmin).to.have.be.called;
        expect(statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 400 if the role value to update is invalid', async function () {
        // given
        sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').returns(true);
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(adminMembersRouter);

        // when
        const { statusCode } = await httpTestServer.request('PATCH', '/api/admin/admin-members/1', {
          data: { type: 'admin-members', attributes: { role: 'INVALID_ROLE' } },
        });

        // then
        expect(securityPreHandlers.checkAdminMemberHasRoleSuperAdmin).not.to.have.be.called;
        expect(statusCode).to.equal(400);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a response with an HTTP status code 403 if user does not have the rights', async function () {
      // given
      sinon.stub(adminMemberController, 'updateAdminMember').returns('ok');
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(403).takeover());
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(adminMembersRouter);

      // when
      const { statusCode } = await httpTestServer.request('PATCH', '/api/admin/admin-members/1', {
        data: { type: 'admin-members', attributes: { role: ROLES.SUPER_ADMIN } },
      });

      // then
      expect(securityPreHandlers.checkAdminMemberHasRoleSuperAdmin).to.have.be.called;
      expect(statusCode).to.equal(403);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PUT /api/admin/admin-members/{id}/deactivate', function () {
    const method = 'PUT';
    const url = '/api/admin/admin-members/1/deactivate';

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('When user has role "SUPER_ADMIN"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a response with an HTTP status code 200', async function () {
        // given
        sinon
          .stub(adminMemberController, 'deactivateAdminMember')
          .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(204));
        sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').returns(true);
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(adminMembersRouter);

        // when
        const { statusCode } = await httpTestServer.request(method, url);

        // then
        expect(securityPreHandlers.checkAdminMemberHasRoleSuperAdmin).to.have.be.called;
        expect(adminMemberController.deactivateAdminMember).to.have.be.called;
        expect(statusCode).to.equal(204);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 400 error when ID is invalid', async function () {
        // given
        sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').returns(true);
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(adminMembersRouter);

        // when
        const { statusCode } = await httpTestServer.request(method, '/api/admin/admin-members/invalidID/deactivate');

        // then
        expect(securityPreHandlers.checkAdminMemberHasRoleSuperAdmin).not.to.have.be.called;
        expect(statusCode).to.equal(400);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a response with an HTTP status code 403 if user does not have the rights', async function () {
      // given
      sinon.stub(adminMemberController, 'updateAdminMember').returns('ok');
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(403).takeover());
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(adminMembersRouter);

      // when
      const { statusCode } = await httpTestServer.request(method, url);

      // then
      expect(securityPreHandlers.checkAdminMemberHasRoleSuperAdmin).to.have.be.called;
      expect(statusCode).to.equal(403);
    });
  });
});
