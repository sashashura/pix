// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tubeContro... Remove this comment to see the full error message
const tubeController = require('../../../../lib/application/tubes/tube-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/tubes');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Tubes | Routes', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/tubes/{id}/skills', function () {
    const method = 'GET';
    const url = '/api/admin/tubes/recs1vdbHxX8X55G9/skills';

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a response with an HTTP status code 200 when user has role "SUPER_ADMIN", "SUPPORT" or "METIER"', async function () {
      // given
      sinon
        .stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf')
        .withArgs([
          securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
          securityPreHandlers.checkAdminMemberHasRoleSupport,
          securityPreHandlers.checkAdminMemberHasRoleMetier,
        ])
        .callsFake(() => (request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon.stub(tubeController, 'listSkills').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const { statusCode } = await httpTestServer.request(method, url);

      // then
      expect(statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a response with an HTTP status code 403 when user has role "CERTIF"', async function () {
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
      await httpTestServer.register(moduleUnderTest);

      // when
      const { statusCode } = await httpTestServer.request(method, url);

      // then
      expect(statusCode).to.equal(403);
    });
  });
});
