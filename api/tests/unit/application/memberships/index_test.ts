// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/memberships');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'membership... Remove this comment to see the full error message
const membershipController = require('../../../../lib/application/memberships/membership-controller');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Router | membership-router', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/admin/memberships/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 if user is Pix Admin', async function () {
      // given
      sinon.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf').returns(() => true);
      sinon.stub(membershipController, 'update').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(200));

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const id = 123;

      // when
      const response = await httpTestServer.request('PATCH', `/api/admin/memberships/${id}`);

      // then
      expect(response.statusCode).to.equal(200);
      expect(membershipController.update).to.have.been.called;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns forbidden access if admin member has CERTIF role', async function () {
      // given
      sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleCertif').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleSupport')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleMetier')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('PATCH', `/api/admin/memberships/1`);

      // then
      expect(response.statusCode).to.equal(403);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/memberships/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 if user is admin in organization', async function () {
      // given
      sinon.stub(securityPreHandlers, 'checkUserIsAdminInOrganization').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon.stub(membershipController, 'update').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(200));

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const membershipId = 123;

      // when
      const response = await httpTestServer.request('PATCH', `/api/memberships/${membershipId}`);

      // then
      expect(response.statusCode).to.equal(200);
      expect(membershipController.update).to.have.been.called;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 403 if user is not admin in organization', async function () {
      // given
      sinon
        .stub(securityPreHandlers, 'checkUserIsAdminInOrganization')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(403).takeover());
      sinon.stub(membershipController, 'update');

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const id = 123;

      // when
      const response = await httpTestServer.request('PATCH', `/api/memberships/${id}`);

      // then
      expect(response.statusCode).to.equal(403);
      expect(membershipController.update).to.have.not.been.called;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/admin/memberships', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns forbidden access if admin member has CERTIF role', async function () {
      // given
      sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleCertif').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleSupport')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleMetier')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('POST', `/api/admin/memberships`);

      // then
      expect(response.statusCode).to.equal(403);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/admin/memberships/{id}/disable', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 204 if user is Pix Admin', async function () {
      // given
      sinon.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf').returns(() => true);
      sinon.stub(membershipController, 'disable').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(204));

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const membershipId = 123;

      // when
      const response = await httpTestServer.request('POST', `/api/admin/memberships/${membershipId}/disable`);

      // then
      expect(response.statusCode).to.equal(204);
      expect(membershipController.disable).to.have.been.called;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns forbidden access if admin member has CERTIF role', async function () {
      // given
      sinon.stub(membershipController, 'disable');

      sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleCertif').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleSupport')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleMetier')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('POST', '/api/admin/memberships/1/disable');

      // then
      expect(response.statusCode).to.equal(403);
      expect(membershipController.disable).to.have.not.been.called;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/memberships/{id}/disable', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 204 if user is admin in organization', async function () {
      // given
      sinon.stub(securityPreHandlers, 'checkUserIsAdminInOrganization').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon.stub(membershipController, 'disable').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(204));

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const membershipId = 123;

      // when
      const response = await httpTestServer.request('POST', `/api/memberships/${membershipId}/disable`);

      // then
      expect(response.statusCode).to.equal(204);
      expect(membershipController.disable).to.have.been.called;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 403 if user is not admin in organization', async function () {
      // given
      sinon
        .stub(securityPreHandlers, 'checkUserIsAdminInOrganization')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(403).takeover());
      sinon.stub(membershipController, 'disable');

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const membershipId = 123;

      // when
      const response = await httpTestServer.request('POST', `/api/memberships/${membershipId}/disable`);

      // then
      expect(response.statusCode).to.equal(403);
      expect(membershipController.disable).to.have.not.been.called;
    });
  });
});
