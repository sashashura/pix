// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainBuil... Remove this comment to see the full error message
const { domainBuilder, expect, sinon, HttpTestServer } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgesCont... Remove this comment to see the full error message
const badgesController = require('../../../../lib/application/badges/badges-controller');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const badgesRouter = require('../../../../lib/application/badges');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Badges | Routes', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/badges/{id}', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has role "SUPER_ADMIN", "SUPPORT" or "METIER"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a response with an HTTP status code 200', async function () {
        // given
        const badge = domainBuilder.buildBadge();
        sinon.stub(badgesController, 'getBadge').returns(badge);
        sinon
          .stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf')
          .withArgs([
            securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
            securityPreHandlers.checkAdminMemberHasRoleSupport,
            securityPreHandlers.checkAdminMemberHasRoleMetier,
          ])
          .callsFake(() => (request: $TSFixMe, h: $TSFixMe) => h.response(true));
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(badgesRouter);

        // when
        const { statusCode } = await httpTestServer.request('GET', '/api/admin/badges/1');

        // then
        expect(statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when badge id is invalid', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a response with an HTTP status code 400', async function () {
          // given
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(badgesRouter);

          // when
          const { statusCode } = await httpTestServer.request('GET', '/api/admin/badges/invalid-id');

          // then
          expect(statusCode).to.equal(400);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has role "CERTIF"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a response with an HTTP status code 403', async function () {
        // given
        sinon
          .stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf')
          .withArgs([
            securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
            securityPreHandlers.checkAdminMemberHasRoleSupport,
            securityPreHandlers.checkAdminMemberHasRoleMetier,
          ])
          .callsFake(
            () => (request: $TSFixMe, h: $TSFixMe) =>
              h
                .response({ errors: new Error('forbidden') })
                .code(403)
                .takeover()
          );
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(badgesRouter);

        // when
        const { statusCode } = await httpTestServer.request('GET', '/api/admin/badges/1');

        // then
        expect(statusCode).to.equal(403);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('DELETE /api/admin/badges/{id}', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has role "SUPER_ADMIN", "SUPPORT" or "METIER"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP status code 204', async function () {
        // given
        sinon
          .stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf')
          .withArgs([
            securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
            securityPreHandlers.checkAdminMemberHasRoleSupport,
            securityPreHandlers.checkAdminMemberHasRoleMetier,
          ])
          .callsFake(() => (request: $TSFixMe, h: $TSFixMe) => h.response(true));
        sinon.stub(badgesController, 'deleteUnassociatedBadge').returns(null);
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(badgesRouter);

        // when
        const { statusCode } = await httpTestServer.request('DELETE', '/api/admin/badges/1');

        // then
        expect(statusCode).to.equal(204);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when badge id is invalid', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return an HTTP status code 400', async function () {
          // given
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(badgesRouter);

          // when
          const { statusCode } = await httpTestServer.request('DELETE', '/api/admin/badges/invalid-id');

          // then
          expect(statusCode).to.equal(400);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has role "CERTIF"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a response with an HTTP status code 403', async function () {
        // given
        sinon
          .stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf')
          .withArgs([
            securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
            securityPreHandlers.checkAdminMemberHasRoleSupport,
            securityPreHandlers.checkAdminMemberHasRoleMetier,
          ])
          .callsFake(
            () => (request: $TSFixMe, h: $TSFixMe) =>
              h
                .response({ errors: new Error('forbidden') })
                .code(403)
                .takeover()
          );
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(badgesRouter);

        // when
        const { statusCode } = await httpTestServer.request('DELETE', '/api/admin/badges/1');

        // then
        expect(statusCode).to.equal(403);
      });
    });
  });
});
